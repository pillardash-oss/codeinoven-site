import { error, redirect } from '@sveltejs/kit';
import { getAgentWithIcons } from '$lib/server/queries';
import type { RequestHandler } from './$types';

const FORMATS = ['svg', 'png', 'webp', 'ico'] as const;

/**
 * GET /api/agents/:slug/icon.:format — redirects to the stored file in the
 * requested format, 404 when that format is not available.
 */
export const GET: RequestHandler = ({ params }) => {
	const format = params.format as (typeof FORMATS)[number];
	if (!FORMATS.includes(format)) error(404, `Unsupported format: ${params.format}`);

	const entry = getAgentWithIcons(params.slug);
	if (!entry) error(404, `Unknown agent: ${params.slug}`);

	const icon = entry.allIcons.find((i) => i.format === format);
	if (!icon) error(404, `No ${format} icon available for ${params.slug}`);

	redirect(302, `/${icon.filePath}`);
};
