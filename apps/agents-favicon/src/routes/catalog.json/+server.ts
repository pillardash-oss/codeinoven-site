import { json } from '@sveltejs/kit';
import { listAgentsWithIcons, serializeAgent, lastUpdatedAt } from '$lib/server/queries';
import type { RequestHandler } from './$types';

export const prerender = false;

/**
 * GET /catalog.json — full machine-readable registry so agents and apps can
 * consume the entire directory without scraping HTML.
 */
export const GET: RequestHandler = ({ url, setHeaders }) => {
	const entries = listAgentsWithIcons();

	setHeaders({ 'cache-control': 'public, max-age=600' });
	return json({
		name: 'Favicons',
		description:
			'Curated directory of icons for AI coding agents and agentic developer tools. Logos belong to their respective owners.',
		baseUrl: url.origin,
		updatedAt: lastUpdatedAt(),
		total: entries.length,
		agents: entries.map((entry) => {
			const s = serializeAgent(entry);
			return {
				name: s.name,
				slug: s.slug,
				vendor: s.vendor,
				description: s.description,
				icon: s.icon,
				format: s.format,
				formats: s.formats,
				preview: s.preview,
				source: s.source,
				websiteUrl: s.websiteUrl,
				githubUrl: s.githubUrl,
				verifiedAt: s.verifiedAt
			};
		})
	});
};
