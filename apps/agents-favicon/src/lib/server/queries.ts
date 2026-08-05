/**
 * Shared server-side queries and serializers used by pages and the public API.
 */
import fs from 'node:fs';
import path from 'node:path';
import { asc, eq } from 'drizzle-orm';
import { db, agents, icons, ICONS_DIR, type Agent, type Icon } from '$lib/db';

export interface AgentWithIcons {
	agent: Agent;
	primaryIcon: Icon | null;
	allIcons: Icon[];
}

export function listAgentsWithIcons(): AgentWithIcons[] {
	const agentRows = db
		.select()
		.from(agents)
		.where(eq(agents.status, 'active'))
		.orderBy(asc(agents.name))
		.all();
	const iconRows = db.select().from(icons).all();

	return agentRows.map((agent) => {
		const allIcons = iconRows.filter((i) => i.agentId === agent.id);
		return {
			agent,
			primaryIcon: allIcons.find((i) => i.isPrimary) ?? null,
			allIcons
		};
	});
}

export function getAgentWithIcons(slug: string): AgentWithIcons | null {
	const agent = db.select().from(agents).where(eq(agents.slug, slug)).get();
	if (!agent || agent.status !== 'active') return null;
	const allIcons = db.select().from(icons).where(eq(icons.agentId, agent.id)).all();
	return { agent, primaryIcon: allIcons.find((i) => i.isPrimary) ?? null, allIcons };
}

/** Last time any icon in the directory was verified. */
export function lastUpdatedAt(): string | null {
	const rows = db.select({ verifiedAt: icons.verifiedAt }).from(icons).all();
	const times = rows.map((r) => r.verifiedAt).filter((v): v is string => Boolean(v));
	return times.length ? times.sort().at(-1)! : null;
}

/** Public JSON shape for one agent (used by /api/agents and /catalog.json). */
export function serializeAgent({ agent, primaryIcon, allIcons }: AgentWithIcons) {
	// Preview generation can fail for exotic ICOs — only advertise it if the file exists.
	const hasPreview =
		primaryIcon !== null && fs.existsSync(path.join(ICONS_DIR, agent.slug, 'preview.png'));
	return {
		slug: agent.slug,
		name: agent.name,
		vendor: agent.vendor,
		description: agent.description,
		websiteUrl: agent.websiteUrl,
		githubUrl: agent.githubUrl,
		icon: primaryIcon ? `/${primaryIcon.filePath}` : null,
		format: primaryIcon?.format ?? null,
		formats: allIcons.map((i) => i.format).sort(),
		preview: hasPreview ? `/icons/${agent.slug}/preview.png` : null,
		source: primaryIcon?.sourceUrl ?? null,
		width: primaryIcon?.width ?? null,
		height: primaryIcon?.height ?? null,
		verifiedAt: primaryIcon?.verifiedAt ?? null
	};
}
