import { json } from '@sveltejs/kit';
import { listAgentsWithIcons, serializeAgent, lastUpdatedAt } from '$lib/server/queries';
import type { RequestHandler } from './$types';

/**
 * GET /api/agents
 * Optional query params: ?q=<search> ?format=svg|png|webp|ico
 */
export const GET: RequestHandler = ({ url, setHeaders }) => {
	const q = url.searchParams.get('q')?.trim().toLowerCase();
	const format = url.searchParams.get('format')?.trim().toLowerCase();

	let entries = listAgentsWithIcons();
	if (q) {
		entries = entries.filter(({ agent }) =>
			[agent.name, agent.slug, agent.vendor ?? '', agent.description ?? '']
				.join(' ')
				.toLowerCase()
				.includes(q)
		);
	}
	if (format) {
		entries = entries.filter(({ allIcons }) => allIcons.some((i) => i.format === format));
	}

	setHeaders({ 'cache-control': 'public, max-age=300' });
	return json({
		total: entries.length,
		updatedAt: lastUpdatedAt(),
		agents: entries.map(serializeAgent)
	});
};
