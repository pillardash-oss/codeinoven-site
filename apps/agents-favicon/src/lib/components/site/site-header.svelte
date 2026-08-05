<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import XIcon from '@lucide/svelte/icons/x';
	import BrandMark from '$lib/components/site/brand-mark.svelte';
	import GithubMark from '$lib/components/site/github-mark.svelte';
	import { LINKS } from '$lib/config';

	const links = [
		{ href: '/', label: 'Gallery' },
		{ href: '/api', label: 'API' },
		{ href: '/about', label: 'About' },
		{ href: '/submissions', label: 'Submit' },
		{ href: '/catalog.json', label: 'catalog.json' },
		{ href: '/llms.txt', label: 'llms.txt' }
	];

	let menuOpen = $state(false);
	const close = () => (menuOpen = false);

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<header class="bg-background/85 sticky top-0 z-40 border-b backdrop-blur-xl">
	<div class="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4">
		<a href="/" class="flex shrink-0 items-center gap-2.5">
			<BrandMark size={26} />
			<span class="text-[15px] font-bold tracking-tight">Favicons</span>
		</a>

		<!-- Desktop nav -->
		<nav class="ml-auto hidden items-center gap-0.5 text-[13px] md:flex">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class={[
						'hover:text-foreground rounded-md px-2.5 py-1.5 font-medium transition-colors',
						isActive(link.href) ? 'text-foreground' : 'text-muted-foreground'
					]}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- Desktop actions -->
		<div class="ml-auto hidden items-center gap-1.5 md:flex">
			<a
				href={LINKS.github}
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-foreground text-muted-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors"
			>
				<GithubMark size={14} />
				GitHub
			</a>
			<Button href={LINKS.download} target="_blank" rel="noopener noreferrer" size="sm">
				Download
			</Button>
		</div>

		<!-- Mobile: download + menu toggle -->
		<div class="ml-auto flex items-center gap-2 md:hidden">
			<Button href={LINKS.download} target="_blank" rel="noopener noreferrer" size="sm">
				Download
			</Button>
			<button
				type="button"
				class="hover:bg-muted focus-visible:ring-ring/50 text-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
				aria-controls="mobile-menu"
				onclick={() => (menuOpen = !menuOpen)}
			>
				{#if menuOpen}
					<XIcon class="size-5" />
				{:else}
					<MenuIcon class="size-5" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile menu sheet -->
	{#if menuOpen}
		<nav id="mobile-menu" class="bg-background border-t md:hidden">
			<div class="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4">
				{#each links as link (link.href)}
					<a
						href={link.href}
						onclick={close}
						class={[
							'rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors',
							isActive(link.href)
								? 'bg-muted text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						]}
					>
						{link.label}
					</a>
				{/each}
				<a
					href={LINKS.github}
					target="_blank"
					rel="noopener noreferrer"
					onclick={close}
					class="text-muted-foreground hover:text-foreground mt-2 flex items-center gap-2 rounded-md border-t px-3 py-3 text-[15px] font-medium transition-colors"
				>
					<GithubMark size={16} />
					GitHub
				</a>
			</div>
		</nav>
	{/if}
</header>
