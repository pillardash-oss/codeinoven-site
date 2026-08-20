<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import ScaleIcon from '@lucide/svelte/icons/scale';
</script>

<svelte:head>
	<title>About | Favicons</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12">
	<div class="flex flex-col gap-3">
		<h1 class="text-3xl font-bold tracking-tight">About</h1>
		<p class="text-muted-foreground">
			Favicons is a public directory of icons for AI coding agents, including Claude Code,
			OpenCode, Codex, Cursor, Gemini CLI, and many more.
		</p>
	</div>

	<div class="flex flex-col gap-4 text-sm leading-relaxed">
		<Card.Root>
			<Card.Header>
				<Card.Title>How it works</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-3 text-muted-foreground">
				<p>
					The list is manually curated. A crawler runs once per day and only visits source links
					we keep for each entry: the official GitHub repo, the official website, or a
					manually approved icon URL.
				</p>
				<p>
					We prefer SVG. PNG, WebP, and ICO are accepted. We strip scripts and embedded
					html from every SVG before serving it. We also generate a 256x256 PNG preview and keep
					a SHA-256 hash to detect changes.
				</p>
				<p>
					If a crawl fails, we keep the last working icon instead of removing it.
				</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>What this is not</Card.Title>
			</Card.Header>
			<Card.Content class="text-muted-foreground">
				<p>
					This is an icon directory, not a general search engine. We do not do internet-wide
					discovery, logo recognition, or automatic publishing from unverified sources.
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
