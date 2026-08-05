/**
 * One-off helper: install a known-correct SVG for a slug, regenerate the
 * 256x256 preview, and sync the icons row so the primary format is SVG.
 *
 *   npm run update-icon -- <slug> <path-to.svg> [source-url]
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { eq, and } from 'drizzle-orm';
import sharp from 'sharp';
import { db, agents, icons, ICONS_DIR } from '../src/lib/db';

const PREVIEW_SIZE = 256;

async function main() {
	const [, , slug, svgPath, sourceUrl = 'manual'] = process.argv;
	if (!slug || !svgPath) {
		console.error('usage: npm run update-icon -- <slug> <path-to.svg> [source-url]');
		process.exit(1);
	}

	const agent = db.select().from(agents).where(eq(agents.slug, slug)).get();
	if (!agent) {
		console.error(`no agent for slug "${slug}"`);
		process.exit(1);
	}

	const svg = fs.readFileSync(path.resolve(svgPath));
	const dir = path.join(ICONS_DIR, slug);
	fs.mkdirSync(dir, { recursive: true });

	fs.writeFileSync(path.join(dir, 'original.svg'), svg);

	const preview = await sharp(svg, { density: 300 })
		.resize(PREVIEW_SIZE, PREVIEW_SIZE, {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		})
		.png()
		.toBuffer();
	fs.writeFileSync(path.join(dir, 'preview.png'), preview);

	const hash = createHash('sha256').update(svg).digest('hex');

	db.update(icons).set({ isPrimary: false }).where(eq(icons.agentId, agent.id)).run();

	const existing = db
		.select()
		.from(icons)
		.where(and(eq(icons.agentId, agent.id), eq(icons.format, 'svg')))
		.get();

	const values = {
		filePath: `icons/${slug}/original.svg`,
		sourceUrl,
		fileHash: hash,
		isPrimary: true,
		verifiedAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};

	if (existing) {
		db.update(icons).set(values).where(eq(icons.id, existing.id)).run();
	} else {
		db.insert(icons)
			.values({ agentId: agent.id, format: 'svg', ...values })
			.run();
	}

	console.log(`updated ${slug} -> original.svg + preview.png (${preview.length} bytes)`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
