import { error, redirect } from '@sveltejs/kit';
import { getAgentWithIcons } from '$lib/server/queries';
import type { RequestHandler } from './$types';

/** GET /api/agents/:slug/icon — redirects to the current primary icon file. */
export const GET: RequestHandler = ({ params }) => {
	const entry = getAgentWithIcons(params.slug);
	if (!entry) error(404, `Unknown agent: ${params.slug}`);
	if (!entry.primaryIcon) error(404, `No icon available for ${params.slug}`);

	redirect(302, `/${entry.primaryIcon.filePath}`);
};
