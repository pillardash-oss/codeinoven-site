<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs';
	import { toast } from 'svelte-sonner';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import GithubIcon from '@lucide/svelte/icons/folder-git-2';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import ImageOffIcon from '@lucide/svelte/icons/image-off';

	let { data } = $props();

	const agent = $derived(data.agent);
	const svgIcon = $derived(data.icons.find((i) => i.format === 'svg'));
	const displaySrc = $derived(agent.format === 'svg' ? agent.icon : (agent.preview ?? agent.icon));
	const verifiedLabel = $derived(
		agent.verifiedAt
			? new Date(agent.verifiedAt).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})
			: 'not yet verified'
	);

	async function copySvg() {
		if (!svgIcon) return;
		try {
			const res = await fetch(svgIcon.url);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			await navigator.clipboard.writeText(await res.text());
			toast.success('SVG source copied to clipboard');
		} catch {
			toast.error('Could not copy the SVG source');
		}
	}

	const apiExamples = $derived([
		{
			label: 'Agent metadata',
			code: `curl ${page.url.origin}/api/agents/${agent.slug}`
		},
		{
			label: 'Primary icon (redirect)',
			code: `curl -L ${page.url.origin}/api/agents/${agent.slug}/icon -o ${agent.slug}.${agent.format ?? 'png'}`
		},
		{
			label: 'HTML',
			code: `<img src="${page.url.origin}/api/agents/${agent.slug}/icon" alt="${agent.name}" width="32" height="32" />`
		}
	]);

	async function copyExample(code: string) {
		try {
			await navigator.clipboard.writeText(code);
			toast.success('Copied to clipboard');
		} catch {
			toast.error('Could not copy');
		}
	}
</script>

<svelte:head>
	<title>{agent.name} icon — Favicons</title>
	<meta
		name="description"
		content="Download the official {agent.name} icon in {agent.formats.join(', ') || 'SVG/PNG'} format, or fetch it via the JSON API."
	/>
</svelte:head>

<div class="mx-auto w-full max-w-4xl px-4 py-8">
	<Button variant="ghost" size="sm" href="/" class="mb-6 -ml-2">
		<ArrowLeftIcon data-icon="inline-start" />
		All agents
	</Button>

	<div class="flex flex-col gap-8">
		<!-- Header -->
		<div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
			<div
				class="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border bg-muted/40 p-5"
			>
				{#if displaySrc}
					<img src={displaySrc} alt="{agent.name} icon" class="size-full object-contain" />
				{:else}
					<ImageOffIcon class="size-10 text-muted-foreground" />
				{/if}
			</div>
			<div class="flex flex-col gap-2">
				<div class="flex flex-wrap items-center gap-3">
					<h1 class="text-3xl font-bold tracking-tight">{agent.name}</h1>
					{#each agent.formats as format (format)}
						<Badge variant="secondary" class="uppercase">{format}</Badge>
					{/each}
				</div>
				{#if agent.vendor}
					<p class="text-muted-foreground">by {agent.vendor}</p>
				{/if}
				{#if agent.description}
					<p class="max-w-xl text-sm text-muted-foreground">{agent.description}</p>
				{/if}
				<div class="mt-1 flex flex-wrap gap-2">
					{#if svgIcon}
						<Button size="sm" onclick={copySvg}>
							<CopyIcon data-icon="inline-start" />
							Copy SVG
						</Button>
					{/if}
					{#if agent.icon}
						<Button size="sm" variant={svgIcon ? 'outline' : 'default'} href={agent.icon} download>
							<DownloadIcon data-icon="inline-start" />
							Download {agent.format?.toUpperCase()}
						</Button>
					{/if}
				</div>
			</div>
		</div>

		<Separator />

		<!-- Details grid -->
		<div class="grid gap-6 md:grid-cols-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Official links</Card.Title>
					<Card.Description>Where this project lives</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3 text-sm">
					{#if agent.websiteUrl}
						<a
							href={agent.websiteUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
						>
							<GlobeIcon class="size-4 shrink-0" />
							<span class="truncate">{agent.websiteUrl}</span>
							<ExternalLinkIcon class="size-3 shrink-0" />
						</a>
					{/if}
					{#if agent.githubUrl}
						<a
							href={agent.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
						>
							<GithubIcon class="size-4 shrink-0" />
							<span class="truncate">{agent.githubUrl}</span>
							<ExternalLinkIcon class="size-3 shrink-0" />
						</a>
					{/if}
					{#if !agent.websiteUrl && !agent.githubUrl}
						<p class="text-muted-foreground">No links recorded.</p>
					{/if}
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Icon provenance</Card.Title>
					<Card.Description>Last verified {verifiedLabel}</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3 text-sm">
					{#if agent.source}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium text-muted-foreground">Collected from</span>
							<a
								href={agent.source}
								target="_blank"
								rel="noopener noreferrer"
								class="truncate text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
							>
								{agent.source}
							</a>
						</div>
					{:else}
						<p class="text-muted-foreground">No icon collected yet — check back after the next daily crawl.</p>
					{/if}
					{#if agent.width && agent.height}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium text-muted-foreground">Dimensions</span>
							<span>{agent.width} × {agent.height}px</span>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Files -->
		{#if data.icons.length > 0}
			<Card.Root>
				<Card.Header>
					<Card.Title>Available files</Card.Title>
					<Card.Description>All stored formats for {agent.name}</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-2">
					{#each data.icons as icon (icon.format)}
						<div class="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
							<div class="flex items-center gap-3">
								<Badge variant={icon.isPrimary ? 'default' : 'secondary'} class="uppercase">
									{icon.format}
								</Badge>
								{#if icon.width && icon.height}
									<span class="text-muted-foreground">{icon.width}×{icon.height}</span>
								{/if}
								{#if icon.isPrimary}
									<span class="text-xs text-muted-foreground">primary</span>
								{/if}
							</div>
							<Button size="sm" variant="ghost" href={icon.url} download>
								<DownloadIcon data-icon="inline-start" />
								Download
							</Button>
						</div>
					{/each}
				</Card.Content>
			</Card.Root>
		{/if}

		<!-- API examples -->
		<Card.Root>
			<Card.Header>
				<Card.Title>API examples</Card.Title>
				<Card.Description>Fetch this icon programmatically — no API key required</Card.Description>
			</Card.Header>
			<Card.Content>
				<Tabs.Root value={apiExamples[0].label}>
					<Tabs.List>
						{#each apiExamples as example (example.label)}
							<Tabs.Trigger value={example.label}>{example.label}</Tabs.Trigger>
						{/each}
					</Tabs.List>
					{#each apiExamples as example (example.label)}
						<Tabs.Content value={example.label}>
							<div class="relative">
								<pre
									class="overflow-x-auto rounded-lg border bg-muted/40 p-4 pr-12 font-mono text-xs leading-relaxed">{example.code}</pre>
								<Button
									size="icon-sm"
									variant="ghost"
									class="absolute top-2 right-2"
									onclick={() => copyExample(example.code)}
									aria-label="Copy example"
								>
									<CopyIcon />
								</Button>
							</div>
						</Tabs.Content>
					{/each}
				</Tabs.Root>
			</Card.Content>
		</Card.Root>
	</div>
</div>
