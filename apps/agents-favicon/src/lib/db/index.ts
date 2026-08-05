import path from 'node:path';
import fs from 'node:fs';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import * as schema from './schema';

/**
 * Resolves the persistent data directory. Defaults to ./data in the project
 * root; override with DATA_DIR in production (e.g. a mounted Docker volume).
 */
export const DATA_DIR = path.resolve(process.env.DATA_DIR ?? 'data');
export const ICONS_DIR = path.join(DATA_DIR, 'icons');
export const DB_PATH = path.join(DATA_DIR, 'icons.db');

fs.mkdirSync(ICONS_DIR, { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.exec('PRAGMA journal_mode = WAL');
sqlite.exec('PRAGMA foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

// Apply pending migrations on startup so the server, seed script and crawler
// all share the same bootstrap path. MIGRATIONS_DIR overrides in production.
const migrationsFolder = path.resolve(process.env.MIGRATIONS_DIR ?? 'drizzle');
if (fs.existsSync(migrationsFolder)) {
	migrate(db, { migrationsFolder });
}

export * from './schema';
