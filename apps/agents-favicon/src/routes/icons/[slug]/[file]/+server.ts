import fs from 'node:fs';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { ICONS_DIR } from '$lib/db';
import type { RequestHandler } from './$types';

/** Only files the crawler itself writes may be served. */
const ALLOWED_FILES = new Set([
	'original.svg',
	'original.png',
	'original.webp',
	'original.ico',
	'preview.png'
]);

const CONTENT_TYPES: Record<string, string> = {
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.ico': 'image/x-icon'
};

/**
 * GET /icons/:slug/:file — serves crawled icon files from the persistent
 * data directory (outside the build output, survives redeploys).
 */
export const GET: RequestHandler = ({ params }) => {
	const { slug, file } = params;
	// Strict allowlist prevents any path traversal.
	if (!/^[a-z0-9-]+$/.test(slug) || !ALLOWED_FILES.has(file)) {
		error(404, 'Not found');
	}

	const filePath = path.join(ICONS_DIR, slug, file);
	if (!fs.existsSync(filePath)) error(404, 'Not found');

	const body = fs.readFileSync(filePath);
	const contentType = CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream';

	return new Response(new Uint8Array(body), {
		headers: {
			'content-type': contentType,
			'content-length': String(body.byteLength),
			'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
			// Defense in depth for the sanitized SVGs.
			'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'",
			'x-content-type-options': 'nosniff'
		}
	});
};
