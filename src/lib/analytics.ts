import { detectPlatform, LINKS, MIRROR_ORIGIN, SITE_URL } from './config.ts';

export type AnalyticsChoice = 'allowed' | 'declined' | null;
type Properties = Record<string, string | number | boolean>;
interface EventRecord { event: string; properties: Properties; timestamp: string; }
const CHOICE = 'codeinoven.analytics.choice';
const VISITOR = 'codeinoven.analytics.visitor';
const SESSION = 'codeinoven.analytics.session';
const ENDPOINT = 'https://us.i.posthog.com/batch/';
const ROUTES = new Set(['/', '/download', '/privacy', '/desktop-coding-workspace']);
let token = '';
let visitor = '';
let session = '';
let sessionUpdated = 0;
let page = '';
let attribution: Properties = {};
let queue: EventRecord[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let request: AbortController | undefined;

function storage(store: Storage, key: string, value?: string): string | null {
	try {
		if (value === undefined) return store.getItem(key);
		if (value === '') store.removeItem(key);
		else store.setItem(key, value);
	} catch { /* Storage may be unavailable in private browsing. */ }
	return null;
}
function local(key: string, value?: string) {
	try { return storage(window.localStorage, key, value); } catch { return null; }
}
function tab(key: string, value?: string) {
	try { return storage(window.sessionStorage, key, value); } catch { return null; }
}
export function privacyRequested(): boolean {
	return navigator.doNotTrack === '1' ||
		(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}
export function analyticsChoice(): AnalyticsChoice {
	const choice = local(CHOICE);
	return choice === 'allowed' || choice === 'declined' ? choice : null;
}
export function configureAnalytics(projectToken: string): boolean {
	token = projectToken;
	return Boolean(token); // Local previews show the control but never send analytics.
}
function stop() {
	clearTimeout(timer);
	timer = undefined;
	request?.abort();
	queue = [];
	visitor = '';
	session = '';
	page = '';
	attribution = {};
}
export function syncAnalyticsConsent() {
	stop();
	if (!token || window.location.origin !== SITE_URL || privacyRequested() || analyticsChoice() !== 'allowed') return;
	const stored = local(VISITOR);
	visitor = stored && /^[\da-f-]{36}$/i.test(stored) ? stored : crypto.randomUUID();
	local(VISITOR, visitor);
	// TODO(accounts): identify with a stable account ID when accounts return,
	// merge anonymous history deliberately, and reset identity on logout.
	try {
		const storedSession: unknown = JSON.parse(tab(SESSION) ?? 'null');
		if (storedSession && typeof storedSession === 'object' && 'id' in storedSession &&
			'updated' in storedSession && typeof storedSession.id === 'string' &&
			/^[\da-f-]{36}$/i.test(storedSession.id) && typeof storedSession.updated === 'number') {
			session = storedSession.id;
			sessionUpdated = storedSession.updated;
		}
	} catch { /* A corrupt session is replaced on the next event. */ }
	const url = new URL(window.location.href);
	for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
		const value = url.searchParams.get(key);
		if (value) attribution[key] = value.replace(/[^\w .-]/g, '').slice(0, 80);
	}
	try {
		const referrer = new URL(document.referrer);
		if (referrer.origin !== SITE_URL) attribution.$referring_domain = referrer.hostname;
	} catch { /* Direct traffic has no referrer. */ }
}
export function chooseAnalytics(choice: Exclude<AnalyticsChoice, null>) {
	local(CHOICE, choice);
	if (choice === 'declined') {
		local(VISITOR, '');
		tab(SESSION, '');
	}
	syncAnalyticsConsent();
}
export function capture(event: string, properties: Properties = {}) {
	if (!visitor || privacyRequested() || analyticsChoice() !== 'allowed') return;
	const now = Date.now();
	if (!session || now - sessionUpdated > 30 * 60_000) session = crypto.randomUUID();
	sessionUpdated = now;
	tab(SESSION, JSON.stringify({ id: session, updated: now }));
	const pathname = ROUTES.has(window.location.pathname) ? window.location.pathname : '/other';
	queue.push({ event, timestamp: new Date(now).toISOString(), properties: {
		...attribution, ...properties, distinct_id: visitor, $session_id: session,
		$insert_id: crypto.randomUUID(), $process_person_profile: false,
		source: 'website', $lib: 'codeinoven-web', $pathname: pathname,
		$current_url: `${SITE_URL}${pathname}`, $host: new URL(SITE_URL).host,
		$os: detectPlatform() ?? 'other', device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
	} });
	if (queue.length > 20) queue.shift();
	if (!timer) timer = setTimeout(() => { timer = undefined; void flushAnalytics(); }, 3000);
}
export function pageViewed() {
	if (!visitor || page === window.location.pathname) return;
	page = window.location.pathname;
	capture('$pageview');
}
export async function flushAnalytics() {
	if (request || !queue.length || !visitor) return;
	if (privacyRequested() || analyticsChoice() !== 'allowed') { stop(); return; }
	clearTimeout(timer);
	timer = undefined;
	const batch = queue.splice(0, 20);
	const controller = new AbortController();
	request = controller;
	const timeout = setTimeout(() => controller.abort(), 5000);
	try {
		await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ api_key: token, batch }), credentials: 'omit',
			keepalive: true, signal: controller.signal });
	} catch { /* Best effort: analytics must never hold up navigation or retry indefinitely. */ }
	finally {
		clearTimeout(timeout);
		request = undefined;
		if (queue.length && visitor && !timer) timer = setTimeout(() => { timer = undefined; void flushAnalytics(); }, 3000);
	}
}
export function trackLink(event: MouseEvent) {
	if (!visitor || !(event.target instanceof Element)) return;
	const link = event.target.closest('a');
	if (!link) return;
	const url = new URL(link.href, window.location.href);
	const placement = link.closest('header') ? 'navigation' : link.closest('footer') ? 'footer' :
		link.closest('section')?.id || link.closest('section')?.classList.item(0) || 'content';
	if (url.origin === MIRROR_ORIGIN && /\.(dmg|exe|AppImage|deb)$/i.test(url.pathname)) {
		capture('website_download_clicked', { placement, platform: link.dataset.platform ??
			(/\.dmg$/i.test(url.pathname) ? 'macos' : /\.exe$/i.test(url.pathname) ? 'windows' : 'linux'),
			package: url.pathname.split('.').pop() ?? 'unknown', download_source: 'mirror' });
	} else if (url.origin === SITE_URL && url.pathname === '/download') {
		capture('website_download_cta_clicked', { placement });
	} else if (link.href === LINKS.releases) {
		capture('website_releases_clicked', { placement, platform: link.dataset.platform ?? 'all' });
	} else if (link.href === LINKS.github) capture('website_github_clicked', { placement });
	else return;
	void flushAnalytics();
}
export function disposeAnalytics() { void flushAnalytics(); clearTimeout(timer); }
