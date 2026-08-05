/**
 * Website source discovery.
 *
 * Fetches the page HTML and collects icon candidates from:
 *   - <link rel="icon" | "apple-touch-icon" | "mask-icon">
 *   - web app manifest icons
 *   - og:image (last resort, often a banner — scored low)
 *   - /favicon.ico fallback
 */
import type { IconCandidate } from './types';
import { fetchWithLimits } from './types';

function resolveUrl(href: string, base: string): string | null {
	try {
		const u = new URL(href, base);
		if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
		return u.toString();
	} catch {
		return null;
	}
}

/** Extract attributes of a tag string into a lowercase-keyed map. */
function attrs(tag: string): Record<string, string> {
	const out: Record<string, string> = {};
	for (const m of tag.matchAll(/([a-zA-Z-:]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) {
		out[m[1].toLowerCase()] = m[3] ?? m[4] ?? '';
	}
	return out;
}

export async function discoverWebsiteCandidates(websiteUrl: string): Promise<IconCandidate[]> {
	const candidates: IconCandidate[] = [];
	let html = '';
	let finalUrl = websiteUrl;

	try {
		const res = await fetchWithLimits(websiteUrl, {
			headers: { accept: 'text/html,application/xhtml+xml' }
		});
		if (res.ok) {
			finalUrl = res.url || websiteUrl;
			html = (await res.text()).slice(0, 1_500_000);
		}
	} catch {
		// fall through: we can still try /favicon.ico
	}

	if (html) {
		// <link> based icons
		for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
			const a = attrs(m[0]);
			const rel = (a.rel ?? '').toLowerCase();
			if (!a.href) continue;

			if (/(^|\s)(icon|shortcut icon|alternate icon)(\s|$)/.test(rel)) {
				const url = resolveUrl(a.href, finalUrl);
				if (url) candidates.push({ url, sourceType: 'website', hint: 'link-icon', declaredSizes: a.sizes });
			} else if (rel.includes('apple-touch-icon')) {
				const url = resolveUrl(a.href, finalUrl);
				if (url)
					candidates.push({ url, sourceType: 'website', hint: 'apple-touch-icon', declaredSizes: a.sizes });
			} else if (rel.includes('mask-icon')) {
				const url = resolveUrl(a.href, finalUrl);
				if (url) candidates.push({ url, sourceType: 'website', hint: 'mask-icon' });
			} else if (rel.includes('manifest')) {
				const manifestUrl = resolveUrl(a.href, finalUrl);
				if (manifestUrl) {
					try {
						const mres = await fetchWithLimits(manifestUrl);
						if (mres.ok) {
							const manifest = (await mres.json()) as {
								icons?: { src?: string; sizes?: string }[];
							};
							for (const icon of manifest.icons ?? []) {
								if (!icon.src) continue;
								const url = resolveUrl(icon.src, manifestUrl);
								if (url)
									candidates.push({
										url,
										sourceType: 'website',
										hint: 'manifest-icon',
										declaredSizes: icon.sizes
									});
							}
						}
					} catch {
						// ignore malformed manifests
					}
				}
			}
		}

		// og:image — usually a banner; only useful when nothing else exists.
		for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
			const a = attrs(m[0]);
			if ((a.property === 'og:image' || a.name === 'og:image') && a.content) {
				const url = resolveUrl(a.content, finalUrl);
				if (url) candidates.push({ url, sourceType: 'website', hint: 'og-image' });
			}
		}
	}

	// /favicon.ico fallback always exists as a candidate.
	const fallback = resolveUrl('/favicon.ico', finalUrl);
	if (fallback) candidates.push({ url: fallback, sourceType: 'website', hint: 'favicon-ico' });

	return candidates.slice(0, 20);
}
