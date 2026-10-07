/** Run with CODEINOVEN_POSTHOG_ADMIN_KEY in the environment. Never bundle this personal key. */
const project = process.argv[2] ?? '651070';
const key = process.env.CODEINOVEN_POSTHOG_ADMIN_KEY;
if (!key || !/^\d+$/.test(project)) throw new Error('A personal API key and numeric project ID are required.');
const base = `https://us.posthog.com/api/projects/${project}`;
const name = 'CodeInOven website';
async function api(path: string, body?: unknown): Promise<Record<string, unknown>> {
	const response = await fetch(`${base}${path}`, { method: body ? 'POST' : 'GET',
		headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
		body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(30_000) });
	if (!response.ok) throw new Error(`PostHog returned HTTP ${response.status}`);
	const result: unknown = await response.json();
	if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('Unexpected PostHog response');
	return result as Record<string, unknown>;
}
async function list(path: string) {
	const items: Record<string, unknown>[] = [];
	let next: string | null = path;
	for (let count = 0; next && count < 100; count++) {
		const response = await api(next);
		if (!Array.isArray(response.results)) throw new Error('Unexpected PostHog list');
		for (const value of response.results) {
			if (value && typeof value === 'object' && !Array.isArray(value)) items.push(value);
		}
		next = null;
		if (typeof response.next === 'string') {
			const url = new URL(response.next);
			if (url.origin !== 'https://us.posthog.com' || !url.pathname.startsWith(`/api/projects/${project}/`)) throw new Error('Unexpected pagination URL');
			next = `${url.pathname.slice(`/api/projects/${project}`.length)}${url.search}`;
		}
	}
	if (next) throw new Error('Pagination limit exceeded');
	return items;
}
const dashboards = await list(`/dashboards/?search=${encodeURIComponent(name)}&limit=100`);
const dashboard = dashboards.find((item) => item.name === name && !item.deleted) ??
	await api('/dashboards/', { name, description: 'Opt-in website traffic and download intent. Browser IDs are not unique people; clicks and command copies are not completed downloads.', pinned: true });
if (typeof dashboard.id !== 'number') throw new Error('Missing dashboard ID');
const website = { key: 'source', value: ['website'], operator: 'exact', type: 'event' };
function trend(event: string, math = 'total', breakdown?: string) {
	return { kind: 'InsightVizNode', source: { kind: 'TrendsQuery', dateRange: { date_from: '-30d' },
		interval: 'day', series: [{ kind: 'EventsNode', event, math, properties: [website] }],
		trendsFilter: { display: 'ActionsLineGraph' },
		...(breakdown ? { breakdownFilter: { breakdown, breakdown_type: 'event' } } : {}) } };
}
function table(query: string) { return { kind: 'DataTableNode', source: { kind: 'HogQLQuery', query } }; }
const where = "properties.source = 'website' AND timestamp >= now() - INTERVAL 30 DAY";
const insights = [
	{ name: 'Daily website browsers', description: 'Distinct consenting browser IDs, not unique people.', query: trend('$pageview', 'dau') },
	{ name: 'Pages visited', description: 'Page views by route.', query: trend('$pageview', 'total', '$pathname') },
	{ name: 'Traffic sources and campaigns', description: 'External referrer domains and campaign tags, with direct traffic included.', query: table(`SELECT coalesce(nullIf(properties.$referring_domain, ''), 'Direct') AS referrer, coalesce(nullIf(properties.utm_source, ''), 'None') AS campaign_source, count() AS pageviews, count(DISTINCT distinct_id) AS browsers FROM events WHERE event = '$pageview' AND ${where} GROUP BY referrer, campaign_source ORDER BY browsers DESC LIMIT 50`) },
	{ name: 'Download CTA placement', description: 'Which links lead visitors to the download page.', query: trend('website_download_cta_clicked', 'total', 'placement') },
	{ name: 'Download intent by platform', description: 'Download link clicks and successful command copies. Not completed downloads.', query: table(`SELECT properties.platform AS platform, event AS intent, count() AS actions, count(DISTINCT distinct_id) AS browsers FROM events WHERE event IN ('website_download_clicked', 'website_download_command_copied') AND ${where} GROUP BY platform, intent ORDER BY actions DESC LIMIT 50`) },
	{ name: 'Device platform', description: 'Detected desktop platform or other/mobile.', query: trend('$pageview', 'dau', '$os') },
	{ name: 'Scroll depth by page', description: 'Highest observed scroll milestones. Helps identify pages visitors stop reading.', query: table(`SELECT properties.$pathname AS page, properties.depth AS depth_percent, count(DISTINCT distinct_id) AS browsers FROM events WHERE event = 'website_scroll_depth' AND ${where} GROUP BY page, depth_percent ORDER BY page, depth_percent LIMIT 50`) },
	{ name: 'Visit to download funnel', description: 'Ordered within 30 minutes by browser: page visit, download CTA, download link click. Direct downloads and command copies are measured separately.', query: { kind: 'InsightVizNode', source: { kind: 'FunnelsQuery', dateRange: { date_from: '-30d' },
		series: ['$pageview', 'website_download_cta_clicked', 'website_download_clicked'].map((event, order) => ({ kind: 'EventsNode', event, order, properties: [website] })),
		funnelsFilter: { funnelVizType: 'steps', funnelOrderType: 'ordered', funnelWindowInterval: 30, funnelWindowIntervalUnit: 'minute' } } } },
	{ name: 'GitHub and release fallback', description: 'Source interest and use of GitHub when mirror links are unavailable.', query: table(`SELECT event, properties.placement AS placement, count() AS clicks FROM events WHERE event IN ('website_github_clicked', 'website_releases_clicked') AND ${where} GROUP BY event, placement ORDER BY clicks DESC LIMIT 50`) }
];
const existing = (await list('/insights/?limit=100')).filter((item) => Array.isArray(item.dashboards) && item.dashboards.includes(dashboard.id));
let created = 0;
for (const insight of insights) {
	// Validate the query before creating a persistent insight.
	await api('/query/', { query: insight.query.source });
	if (!existing.some((item) => item.name === insight.name && !item.deleted)) {
		await api('/insights/', { ...insight, dashboards: [dashboard.id] });
		created++;
	}
}
process.stdout.write(JSON.stringify({ dashboard: `https://us.posthog.com/project/${project}/dashboard/${dashboard.id}`, created, validated: insights.length }) + '\n');
