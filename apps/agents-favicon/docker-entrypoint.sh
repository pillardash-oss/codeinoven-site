#!/bin/sh
# Container entrypoint:
#   1. seed the agent registry (idempotent upsert; migrations run on import)
#   2. optionally install a daily crawl cron job (busybox crond)
#   3. start the SvelteKit node server as the non-root `appuser`
# The entrypoint starts as root only so cron (which owns /etc/crontabs/root)
# can be configured; the long-running server drops privileges via su-exec.
set -e

cd /app/apps/agents-favicon

# Daily crawler. Disable with ENABLE_CRON=false if you prefer a Coolify
# scheduled task running: cd /app/apps/agents-favicon && npm run crawl
if [ "${ENABLE_CRON:-true}" = "true" ]; then
	SCHEDULE="${CRAWL_CRON:-0 4 * * *}"
	echo "$SCHEDULE cd /app/apps/agents-favicon && npm run crawl >> /app/data/crawl.log 2>&1" > /etc/crontabs/root
	crond -b -l 8
	echo "[entrypoint] daily crawl scheduled: $SCHEDULE"
fi

echo "[entrypoint] seeding agent registry..."
su-exec appuser npm run seed || echo "[entrypoint] seed failed (continuing with existing data)"

echo "[entrypoint] starting server on port ${PORT:-3000}..."
exec su-exec appuser node build
