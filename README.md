# CodeInOven — Marketing Site

The public marketing site for [CodeInOven](https://codeinoven.com) — a desktop
workstation for coordinated agentic software engineering.

Built with SvelteKit 3 (Svelte 5, runes) + Tailwind CSS v4, following the brand
in `DESIGN.md` / `APP-BIBLE.md`: Obsidian `#081825`, Ivory `#F7F6F2`, Auric
`#D4AF37`, Satoshi typeface, Lucide icons.

## Stack

- SvelteKit 3 (Svelte 5, runes) + `@sveltejs/adapter-bun`
- Tailwind CSS v4 (brand tokens in `src/routes/layout.css`)
- Self-hosted Satoshi font in `static/fonts`
- Lucide icons (`@lucide/svelte`)

## Package manager

Bun is the only package manager for this repo. The `packageManager` field in
`package.json` pins the version and `bun.lock` is the only lockfile, so npm,
pnpm and yarn installs are all blocked from drifting the tree.

```sh
bun install
```

## Development

```sh
bun run dev
bun run check
bun run --bun build
bun run preview
```

The build runs under Bun because the adapter calls Bun's build API. Use
`bun run --bun build` locally; the Dockerfile does the same.

## Deployment (Docker / Coolify)

The build context is the repo root:

```sh
docker compose up --build
```

The image is Bun serving the SvelteKit output on port 3000. On Coolify, point a
Docker Compose resource at the repo root with `dockerfile: Dockerfile.marketing`.
