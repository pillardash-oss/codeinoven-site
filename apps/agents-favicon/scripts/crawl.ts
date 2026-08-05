/**
 * Daily crawler entry point.
 *
 *   npm run crawl              # crawl all active agents
 *   npm run crawl -- claude-code opencode   # crawl specific slugs
 *
 * Failures never delete a previously working icon.
 */
import { eq, inArray } from 'drizzle-orm';
import { db, agents, sources } from '../src/lib/db';
import { crawlAgent, type CrawlResult } from '../src/lib/crawler';

async function main() {
	const slugs = process.argv.slice(2).filter((a) => !a.startsWith('-'));

	let list = db.select().from(agents).where(eq(agents.status, 'active')).all();
	if (slugs.length > 0) {
		list = list.filter((a) => slugs.includes(a.slug));
		const missing = slugs.filter((s) => !list.some((a) => a.slug === s));
		if (missing.length) console.warn(`Unknown slugs skipped: ${missing.join(', ')}`);
	}

	if (list.length === 0) {
		console.log('No active agents to crawl. Run `npm run seed` first.');
		return;
	}

	const allSources = db
		.select()
		.from(sources)
		.where(inArray(sources.agentId, list.map((a) => a.id)))
		.all();

	console.log(`Crawling ${list.length} agent(s)...\n`);
	const started = Date.now();
	const results: CrawlResult[] = [];

	for (const agent of list) {
		const agentSources = allSources.filter((s) => s.agentId === agent.id);
		const result = await crawlAgent(agent, agentSources);
		results.push(result);
		const icon =
			result.status === 'updated'
				? '✔'
				: result.status === 'unchanged'
					? '='
					: result.status === 'kept-existing'
						? '↺'
						: '✖';
		console.log(`${icon} ${agent.slug.padEnd(22)} ${result.status}${result.detail ? ` — ${result.detail}` : ''}`);
	}

	const summary = results.reduce<Record<string, number>>((acc, r) => {
		acc[r.status] = (acc[r.status] ?? 0) + 1;
		return acc;
	}, {});
	const seconds = ((Date.now() - started) / 1000).toFixed(1);
	console.log(
		`\nDone in ${seconds}s — ${Object.entries(summary)
			.map(([k, v]) => `${k}: ${v}`)
			.join(', ')}`
	);

	// Non-zero exit only when *every* agent errored (systemic failure).
	if (results.length > 0 && results.every((r) => r.status === 'error')) {
		process.exit(1);
	}
}

main().catch((err) => {
	console.error('Crawl failed:', err);
	process.exit(1);
});
