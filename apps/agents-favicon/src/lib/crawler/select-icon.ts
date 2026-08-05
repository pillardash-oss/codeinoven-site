/**
 * Candidate scoring and selection.
 *
 * Two phases:
 *   1. preScore  — URL/discovery-based ordering (cheap, before download)
 *   2. evaluate  — download, sniff format, validate with sharp, final score
 */
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import type { DownloadedCandidate, IconCandidate } from './types';
import { downloadBuffer } from './types';
import { sanitizeSvg } from './sanitize-svg';

const FORMAT_SCORE: Record<DownloadedCandidate['format'], number> = {
	svg: 40,
	png: 25,
	webp: 15,
	ico: 5
};

const HINT_SCORE: Record<IconCandidate['hint'], number> = {
	manual: 60,
	'repo-file': 30,
	'link-icon': 26,
	'manifest-icon': 24,
	'apple-touch-icon': 22,
	'org-avatar': 20,
	'mask-icon': 14,
	'readme-image': 12,
	'social-preview': 6,
	'og-image': 2,
	'favicon-ico': 8
};

const NAME_KEYWORDS = ['logo', 'icon', 'mark', 'favicon', 'symbol'];

/** Cheap URL-based score used to decide download order. */
export function preScore(candidate: IconCandidate, agentName: string): number {
	let score = HINT_SCORE[candidate.hint];

	const path = candidate.url.split('?')[0].toLowerCase();
	const base = path.split('/').pop() ?? '';

	if (path.endsWith('.svg')) score += 30;
	else if (path.endsWith('.png')) score += 18;
	else if (path.endsWith('.webp')) score += 10;
	else if (path.endsWith('.ico')) score += 4;

	if (NAME_KEYWORDS.some((k) => base.includes(k))) score += 10;
	const tokens = agentName.toLowerCase().split(/\s+/);
	if (tokens.some((t) => t.length > 2 && base.includes(t))) score += 8;
	if (/branding|brand|logo/.test(path)) score += 5;
	// Larger declared favicon sizes are better.
	const declared = candidate.declaredSizes?.match(/(\d+)x(\d+)/i);
	if (declared) {
		const size = Number(declared[1]);
		if (size >= 512) score += 8;
		else if (size >= 180) score += 6;
		else if (size >= 64) score += 3;
		else if (size <= 32) score -= 4;
	}
	// Dark-mode / wordmark variants are less suitable as the canonical mark.
	if (/wordmark|full[-_]?logo|horizontal|stacked|text/.test(base)) score -= 8;
	if (/dark|white|light/.test(base)) score -= 3;

	return score;
}

function sniffFormat(buffer: Buffer, url: string): DownloadedCandidate['format'] | null {
	const head = buffer.subarray(0, 512).toString('utf-8').trimStart().toLowerCase();
	if (head.startsWith('<?xml') || head.startsWith('<svg') || head.includes('<svg')) return 'svg';
	if (buffer.length > 8 && buffer.readUInt32BE(0) === 0x89504e47) return 'png';
	if (
		buffer.length > 12 &&
		buffer.toString('ascii', 0, 4) === 'RIFF' &&
		buffer.toString('ascii', 8, 12) === 'WEBP'
	)
		return 'webp';
	if (buffer.length > 4 && buffer.readUInt16LE(0) === 0 && buffer.readUInt16LE(2) === 1) return 'ico';
	// Some servers mislabel; fall back to the URL extension for ico only.
	if (url.split('?')[0].toLowerCase().endsWith('.ico')) return 'ico';
	return null;
}

/**
 * Download and fully evaluate a candidate. Returns null when the file is
 * invalid, unsafe or unusable.
 */
export async function evaluateCandidate(
	candidate: IconCandidate,
	agentName: string
): Promise<DownloadedCandidate | null> {
	const raw = await downloadBuffer(candidate.url);
	if (!raw) return null;

	const format = sniffFormat(raw, candidate.url);
	if (!format) return null;

	let buffer = raw;
	let width: number | undefined;
	let height: number | undefined;
	let hasAlpha: boolean | undefined;

	if (format === 'svg') {
		const result = sanitizeSvg(raw.toString('utf-8'));
		if (!result.ok) return null;
		buffer = Buffer.from(result.svg, 'utf-8');
		try {
			const meta = await sharp(buffer).metadata();
			width = meta.width;
			height = meta.height;
			hasAlpha = true;
		} catch {
			return null; // malformed after sanitization → reject
		}
	} else {
		try {
			const meta = await sharp(buffer, format === 'ico' ? { pages: 1 } : undefined).metadata();
			width = meta.width;
			height = meta.height;
			hasAlpha = meta.hasAlpha ?? false;
		} catch {
			if (format !== 'ico') return null;
			// sharp cannot decode some .ico files; keep them un-measured.
		}
	}

	let score = preScore(candidate, agentName) + FORMAT_SCORE[format];

	if (width && height) {
		const ratio = Math.max(width, height) / Math.min(width, height);
		if (ratio <= 1.05) score += 15;
		else if (ratio <= 1.3) score += 5;
		else if (ratio > 2) score -= 25; // banners / wordmarks
		if (format !== 'svg') {
			const size = Math.min(width, height);
			if (size >= 256) score += 8;
			else if (size >= 128) score += 5;
			else if (size >= 64) score += 2;
			else if (size < 48) score -= 8;
		}
	}
	if (hasAlpha) score += 5;
	// Penalize very large raster files.
	if (format !== 'svg' && buffer.byteLength > 1024 * 1024) score -= 10;

	const sha256 = createHash('sha256').update(buffer).digest('hex');

	return { ...candidate, buffer, format, width, height, hasAlpha, score, sha256 };
}

/**
 * Evaluate candidates in pre-score order and return all valid downloads,
 * best final score first. Stops early once a strong SVG match is found.
 */
export async function selectBestIcons(
	candidates: IconCandidate[],
	agentName: string,
	maxDownloads = 8
): Promise<DownloadedCandidate[]> {
	const ordered = [...candidates].sort((a, b) => preScore(b, agentName) - preScore(a, agentName));
	const seen = new Set<string>();
	const evaluated: DownloadedCandidate[] = [];

	for (const candidate of ordered) {
		if (evaluated.length >= maxDownloads) break;
		if (seen.has(candidate.url)) continue;
		seen.add(candidate.url);

		const result = await evaluateCandidate(candidate, agentName);
		if (result) {
			evaluated.push(result);
			// A square official SVG is as good as it gets — stop early.
			if (result.format === 'svg' && result.score >= 100) break;
		}
	}

	return evaluated.sort((a, b) => b.score - a.score);
}
