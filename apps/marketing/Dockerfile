# ---- Build stage -----------------------------------------------------------
FROM oven/bun:1.3.10 AS builder

# Workspace lockfile includes the agents app (better-sqlite3) — native toolchain needed.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Workspace manifests + lockfile first for layer caching.
# Copy both workspace manifests so the workspace set matches the lockfile.
COPY package.json bun.lock ./
COPY apps/marketing/package.json ./apps/marketing/
COPY apps/agents-favicon/package.json ./apps/agents-favicon/
RUN bun install --frozen-lockfile

# Build only the marketing workspace.
COPY apps/marketing ./apps/marketing
RUN bun run --cwd apps/marketing build

# ---- Runtime stage ----------------------------------------------------------
FROM nginx:alpine

COPY --from=builder /app/apps/marketing/build /usr/share/nginx/html

# SPA fallback for client-side routing.
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
