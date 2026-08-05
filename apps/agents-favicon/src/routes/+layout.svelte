<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from '$lib/components/ui/sonner';
	import SiteHeader from '$lib/components/site/site-header.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Favicons — icons for AI coding agents</title>
	<meta
		name="description"
		content="A curated, daily-refreshed directory of icons for AI coding agents and agentic developer tools. Copy SVG, download originals, or use the JSON API."
	/>
	<meta property="og:title" content="Favicons" />
	<meta
		property="og:description"
		content="A curated, daily-refreshed directory of icons for AI coding agents and agentic developer tools."
	/>
</svelte:head>

<Toaster richColors />

<div class="flex min-h-svh flex-col bg-background text-foreground">
	<SiteHeader />
	<main class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
</div>
