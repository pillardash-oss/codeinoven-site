<script lang="ts">
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	const origin = $derived(page.url.origin);

	const endpoints = $derived([
		{
			method: 'GET',
			path: '/api/agents',
			description:
				'List all agents. Use ?q=<search terms> for search and ?format=svg|png|webp|ico to filter by file type.',
			example: `curl "${origin}/api/agents?q=claude&format=svg"`
		},
		{
			method: 'GET',
			path: '/api/agents/{slug}',
			description: 'Get one agent plus every stored icon format.',
			example: `curl ${origin}/api/agents/claude-code`
		},
		{
			method: 'GET',
			path: '/api/agents/{slug}/icon',
			description: 'Get the current primary icon. This endpoint sends a redirect.',
			example: `curl -L ${origin}/api/agents/claude-code/icon -o claude-code-icon`
		},
		{
			method: 'GET',
			path: '/api/agents/{slug}/icon.svg',
			description:
				'Request one format directly. Use .svg, .png, .webp, or .ico. Returns 404 if missing.',
			example: `curl -L ${origin}/api/agents/claude-code/icon.svg -o claude-code.svg`
		},
		{
			method: 'GET',
			path: '/catalog.json',
			description: 'Download the full registry as JSON. This is the easiest way to ingest all entries.',
			example: `curl ${origin}/catalog.json`
		},
		{
			method: 'GET',
			path: '/llms.txt',
			description: 'Get a short plain-text directory description for scripts and tooling.',
			example: `curl ${origin}/llms.txt`
		}
	]);
</script>

<svelte:head>
	<title>API | Favicons</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12">
	<div class="flex flex-col gap-3">
		<h1 class="text-3xl font-bold tracking-tight">Public API</h1>
		<p class="max-w-2xl text-muted-foreground">
			No API key is required. Most responses return JSON. Direct file responses are
			available at
			<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">/icons/&#123;slug&#125;/original.&#123;format&#125;</code>
			and <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">/icons/&#123;slug&#125;/preview.png</code>.
			Cache responses. Heavy traffic can trigger rate limits.
		</p>
	</div>

	<div class="flex flex-col gap-4">
		{#each endpoints as endpoint (endpoint.path)}
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex flex-wrap items-center gap-2 font-mono text-base">
						<Badge variant="secondary">{endpoint.method}</Badge>
						{endpoint.path}
					</Card.Title>
					<Card.Description>{endpoint.description}</Card.Description>
				</Card.Header>
				<Card.Content>
					<pre
						class="overflow-x-auto rounded-lg border bg-muted/40 p-4 font-mono text-xs leading-relaxed">{endpoint.example}</pre>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
