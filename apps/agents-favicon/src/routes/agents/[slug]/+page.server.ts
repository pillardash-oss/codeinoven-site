import { error } from '@sveltejs/kit';
import { getAgentWithIcons, serializeAgent } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const entry = getAgentWithIcons(params.slug);
	if (!entry) error(404, `Unknown agent: ${params.slug}`);

	return {
		agent: serializeAgent(entry),
		icons: entry.allIcons
			.map((i) => ({
				format: i.format,
				url: `/${i.filePath}`,
				source: i.sourceUrl,
				width: i.width,
				height: i.height,
				isPrimary: i.isPrimary,
				verifiedAt: i.verifiedAt
			}))
			.sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
	};
};
