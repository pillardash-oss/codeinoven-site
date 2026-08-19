import { lastUpdatedAt, listAgentsWithIcons } from '$lib/server/queries';
import type { RequestHandler } from './$types';

/**
 * GET /llms.txt — concise, agent-friendly description of the directory.
 */
export const GET: RequestHandler = ({ url, setHeaders }) => {
	const origin = url.origin;
	const entries = listAgentsWithIcons();
	const withIcons = entries.filter((e) => e.primaryIcon);

	const body = `# Favicons

> A daily updated directory of icons for AI coding agents and coding tools
> (Claude Code, OpenCode, Codex, Cursor, and more). SVG is the preferred format.
> PNG, WebP, and ICO are also available. All SVG files are sanitized.

Agents listed: ${entries.length} (${withIcons.length} with icons)
Last updated: ${lastUpdatedAt() ?? 'never'}

## What this contains

- Official product icons collected from each project's official website or
  GitHub repository. We store and publish the source URL for every icon.
- This is an icon directory, not a general-purpose search engine.

## Machine-readable endpoints

- ${origin}/catalog.json
  Full registry with every agent name, slug, vendor, icon URL, formats,
  source URL, and verification date. Use this instead of scraping HTML.
- ${origin}/api/agents
  List agents. Query params: ?q=<search terms> and ?format=svg|png|webp|ico
- ${origin}/api/agents/{slug}
  One agent with all available icon files.

## Direct icon URL patterns

- ${origin}/api/agents/{slug}/icon        -> 302 redirect to the primary file
- ${origin}/api/agents/{slug}/icon.svg    -> SVG (404 if unavailable)
- ${origin}/api/agents/{slug}/icon.png    -> PNG (404 if unavailable)
- ${origin}/icons/{slug}/original.{svg|png|webp|ico}  -> stored original
- ${origin}/icons/{slug}/preview.png      -> 256x256 PNG preview

Example slugs: ${withIcons.slice(0, 6).map((e) => e.agent.slug).join(', ')}

## Attribution and usage

- All logos and icons belong to their respective owners. Inclusion here does
  not imply endorsement.
- Files are provided for identification and integration purposes (e.g.
  showing which coding agent produced a commit or message).
- You are responsible for complying with each brand's usage guidelines.
- Icons are not necessarily freely licensed just because they are publicly
  accessible.

No API key is required. Cache responses and avoid heavy repeated requests.
`;

	setHeaders({ 'cache-control': 'public, max-age=3600' });
	return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
