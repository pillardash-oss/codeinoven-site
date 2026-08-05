/**
 * Seed the database with the curated agent list and their crawl sources.
 * Idempotent: existing agents are updated, existing sources are kept.
 *
 *   npm run seed
 */
import { eq, and } from 'drizzle-orm';
import { db, agents, sources } from '../src/lib/db';
import { SEED_AGENTS } from '../src/lib/db/seed-data';

async function main() {
	let created = 0;
	let updated = 0;

	for (const entry of SEED_AGENTS) {
		const existing = db.select().from(agents).where(eq(agents.slug, entry.slug)).get();

		let agentId: number;
		if (existing) {
			db.update(agents)
				.set({
					name: entry.name,
					vendor: entry.vendor,
					description: entry.description,
					websiteUrl: entry.websiteUrl ?? null,
					githubUrl: entry.githubUrl ?? null,
					updatedAt: new Date().toISOString()
				})
				.where(eq(agents.id, existing.id))
				.run();
			agentId = existing.id;
			updated++;
		} else {
			const inserted = db
				.insert(agents)
				.values({
					slug: entry.slug,
					name: entry.name,
					vendor: entry.vendor,
					description: entry.description,
					websiteUrl: entry.websiteUrl,
					githubUrl: entry.githubUrl
				})
				.returning({ id: agents.id })
				.get();
			agentId = inserted.id;
			created++;
		}

		// Register crawl sources ordered by priority (lower = checked first).
		const wanted: { sourceUrl: string; sourceType: 'github' | 'website' | 'manual'; priority: number }[] = [];
		if (entry.iconUrl) wanted.push({ sourceUrl: entry.iconUrl, sourceType: 'manual', priority: 10 });
		if (entry.githubUrl) wanted.push({ sourceUrl: entry.githubUrl, sourceType: 'github', priority: 20 });
		if (entry.websiteUrl) wanted.push({ sourceUrl: entry.websiteUrl, sourceType: 'website', priority: 30 });

		for (const src of wanted) {
			const found = db
				.select()
				.from(sources)
				.where(and(eq(sources.agentId, agentId), eq(sources.sourceUrl, src.sourceUrl)))
				.get();
			if (!found) {
				db.insert(sources).values({ agentId, ...src }).run();
			} else if (found.priority !== src.priority || found.sourceType !== src.sourceType) {
				db.update(sources)
					.set({ priority: src.priority, sourceType: src.sourceType })
					.where(eq(sources.id, found.id))
					.run();
			}
		}
	}

	console.log(`Seed complete: ${created} created, ${updated} updated, ${SEED_AGENTS.length} total agents.`);
}

main().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});
