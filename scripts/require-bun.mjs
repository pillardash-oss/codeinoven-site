/**
 * This repo installs with Bun, pinned by the `packageManager` field in
 * package.json. `bun.lock` is the only lockfile.
 *
 * pnpm and corepack enforce that pin themselves, but npm does not: it happily
 * writes a second package-lock.json next to bun.lock, which is exactly the
 * duplicated, drifting tree this guard exists to prevent. npm and pnpm both run
 * this script before resolving, so failing here stops the install outright.
 */

const agent = process.env.npm_config_user_agent ?? '';

if (!agent.startsWith('bun')) {
	console.error(
		[
			'',
			'This repo installs with Bun.',
			`Detected: ${agent.split(' ')[0] || 'an unknown package manager'}`,
			'',
			'Run:  bun install',
			''
		].join('\n')
	);
	process.exit(1);
}