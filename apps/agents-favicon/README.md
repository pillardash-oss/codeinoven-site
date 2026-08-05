# AI Agent Icons Directory

A public directory of official icons for AI coding agents (Claude Code, OpenCode,
Cursor, Aider, and more). One SvelteKit app serves the website, the read-only
JSON API, and the daily crawler that keeps icons fresh — backed by SQLite and
files on disk. No accounts, no keys.

## Stack

- SvelteKit (Svelte 5) + adapter-node
- Tailwind CSS v4 + shadcn-svelte + Lucide icons
- SQLite (better-sqlite3) + Drizzle ORM
- sharp for image validation and PNG previews

## Development

```sh
npm install
npm run seed     # upsert the 22 seed agents + their sources
npm run crawl    # fetch, validate, sanitize, and store icons
npm run dev
```

Useful scripts:

| Script                        | Purpose                                    |
| ----------------------------- | ------------------------------------------ |
| `npm run seed`                | Idempotent agent/source registry upsert    |
| `npm run crawl [-- slug ...]` | Crawl all agents, or just specific slugs   |
| `npm run db:generate`         | Generate Drizzle migrations after schema changes |
| `npm run check`               | svelte-check / type checking               |

Environment variables:

| Variable       | Default  | Purpose                                    |
| -------------- | -------- | ------------------------------------------ |
| `DATA_DIR`     | `./data` | SQLite database + icon file storage        |
| `GITHUB_TOKEN` | —        | Optional; raises GitHub API rate limits    |

## Storage

```
data/
  icons.db                  # metadata only (agents, sources, icons)
  icons/<slug>/original.svg # sanitized original (or .png/.webp/.ico)
  icons/<slug>/preview.png  # 256px preview rendered with sharp
```

Icons are only replaced when a better candidate is found or the file changed at
the same official source. A failed crawl never removes a working icon.

## Public API

| Endpoint                      | Description                          |
| ----------------------------- | ------------------------------------ |
| `GET /api/agents`             | All agents (`?q=` search, `?format=`) |
| `GET /api/agents/{slug}`      | One agent with all icon files        |
| `GET /api/agents/{slug}/icon` | 302 redirect to the best icon        |
| `GET /api/agents/{slug}/icon.svg` | Specific format (`.png`, `.webp`, `.ico`) |
| `GET /catalog.json`           | Full machine-readable registry       |
| `GET /llms.txt`               | Plain-text guide for AI agents       |

## Deployment (Docker / Coolify)

This app lives in a monorepo workspace (`apps/agents-favicon`). The Docker
build context is the **repo root**, so point the build at the root with the
app's Dockerfile:

```sh
docker compose -f apps/agents-favicon/docker-compose.yml up --build
```

The container runs seed on boot, schedules a daily crawl via busybox crond,
and serves on port 3000. `/app/data` must be a persistent volume.

On Coolify: create a Docker Compose resource pointing at this repo with
`dockerfile: apps/agents-favicon/Dockerfile`, set `ORIGIN` to the public URL,
and keep the `icons-data` volume. To use a Coolify scheduled task instead of
the built-in cron, set `ENABLE_CRON=false` and schedule
`cd /app/apps/agents-favicon && npm run crawl` daily in the container.

Optional `PUBLIC_SUBMISSIONS_URL` controls the "Open a submission issue" button
target (defaults to the project GitHub issues page).

## Attribution

All product names, logos, and brands are property of their respective owners.
Icons are collected from official sources only, and each icon links back to the
exact source URL it was retrieved from.
