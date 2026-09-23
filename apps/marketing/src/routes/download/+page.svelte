<script lang="ts">
	import {
		LINKS,
		PLATFORMS,
		RELEASE_PRIMARY_KIND,
		RELEASE_SECONDARY_KIND,
		selectArtifact
	} from '$lib/config';
	import OsIcon from '$lib/components/os-icon.svelte';
	import Seo from '$lib/components/seo.svelte';
	import { ArrowUpRight, Download, ShieldCheck, TerminalSquare } from '@lucide/svelte';
	import GithubMark from '$lib/components/github-mark.svelte';

	let { data } = $props();

	/** The stable manifest; null when the mirror could not be read. */
	const release = $derived(data.release ?? null);

	/**
	 * Every platform card links at the mirror artifact for the current stable
	 * release, so the file is a direct fetch. Where a platform ships a second
	 * package (Linux's `.deb`), it gets its own link under the card, because a
	 * file name nobody can click is not an offer. The GitHub release page stays
	 * in the meta row as a separate fallback, and the cards fall back to it too
	 * when the manifest could not be read.
	 */
	const requirements = [
		{
			icon: TerminalSquare,
			title: 'Open a project and start',
			body: 'CodeInOven is ready for useful work after installation. If you already use OpenCode, Codex, Claude Code, Antigravity, Cline, Pi, or Muse Code, you can keep working with them here.'
		},
		{
			icon: ShieldCheck,
			title: 'Bring your own API key or local server',
			body: 'Use your existing OpenAI or Anthropic API key, or connect a local server like Ollama, LM Studio, or llama.cpp. Requests go straight to the model provider, never through an intermediary proxy.'
		}
	];
</script>

<Seo
	title="Download CodeInOven (Code In Oven) for Mac, Windows, Linux"
	description="Download CodeInOven for macOS, Windows, or Linux. Build real software with AI in a free, open-source workspace for coding, testing, reviews, automations, and long-running work."
	canonical="/download"
/>

<section class="dl">
	<div class="heat-bar dl-heat" aria-hidden="true"><span class="heat-core"></span></div>

	<h1>Download CodeInOven</h1>
	<p class="dl-lead">
		Choose your platform and start building. Downloads come straight from our mirror, so they are
		fast. The GitHub release page stays available as a fallback.
	</p>

	<ul class="dl-grid">
		{#each PLATFORMS as platform (platform.id)}
			{@const artifact = selectArtifact(release, platform.id, RELEASE_PRIMARY_KIND[platform.id])}
			{@const secondaryKind = RELEASE_SECONDARY_KIND[platform.id]}
			{@const extra = secondaryKind ? selectArtifact(release, platform.id, secondaryKind) : null}
			<li class="dl-item">
				<a
					class="dl-card"
					href={artifact?.url ?? LINKS.releases}
					target="_blank"
					rel="noopener noreferrer"
					class:dl-card-soon={!platform.available}
				>
					<OsIcon os={platform.id} size={26} />
					<span class="dl-os">{platform.name}</span>
					{#if artifact}
						<code>{artifact.name}</code>
					{:else}
						<code>{platform.artifact}</code>
					{/if}
					<span class="dl-go">
						{artifact ? 'Fast download' : 'Latest release'}
						<ArrowUpRight aria-hidden="true" />
					</span>
				</a>
				{#if extra}
					<a
						class="dl-alt"
						href={extra.url}
						target="_blank"
						rel="noopener noreferrer"
						title={`Download ${extra.name}`}
					>
						<Download aria-hidden="true" />
						<code>{extra.name}</code>
					</a>
				{/if}
			</li>
		{/each}
	</ul>

	<div class="dl-meta">
		<a href={LINKS.releases} target="_blank" rel="noopener noreferrer">
			<GithubMark size={15} />
			GitHub releases (fallback)
		</a>
		<span aria-hidden="true">·</span>
		<a href={LINKS.github} target="_blank" rel="noopener noreferrer">Source on GitHub</a>
		<span aria-hidden="true">·</span>
		<a href={LINKS.license} target="_blank" rel="noopener noreferrer">License</a>
		<span aria-hidden="true">·</span>
		<a href={LINKS.security} target="_blank" rel="noopener noreferrer">Security policy</a>
	</div>

	<div class="dl-reqs">
		{#each requirements as requirement (requirement.title)}
			<article>
				<requirement.icon aria-hidden="true" class="dl-req-icon" />
				<div>
					<h2>{requirement.title}</h2>
					<p>{requirement.body}</p>
				</div>
			</article>
		{/each}
	</div>
</section>
