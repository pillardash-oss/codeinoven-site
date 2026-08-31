<script lang="ts">
	import { LICENSE, LINKS, PLATFORMS, PRODUCT } from '$lib/config';
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
			title: 'At least one harness installed',
			body: 'CodeInOven drives the agent CLIs already on your machine — OpenCode, Codex, Claude Code, Pi, Cline, Antigravity, Muse Code and more. It detects whatever is on your PATH at startup.'
		},
		{
			icon: ShieldCheck,
			title: 'Your own model access',
			body: 'Sign in with your current harness, or point a custom base URL at Ollama, LM Studio, or llama.cpp. CodeInOven does not proxy your traffic and does not resell tokens.'
		}
	];
</script>

<Seo
	title="Download CodeInOven (Code In Oven) - Desktop AI Coding Agent Workstation"
	description="Download CodeInOven for macOS, Windows, and Linux. Free for personal and non-commercial use — a desktop control plane for AI coding agents (Claude Code, OpenCode, Codex, Antigravity)."
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
		<a href={LINKS.license} target="_blank" rel="noopener noreferrer">{LICENSE} licensed</a>
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
