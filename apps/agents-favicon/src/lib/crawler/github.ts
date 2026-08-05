/**
 * GitHub source discovery.
 *
 * For an official repository we look at (in order of usefulness):
 *   1. icon-like files in common asset directories of the repo tree
 *   2. images referenced from the README
 *   3. the repository social preview (open graph image)
 *   4. the org/user avatar (usually the product mark for dedicated orgs)
 *
 * Set GITHUB_TOKEN to raise the API rate limit (60/h anonymous, 5000/h authed).
 */
import type { IconCandidate } from './types';
import { fetchWithLimits } from './types';

const COMMON_DIRS = ['assets', 'public', 'static', 'docs', 'images', 'branding', 'logo', 'media', 'art', 'icons'];
const ICON_KEYWORDS = ['logo', 'icon', 'mark', 'favicon', 'symbol', 'brand'];
const EXTENSIONS = ['.svg', '.png', '.webp', '.ico'];

export function parseGithubRepo(url: string): { owner: string; repo: string } | null {
	const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
	if (!m) return null;
	return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
}

async function githubApi(path: string): Promise<unknown | null> {
	try {
		const headers: Record<string, string> = {
			accept: 'application/vnd.github+json',
			'x-github-api-version': '2022-11-28'
		};
		if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
		const res = await fetchWithLimits(`https://api.github.com${path}`, { headers });
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}

function isIconLikePath(path: string, agentName: string): boolean {
	const lower = path.toLowerCase();
	if (!EXTENSIONS.some((ext) => lower.endsWith(ext))) return false;

	const inCommonDir =
		COMMON_DIRS.some((dir) => lower.startsWith(`${dir}/`) || lower.includes(`/${dir}/`)) ||
		!lower.includes('/'); // root-level files count too

	const base = lower.split('/').pop() ?? '';
	const nameTokens = agentName.toLowerCase().split(/\s+/);
	const hasKeyword =
		ICON_KEYWORDS.some((k) => base.includes(k)) || nameTokens.some((t) => t.length > 2 && base.includes(t));

	// Exclude obvious non-icon assets.
	const excluded =
		/screenshot|benchmark|banner|demo|diagram|chart|arch|preview|social|readme-|hero|cover|wallpaper|badge/.test(
			lower
		);

	return inCommonDir && hasKeyword && !excluded;
}

/** Discover icon candidates from a GitHub repository URL. */
export async function discoverGithubCandidates(
	githubUrl: string,
	agentName: string
): Promise<IconCandidate[]> {
	const parsed = parseGithubRepo(githubUrl);
	if (!parsed) return [];
	const { owner, repo } = parsed;
	const candidates: IconCandidate[] = [];

	// Repo metadata gives us the default branch + social preview.
	const meta = (await githubApi(`/repos/${owner}/${repo}`)) as {
		default_branch?: string;
	} | null;
	const branch = meta?.default_branch ?? 'main';

	// 1. Repo tree: icon-like files in common asset directories.
	const tree = (await githubApi(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)) as {
		tree?: { path: string; type: string; size?: number }[];
		truncated?: boolean;
	} | null;
	if (tree?.tree) {
		for (const node of tree.tree) {
			if (node.type !== 'blob') continue;
			if (node.size !== undefined && node.size > 2 * 1024 * 1024) continue;
			if (!isIconLikePath(node.path, agentName)) continue;
			candidates.push({
				url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${node.path}`,
				sourceType: 'github',
				hint: 'repo-file'
			});
		}
	}

	// 2. README images.
	const readme = (await githubApi(`/repos/${owner}/${repo}/readme`)) as {
		content?: string;
		encoding?: string;
	} | null;
	if (readme?.content && readme.encoding === 'base64') {
		const text = Buffer.from(readme.content, 'base64').toString('utf-8');
		const urls = new Set<string>();
		for (const m of text.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) urls.add(m[1]);
		for (const m of text.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) urls.add(m[1]);
		for (let u of urls) {
			if (u.startsWith('#') || u.startsWith('data:')) continue;
			if (!/^https?:\/\//i.test(u)) {
				u = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${u.replace(/^\.?\//, '')}`;
			}
			const lower = u.toLowerCase();
			if (!EXTENSIONS.some((ext) => lower.split('?')[0].endsWith(ext))) continue;
			const base = lower.split('/').pop() ?? '';
			if (!ICON_KEYWORDS.some((k) => base.includes(k))) continue;
			candidates.push({ url: u, sourceType: 'github', hint: 'readme-image' });
		}
	}

	// 3. Org/user avatar — official, usually the product mark for dedicated orgs.
	candidates.push({
		url: `https://github.com/${owner}.png?size=512`,
		sourceType: 'github',
		hint: 'org-avatar'
	});

	// Cap the number of candidates per repo to keep crawls fast.
	return candidates.slice(0, 25);
}
