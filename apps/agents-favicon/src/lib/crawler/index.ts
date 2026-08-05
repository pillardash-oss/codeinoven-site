/**
 * Crawl orchestration: for each agent, gather candidates from its registered
 * sources (priority order), pick the best, store files and update SQLite.
 *
 * Failure policy: a failed crawl NEVER removes or downgrades an existing icon.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { and, eq } from 'drizzle-orm';
import { db, icons, sources, ICONS_DIR, type Agent, type Source } from '../db';
import type { DownloadedCandidate, IconCandidate } from './types';
import { discoverGithubCandidates } from './github';
import { discoverWebsiteCandidates } from './website';
import { selectBestIcons } from './select-icon';

const PREVIEW_SIZE = 256;

export interface CrawlResult {
	slug: string;
	status: 'updated' | 'unchanged' | 'kept-existing' | 'no-icon-found' | 'error';
	detail?: string;
}

async function gatherCandidates(agent: Agent, agentSources: Source[]): Promise<IconCandidate[]> {
	const all: IconCandidate[] = [];

	for (const source of [...agentSources].sort((a, b) => a.priority - b.priority)) {
		let found: IconCandidate[] = [];
		let status = 'ok';
		try {
			if (source.sourceType === 'manual') {
				found = [{ url: source.sourceUrl, sourceType: 'manual', hint: 'manual' }];
			} else if (source.sourceType === 'github') {
				found = await discoverGithubCandidates(source.sourceUrl, agent.name);
			} else {
				found = await discoverWebsiteCandidates(source.sourceUrl);
			}
			if (found.length === 0) status = 'no-candidates';
		} catch (err) {
			status = `error: ${err instanceof Error ? err.message : String(err)}`;
		}

		db.update(sources)
			.set({ lastCheckedAt: new Date().toISOString(), lastStatus: status })
			.where(eq(sources.id, source.id))
			.run();

		all.push(...found);
	}

	return all;
}

async function writePreview(slug: string, best: DownloadedCandidate): Promise<boolean> {
	try {
		const preview = await sharp(best.buffer, best.format === 'ico' ? { pages: 1 } : { density: 300 })
			.resize(PREVIEW_SIZE, PREVIEW_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
			.png()
			.toBuffer();
		fs.writeFileSync(path.join(ICONS_DIR, slug, 'preview.png'), preview);
		return true;
	} catch {
		return false;
	}
}

function upsertIconRow(agent: Agent, candidate: DownloadedCandidate, filePath: string, primary: boolean) {
	const now = new Date().toISOString();
	const existing = db
		.select()
		.from(icons)
		.where(and(eq(icons.agentId, agent.id), eq(icons.format, candidate.format)))
		.get();

	if (existing) {
		db.update(icons)
			.set({
				filePath,
				sourceUrl: candidate.url,
				width: candidate.width ?? null,
				height: candidate.height ?? null,
				fileHash: candidate.sha256,
				isPrimary: primary,
				verifiedAt: now,
				updatedAt: now
			})
			.where(eq(icons.id, existing.id))
			.run();
	} else {
		db.insert(icons)
			.values({
				agentId: agent.id,
				format: candidate.format,
				filePath,
				sourceUrl: candidate.url,
				width: candidate.width ?? null,
				height: candidate.height ?? null,
				fileHash: candidate.sha256,
				isPrimary: primary,
				verifiedAt: now
			})
			.run();
	}
}

export async function crawlAgent(agent: Agent, agentSources: Source[]): Promise<CrawlResult> {
	try {
		const existingPrimary = db
			.select()
			.from(icons)
			.where(and(eq(icons.agentId, agent.id), eq(icons.isPrimary, true)))
			.get();

		const candidates = await gatherCandidates(agent, agentSources);
		if (candidates.length === 0) {
			return {
				slug: agent.slug,
				status: existingPrimary ? 'kept-existing' : 'no-icon-found',
				detail: 'no candidates discovered'
			};
		}

		const evaluated = await selectBestIcons(candidates, agent.name);
		if (evaluated.length === 0) {
			// Refresh verified_at on the retained icon so staleness is visible but
			// the working file is never deleted.
			return {
				slug: agent.slug,
				status: existingPrimary ? 'kept-existing' : 'no-icon-found',
				detail: 'no candidate passed validation'
			};
		}

		const best = evaluated[0];

		// Replacement policy: only swap when the file changed on the same source
		// or the new candidate is genuinely better than what we have.
		if (existingPrimary) {
			const sameSource = existingPrimary.sourceUrl === best.url;
			const sameHash = existingPrimary.fileHash === best.sha256;
			if (sameSource && sameHash) {
				const now = new Date().toISOString();
				db.update(icons)
					.set({ verifiedAt: now, updatedAt: now })
					.where(eq(icons.id, existingPrimary.id))
					.run();
				return { slug: agent.slug, status: 'unchanged' };
			}
			// Prefer keeping an SVG primary over downgrading to raster from a
			// different source.
			if (!sameSource && existingPrimary.format === 'svg' && best.format !== 'svg') {
				const now = new Date().toISOString();
				db.update(icons)
					.set({ verifiedAt: now, updatedAt: now })
					.where(eq(icons.id, existingPrimary.id))
					.run();
				return { slug: agent.slug, status: 'kept-existing', detail: 'existing svg outranks new raster' };
			}
		}

		// Persist the best candidate.
		const dir = path.join(ICONS_DIR, agent.slug);
		fs.mkdirSync(dir, { recursive: true });
		const fileName = `original.${best.format}`;
		fs.writeFileSync(path.join(dir, fileName), best.buffer);
		const relPath = `icons/${agent.slug}/${fileName}`;

		const previewOk = await writePreview(agent.slug, best);

		// Clear the previous primary flag before setting the new one.
		db.update(icons).set({ isPrimary: false }).where(eq(icons.agentId, agent.id)).run();
		upsertIconRow(agent, best, relPath, true);

		// Keep the best candidate of each *other* format as secondary download options.
		const storedFormats = new Set([best.format]);
		for (const alt of evaluated.slice(1)) {
			if (storedFormats.has(alt.format)) continue;
			storedFormats.add(alt.format);
			const altName = `original.${alt.format}`;
			fs.writeFileSync(path.join(dir, altName), alt.buffer);
			upsertIconRow(agent, alt, `icons/${agent.slug}/${altName}`, false);
		}

		return {
			slug: agent.slug,
			status: 'updated',
			detail: `${best.format} from ${best.url}${previewOk ? '' : ' (preview generation failed)'}`
		};
	} catch (err) {
		return {
			slug: agent.slug,
			status: 'error',
			detail: err instanceof Error ? err.message : String(err)
		};
	}
}
