<script lang="ts">
	import { LINKS, PLATFORMS, PRODUCT } from '$lib/config';
	import OsIcon from '$lib/components/os-icon.svelte';
	import Seo from '$lib/components/seo.svelte';
	import { ArrowUpRight, ShieldCheck, TerminalSquare } from '@lucide/svelte';
	import GithubMark from '$lib/components/github-mark.svelte';

	/**
	 * Every button points at the repository's `releases/latest` page rather than
	 * a pinned artifact URL, so a new release is live here the moment it is
	 * published — nothing on this site needs editing per version.
	 */
	const requirements = [
		{
			icon: TerminalSquare,
			title: 'Bundled with Pi (or connect your existing CLIs)',
			body: 'Pi is included inside the application, so you can start right away without installing command-line tools first. If you already use OpenCode, Codex, Claude Code, Antigravity, Cline, or Muse Code, CodeInOven detects them on your PATH.'
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
	description="Download CodeInOven (Code in Oven) for macOS, Windows, and Linux. Desktop software engineering workbench with bundled Pi, inner browser, terminal, and GitHub PR reviews."
	canonical="/download"
/>

<section class="dl">
	<div class="heat-bar dl-heat" aria-hidden="true"><span class="heat-core"></span></div>

	<h1>Download CodeInOven</h1>
	<p class="dl-lead">
		Every button below opens the latest published release on GitHub. Pick the artifact for your
		platform. There is no installer script, no account, and no telemetry gate.
	</p>

	<ul class="dl-grid">
		{#each PLATFORMS as platform (platform.id)}
			<li>
				<a
					class="dl-card"
					href={LINKS.releases}
					target="_blank"
					rel="noopener noreferrer"
					class:dl-card-soon={!platform.available}
				>
					<OsIcon os={platform.id} size={26} />
					<span class="dl-os">{platform.name}</span>
					<code>{platform.artifact}</code>
					<span class="dl-go">
						Latest release
						<ArrowUpRight aria-hidden="true" />
					</span>
				</a>
			</li>
		{/each}
	</ul>

	<div class="dl-meta">
		<a href={LINKS.github} target="_blank" rel="noopener noreferrer">
			<GithubMark size={15} />
			Source on GitHub
		</a>
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
