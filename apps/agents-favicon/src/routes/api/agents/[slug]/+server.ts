import { error, json } from '@sveltejs/kit';
import { getAgentWithIcons, serializeAgent } from '$lib/server/queries';
import type { RequestHandler } from './$types';

/** GET /api/agents/:slug */
export const GET: RequestHandler = ({ params, setHeaders }) => {
	const entry = getAgentWithIcons(params.slug);
	if (!entry) error(404, `Unknown agent: ${params.slug}`);

	setHeaders({ 'cache-control': 'public, max-age=300' });
	return json({
		...serializeAgent(entry),
		icons: entry.allIcons.map((i) => ({
			format: i.format,
			url: `/${i.filePath}`,
			source: i.sourceUrl,
			width: i.width,
			height: i.height,
			isPrimary: i.isPrimary,
			verifiedAt: i.verifiedAt
		}))
	});
};
