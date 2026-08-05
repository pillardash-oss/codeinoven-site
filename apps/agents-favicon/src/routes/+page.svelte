<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Empty from '$lib/components/ui/empty';
	import AgentCard from '$lib/components/site/agent-card.svelte';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SearchXIcon from '@lucide/svelte/icons/search-x';

	let { data } = $props();

	let query = $state('');
	let formatFilter = $state('all');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return data.agents.filter((agent) => {
			if (formatFilter !== 'all' && !(agent.formats as string[]).includes(formatFilter))
				return false;
			if (!q) return true;
			return [agent.name, agent.slug, agent.vendor ?? '', agent.description ?? '']
				.join(' ')
				.toLowerCase()
				.includes(q);
		});
	});

	const withIconCount = $derived(data.agents.filter((a) => a.icon).length);
	const updatedLabel = $derived(
		data.updatedAt
			? new Date(data.updatedAt).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})
			: 'never'
	);
</script>

<section class="border-b bg-muted/30">
	<div class="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
	<Badge variant="outline" class="gap-1.5 text-foreground">
		<span class="size-1.5 rounded-full bg-flame" aria-hidden="true"></span>
		{data.agents.length} agents · {withIconCount} icons · updated {updatedLabel}
	</Badge>
		<h1 class="max-w-2xl text-4xl font-black tracking-tight text-balance sm:text-5xl">
			Icons for AI coding agents
		</h1>
		<p class="max-w-xl text-lg text-muted-foreground text-balance">
			A curated directory of official icons for agentic developer tools, refreshed daily from
			official websites and repositories. Copy SVG, download originals, or use the JSON API.
		</p>
		<div class="relative w-full max-w-md">
			<SearchIcon
				class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				type="search"
				placeholder="Search agents, vendors…"
				class="h-11 pl-9"
				bind:value={query}
				aria-label="Search agents"
			/>
		</div>
	</div>
</section>

<section class="mx-auto w-full max-w-6xl px-4 py-8">
	<div class="mb-6 flex flex-wrap items-center justify-between gap-3">
		<h2 class="text-sm font-medium text-muted-foreground">
			{filtered.length}
			{filtered.length === 1 ? 'agent' : 'agents'}
		</h2>
		<ToggleGroup.Root
			type="single"
			variant="outline"
			size="sm"
			bind:value={formatFilter}
			aria-label="Filter by format"
		>
			<ToggleGroup.Item value="all">All</ToggleGroup.Item>
			<ToggleGroup.Item value="svg">SVG</ToggleGroup.Item>
			<ToggleGroup.Item value="png">PNG</ToggleGroup.Item>
			<ToggleGroup.Item value="webp">WebP</ToggleGroup.Item>
			<ToggleGroup.Item value="ico">ICO</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	{#if filtered.length > 0}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each filtered as agent (agent.slug)}
				<AgentCard {agent} />
			{/each}
		</div>
	{:else}
		<Empty.Root class="border border-dashed">
			<Empty.Header>
				<Empty.Media variant="icon">
					<SearchXIcon />
				</Empty.Media>
				<Empty.Title>No agents found</Empty.Title>
				<Empty.Description>
					No agents match “{query}”. Try a different search, or
					<a href="/submissions" class="underline underline-offset-4">submit a missing agent</a>.
				</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	{/if}
</section>
