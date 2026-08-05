import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const agents = sqliteTable(
	'agents',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		slug: text('slug').notNull().unique(),
		name: text('name').notNull(),
		vendor: text('vendor'),
		description: text('description'),
		websiteUrl: text('website_url'),
		githubUrl: text('github_url'),
		status: text('status', { enum: ['active', 'inactive'] })
			.notNull()
			.default('active'),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`(datetime('now'))`)
	},
	(table) => [index('agents_status_idx').on(table.status)]
);

export const sources = sqliteTable(
	'sources',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		agentId: integer('agent_id')
			.notNull()
			.references(() => agents.id, { onDelete: 'cascade' }),
		sourceUrl: text('source_url').notNull(),
		sourceType: text('source_type', { enum: ['github', 'website', 'manual'] }).notNull(),
		priority: integer('priority').notNull().default(100),
		lastCheckedAt: text('last_checked_at'),
		lastStatus: text('last_status')
	},
	(table) => [
		index('sources_agent_idx').on(table.agentId),
		uniqueIndex('sources_agent_url_idx').on(table.agentId, table.sourceUrl)
	]
);

export const icons = sqliteTable(
	'icons',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		agentId: integer('agent_id')
			.notNull()
			.references(() => agents.id, { onDelete: 'cascade' }),
		format: text('format', { enum: ['svg', 'png', 'webp', 'ico'] }).notNull(),
		filePath: text('file_path').notNull(),
		sourceUrl: text('source_url').notNull(),
		width: integer('width'),
		height: integer('height'),
		fileHash: text('file_hash').notNull(),
		isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
		verifiedAt: text('verified_at'),
		createdAt: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`(datetime('now'))`)
	},
	(table) => [
		index('icons_agent_idx').on(table.agentId),
		uniqueIndex('icons_agent_format_idx').on(table.agentId, table.format)
	]
);

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;
export type Icon = typeof icons.$inferSelect;
export type NewIcon = typeof icons.$inferInsert;
