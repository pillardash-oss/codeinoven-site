# ---- Build stage -----------------------------------------------------------
FROM node:22-alpine AS builder

# Native module toolchain (better-sqlite3 / sharp ship prebuilds, but
# node-gyp needs these if a prebuild is missing for the platform).
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Workspace manifests first for layer caching.
COPY package.json ./
COPY apps/agents-favicon/package.json ./apps/agents-favicon/
COPY apps/marketing/package.json ./apps/marketing/
RUN npm install --no-audit --no-fund

# Build only the agents-favicon workspace.
COPY apps/agents-favicon ./apps/agents-favicon
RUN npm run build --workspace @codeinoven/agents-favicon

# ---- Runtime stage ----------------------------------------------------------
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production \
	DATA_DIR=/app/data \
	PORT=3000

# Workspace manifests + prod deps for the agents app.
COPY package.json ./
COPY apps/agents-favicon/package.json ./apps/agents-favicon/
COPY apps/marketing/package.json ./apps/marketing/
RUN npm install --omit=dev --no-audit --no-fund

# Server bundle + client assets (adapter-node output).
COPY --from=builder /app/apps/agents-favicon/build ./apps/agents-favicon/build
# SQL migrations, applied automatically on startup by src/lib/db.
COPY --from=builder /app/apps/agents-favicon/drizzle ./apps/agents-favicon/drizzle
# Seed + crawler sources, run via tsx (npm run seed / npm run crawl).
COPY --from=builder /app/apps/agents-favicon/scripts ./apps/agents-favicon/scripts
COPY --from=builder /app/apps/agents-favicon/src ./apps/agents-favicon/src
COPY --from=builder /app/apps/agents-favicon/vite.config.ts ./apps/agents-favicon/vite.config.ts
COPY --from=builder /app/apps/agents-favicon/tsconfig.json ./apps/agents-favicon/tsconfig.json

COPY apps/agents-favicon/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Persistent volume: SQLite database + icon files. Must survive redeploys.
VOLUME /app/data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:${PORT:-3000}/ || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
