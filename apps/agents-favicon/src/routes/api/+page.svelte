<script lang="ts">
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	const origin = $derived(page.url.origin);

	const endpoints = $derived([
		{
			method: 'GET',
			path: '/api/agents',
			description: 'List all agents. Supports ?q=<search> and ?format=svg|png|webp|ico.',
			example: `curl "${origin}/api/agents?q=claude&format=svg"`
		},
		{
			method: 'GET',
			path: '/api/agents/{slug}',
			description: 'One agent with all of its stored icon files.',
			example: `curl ${origin}/api/agents/claude-code`
		},
		{
			method: 'GET',
			path: '/api/agents/{slug}/icon',
			description: '302 redirect to the current primary icon file.',
			example: `curl -L ${origin}/api/agents/claude-code/icon -o claude-code-icon`
		},
		{
			method: 'GET',
			path: '/api/agents/{slug}/icon.svg',
			description: 'Request a specific format (.svg, .png, .webp, .ico). 404 when unavailable.',
			example: `curl -L ${origin}/api/agents/claude-code/icon.svg -o claude-code.svg`
		},
		{
			method: 'GET',
			path: '/catalog.json',
			description: 'The entire registry in one machine-readable document.',
			example: `curl ${origin}/catalog.json`
		},
		{
			method: 'GET',
			path: '/llms.txt',
			description: 'Concise plain-text description of the directory for coding agents.',
			example: `curl ${origin}/llms.txt`
		}
	]);
</script>

<svelte:head>
	<title>API — Favicons</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12">
	<div class="flex flex-col gap-3">
		<h1 class="text-3xl font-bold tracking-tight">Public API</h1>
		<p class="max-w-2xl text-muted-foreground">
			Read-only, no API key required. Responses are JSON unless noted. Direct icon files are also
			served under <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">/icons/&#123;slug&#125;/original.&#123;format&#125;</code>
			and <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">/icons/&#123;slug&#125;/preview.png</code>.
			Please cache responses; heavy abuse may lead to rate limiting.
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
