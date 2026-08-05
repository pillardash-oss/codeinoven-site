<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import ScaleIcon from '@lucide/svelte/icons/scale';
</script>

<svelte:head>
	<title>About — Favicons</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12">
	<div class="flex flex-col gap-3">
		<h1 class="text-3xl font-bold tracking-tight">About</h1>
		<p class="text-muted-foreground">
			Favicons is a small public directory of icons for AI coding agents and agentic
			developer tools — Claude Code, OpenCode, Codex, Cursor, Gemini CLI and friends.
		</p>
	</div>

	<div class="flex flex-col gap-4 text-sm leading-relaxed">
		<Card.Root>
			<Card.Header>
				<Card.Title>How it works</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-3 text-muted-foreground">
				<p>
					The agent list is curated by hand. A crawler runs once per day and only visits sources
					registered for each agent: the official GitHub repository, the official product
					website, or a manually approved icon URL.
				</p>
				<p>
					SVG is preferred; PNG, WebP and ICO are accepted. Every scraped SVG is sanitized before
					it is served — scripts, event handlers, external resources and embedded HTML are
					removed. A 256×256 PNG preview is generated for every icon, and a SHA-256 hash is
					stored for change detection.
				</p>
				<p>
					A failed crawl never removes a working icon: the last valid file is always retained.
				</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>What this is not</Card.Title>
			</Card.Header>
			<Card.Content class="text-muted-foreground">
				<p>
					This is an icon directory, not a general-purpose search engine. There is no
					internet-wide discovery, no AI logo recognition, and no automatic publishing of
					unverified third-party sources.
				</p>
			</Card.Content>
		</Card.Root>

		<Alert.Root>
			<ScaleIcon />
			<Alert.Title>Attribution and trademarks</Alert.Title>
			<Alert.Description>
				<ul class="list-disc pl-4">
					<li>All logos and icons belong to their respective owners.</li>
					<li>Inclusion in this directory does not imply endorsement.</li>
					<li>Files are provided for identification and integration purposes.</li>
					<li>You are responsible for complying with each brand's usage rules.</li>
					<li>
						An icon being publicly accessible does not mean it is freely licensed. The official
						source URL is stored and displayed for every icon.
					</li>
				</ul>
			</Alert.Description>
		</Alert.Root>
	</div>
</div>
