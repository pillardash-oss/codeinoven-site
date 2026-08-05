export type SourceType = 'manual' | 'github' | 'website';

export interface IconCandidate {
	/** Absolute URL of the candidate file. */
	url: string;
	sourceType: SourceType;
	/** Where the candidate was discovered (affects scoring). */
	hint:
		| 'manual'
		| 'repo-file'
		| 'readme-image'
		| 'org-avatar'
		| 'social-preview'
		| 'link-icon'
		| 'apple-touch-icon'
		| 'mask-icon'
		| 'manifest-icon'
		| 'og-image'
		| 'favicon-ico';
	/** Declared sizes attribute if any, e.g. "180x180". */
	declaredSizes?: string;
}

export interface DownloadedCandidate extends IconCandidate {
	buffer: Buffer;
	format: 'svg' | 'png' | 'webp' | 'ico';
	width?: number;
	height?: number;
	hasAlpha?: boolean;
	score: number;
	sha256: string;
}

const USER_AGENT =
	'ai-agent-favicons-crawler/1.0 (+https://github.com/ai-agent-favicons; icon directory crawler)';

export const MAX_DOWNLOAD_BYTES = 3 * 1024 * 1024; // 3 MB

/** fetch with a timeout, our UA and an optional byte cap. */
export async function fetchWithLimits(
	url: string,
	init: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
	const { timeoutMs = 20_000, ...rest } = init;
	return fetch(url, {
		redirect: 'follow',
		...rest,
		headers: { 'user-agent': USER_AGENT, ...(rest.headers ?? {}) },
		signal: AbortSignal.timeout(timeoutMs)
	});
}

/** Download a candidate body, enforcing the size cap. Returns null on failure. */
export async function downloadBuffer(url: string): Promise<Buffer | null> {
	try {
		const res = await fetchWithLimits(url);
		if (!res.ok) return null;
		const length = Number(res.headers.get('content-length') ?? 0);
		if (length > MAX_DOWNLOAD_BYTES) return null;
		const buf = Buffer.from(await res.arrayBuffer());
		if (buf.byteLength === 0 || buf.byteLength > MAX_DOWNLOAD_BYTES) return null;
		return buf;
	} catch {
		return null;
	}
}
