import { detectPlatform, LINKS, MIRROR_ORIGIN, SITE_URL } from './config.ts';

/** `null` is allowed because `$ip: null` is how a sender tells PostHog to drop the address. */
type Properties = Record<string, string | number | boolean | null>;
export type AnalyticsChoice = 'allowed' | 'declined' | null;
interface EventRecord { event: string; properties: Properties; timestamp: string; }
const CHOICE = 'codeinoven.analytics.choice';
const VISITOR = 'codeinoven.analytics.visitor';
const SESSION = 'codeinoven.analytics.session';
const ENDPOINT = 'https://us.i.posthog.com/batch/';
/** A PostHog project ingestion key. A personal key must never reach the browser. */
const INGESTION_TOKEN = /^phc_[\w-]+$/;
/** Routes this site serves. Anything else is folded so pageviews cannot explode the property's cardinality. */
const ROUTES = new Set(['/', '/download', '/privacy', '/desktop-coding-workspace', '/guide']);
/**
 * European zones that the IANA database files under another continent. Anything
 * starting `Europe/` already covers the EU, the EEA and the UK.
 */
const EUROPEAN_ZONES = new Set([
	'Africa/Ceuta', 'Arctic/Longyearbyen', 'Asia/Famagusta', 'Asia/Istanbul',
	'Asia/Nicosia', 'Atlantic/Azores', 'Atlantic/Canary', 'Atlantic/Madeira', 'Atlantic/Reykjavik'
]);
let token = '';
let visitor = '';
let session = '';
let sessionUpdated = 0;
let page = '';
let attribution: Properties = {};
let queue: EventRecord[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let request: AbortController | undefined;
/** Resolved once per page load. See `consentRequired`. */
let consentNeeded: boolean | null = null;

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
/**
 * Visitors who explicitly asked not to be tracked are left alone. This is not a
 * prompt and needs no UI: it is the browser's own signal, and we honour it.
 */
export function privacyRequested(): boolean {
	return navigator.doNotTrack === '1' ||
		(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}
/**
 * Whether this visitor must opt in before anything is collected.
 *
 * Read from the browser's own time zone, so no IP lookup, no network request and
 * no geolocation prompt happen. A time zone is a coarse signal: it errs toward
 * asking more often than strictly necessary, because showing the card to
 * someone outside Europe costs a dismissal while the reverse does not.
 */
export function consentRequired(): boolean {
	if (consentNeeded !== null) return consentNeeded;
	// An undetectable region is treated as one that needs consent.
	let zone = '';
	try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''; } catch { /* Fall through to required. */ }
	consentNeeded = !zone || zone.startsWith('Europe/') || EUROPEAN_ZONES.has(zone);
	return consentNeeded;
}
export function analyticsChoice(): AnalyticsChoice {
	const choice = local(CHOICE);
	return choice === 'allowed' || choice === 'declined' ? choice : null;
}
/** True when collection may run: freely outside Europe, or after an opt-in inside it. */
export function analyticsGranted(): boolean {
	return !consentRequired() || analyticsChoice() === 'allowed';
}
export function configureAnalytics(projectToken: string): boolean {
	// Refuse a personal API key or any other shape: it is invalid for ingestion
	// (PostHog answers 401) and shipping one publicly is a credential leak.
	token = INGESTION_TOKEN.test(projectToken) ? projectToken : '';
	return Boolean(token); // Local previews send nothing, because the origin check below fails.
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
/**
 * Establish the identifiers analytics runs on, or wait for a European visitor
 * to make a choice. Called on page load and again whenever that choice changes.
 */
export function startAnalytics() {
	stop();
	if (!token || window.location.origin !== SITE_URL || privacyRequested() || !analyticsGranted()) return;
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
/** Record a European visitor's decision and start or stop collection to match. */
export function chooseAnalytics(choice: Exclude<AnalyticsChoice, null>) {
	local(CHOICE, choice);
	if (choice === 'declined') {
		local(VISITOR, '');
		tab(SESSION, '');
	}
	startAnalytics();
}
export function capture(event: string, properties: Properties = {}) {
	if (!visitor || privacyRequested()) return;
	const now = Date.now();
	if (!session || now - sessionUpdated > 30 * 60_000) session = crypto.randomUUID();
	sessionUpdated = now;
	tab(SESSION, JSON.stringify({ id: session, updated: now }));
	const raw = window.location.pathname.replace(/\/+$/, '') || '/';
	const pathname = ROUTES.has(raw) ? raw : '/other';
	queue.push({ event, timestamp: new Date(now).toISOString(), properties: {
		...attribution, ...properties, distinct_id: visitor, $session_id: session,
		$insert_id: crypto.randomUUID(), $process_person_profile: false,
		// Website interaction only. Location and IP are excluded, matching the
		// desktop app's sender, so no visitor is placed beyond a page and a device.
		$geoip_disable: true, $ip: null,
		source: 'website', $lib: 'codeinoven-web', $pathname: pathname,
		$current_url: `${SITE_URL}${pathname}`, $host: new URL(SITE_URL).host,
		$os: detectPlatform() ?? 'other', device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
	} });
	if (queue.length > 20) queue.shift();
	if (!timer) timer = setTimeout(() => { timer = undefined; void flushAnalytics(); }, 3000);
}
export function pageViewed() {
	// Normalized so `/guide` and `/guide/` are one visit, not two.
	const path = (window.location.pathname.replace(/\/+$/, '') || '/') + window.location.search;
	if (!visitor || page === path) return;
	page = path;
	capture('$pageview');
}
export async function flushAnalytics() {
	if (request || !queue.length || !visitor) return;
	if (privacyRequested()) { stop(); return; }
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
