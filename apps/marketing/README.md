# CodeInOven — Marketing Site

The public marketing site for [CodeInOven](https://codeinoven.com) — a desktop
workstation for coordinated agentic software engineering.

Built with SvelteKit (Svelte 5, runes) + Tailwind CSS v4, following the brand
in `DESIGN.md` / `APP-BIBLE.md`: Obsidian `#081825`, Ivory `#F7F6F2`, Auric
`#D4AF37`, Satoshi typeface, Lucide icons.

## Stack

- SvelteKit (Svelte 5) + `@sveltejs/adapter-static`
- Tailwind CSS v4 (brand tokens in `src/routes/layout.css`)
- Self-hosted Satoshi font in `static/fonts`
- Lucide icons (`@lucide/svelte`)

## Development

```sh
npm run dev
npm run check
npm run build
```

## Deployment (Docker / Coolify)

The build context is the monorepo **repo root** (the app shares a bun workspace
with `apps/agents-favicon`):

```sh
docker compose -f apps/marketing/docker-compose.yml up --build
```

The image is Bun serving the SvelteKit output (`svelte-adapter-bun`) on port
3000, following the pillardash pattern. On Coolify, point a Docker Compose
resource at the repo root with `dockerfile: Dockerfile.marketing`.
