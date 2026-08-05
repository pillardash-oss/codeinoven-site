<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import ImageOffIcon from '@lucide/svelte/icons/image-off';

	interface AgentEntry {
		slug: string;
		name: string;
		vendor: string | null;
		icon: string | null;
		format: string | null;
		formats: string[];
		preview: string | null;
	}

	let { agent }: { agent: AgentEntry } = $props();

	const imageSrc = $derived(
		agent.format === 'svg' ? agent.icon : (agent.preview ?? agent.icon)
	);
</script>

<a href="/agents/{agent.slug}" class="group block h-full">
	<Card.Root class="h-full gap-4 transition-colors group-hover:border-ring/60">
		<Card.Content class="flex flex-col items-center gap-4 pt-2">
			<div
				class="flex size-20 items-center justify-center overflow-hidden rounded-2xl border bg-muted/40 p-3"
			>
				{#if imageSrc}
					<img
						src={imageSrc}
						alt="{agent.name} icon"
						class="size-full object-contain transition-transform group-hover:scale-105"
						loading="lazy"
					/>
				{:else}
					<ImageOffIcon class="size-8 text-muted-foreground" />
				{/if}
			</div>
			<div class="flex w-full flex-col items-center gap-1 text-center">
				<span class="line-clamp-1 font-medium">{agent.name}</span>
				{#if agent.vendor}
					<span class="line-clamp-1 text-xs text-muted-foreground">{agent.vendor}</span>
				{/if}
			</div>
			<div class="flex flex-wrap justify-center gap-1">
				{#each agent.formats as format (format)}
					<Badge variant="secondary" class="text-[10px] uppercase">{format}</Badge>
				{:else}
					<Badge variant="outline" class="text-[10px]">no icon yet</Badge>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</a>
