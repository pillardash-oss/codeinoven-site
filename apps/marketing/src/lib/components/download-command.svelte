<script lang="ts">
	import { onMount } from 'svelte';
	import {
		detectPlatform,
		downloadCommand,
		RELEASE_PRIMARY_KIND,
		RELEASE_SECONDARY_KIND,
		selectArtifact,
		type OsPlatform,
		type ReleaseManifest
	} from '$lib/config';
	import OsIcon from './os-icon.svelte';
	import { Check, Copy } from '@lucide/svelte';

	interface Props {
		/** The manifest read by the layout load; null when the mirror is unreachable. */
		release?: ReleaseManifest | null;
		/** Footer sizing: the same command, quieter. */
		compact?: boolean;
	}
	let { release = null, compact = false }: Props = $props();

	/**
	 * Detection is client-only, so the server always renders the safe
	 * all-platform fallback and the command swaps in once the platform is known.
	 */
	let platform = $state<OsPlatform | null>(null);
	let copied = $state<string | null>(null);
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		platform = detectPlatform();
	});

	const primary = $derived(
		platform ? selectArtifact(release, platform, RELEASE_PRIMARY_KIND[platform]) : null
	);
	const secondaryKind = $derived(platform ? RELEASE_SECONDARY_KIND[platform] : undefined);
	const secondary = $derived(
		platform && secondaryKind ? selectArtifact(release, platform, secondaryKind) : null
	);

	async function copy(text: string, id: string) {
		try {
			await navigator.clipboard.writeText(text);
			copied = id;
			clearTimeout(resetTimer);
			resetTimer = setTimeout(() => (copied = null), 1600);
		} catch {
			// Clipboard access can be denied; the command stays selectable text.
		}
	}
</script>

{#snippet commandLine(text: string, id: string, label: string)}
	<div class="cmd-line">
		<code>{text}</code>
		<button
			type="button"
			class="cmd-copy"
			class:is-copied={copied === id}
			aria-label={copied === id ? `${label} copied` : `Copy ${label}`}
			title={`Copy ${label}`}
			onclick={() => copy(text, id)}
		>
			{#if copied === id}
				<Check aria-hidden="true" />
			{:else}
				<Copy aria-hidden="true" />
			{/if}
		</button>
	</div>
{/snippet}

{#if platform === 'windows' && primary}
	<!-- Windows installs by running a file, so it keeps a button. -->
	<a
		class="button button-icon"
		href={primary.url}
		title="Download CodeInOven for Windows"
		aria-label="Download CodeInOven for Windows"
	>
		<OsIcon os="windows" size={20} />
	</a>
{:else if primary}
	<div class="dl-command" class:is-compact={compact}>
		{@render commandLine(downloadCommand(primary), 'primary', 'download command')}
		{#if secondary}
			<p class="cmd-alt">Or take the .deb instead</p>
			{@render commandLine(downloadCommand(secondary), 'secondary', '.deb download command')}
		{/if}
	</div>
{:else}
	<!-- No manifest, unknown platform, or a platform with no artifact yet. -->
	<a class="button" href="/download">
		Download
		<span class="button-os" aria-hidden="true">
			<OsIcon os="macos" />
			<OsIcon os="windows" />
			<OsIcon os="linux" />
		</span>
		<span class="sr-only">for macOS, Windows, and Linux</span>
	</a>
{/if}
