<script lang="ts">
  import GithubMark from "$lib/components/github-mark.svelte";
  import OsIcon from "$lib/components/os-icon.svelte";
  import Seo from "$lib/components/seo.svelte";
  import {
    LINKS,
    PLATFORMS,
    RELEASE_PRIMARY_KIND,
    RELEASE_SECONDARY_KIND,
    selectArtifact,
  } from "$lib/config";
  import { Download } from "@lucide/svelte";

  let { data } = $props();

  /** The stable manifest; null when the mirror could not be read. */
  const release = $derived(data.release ?? null);
</script>

<Seo
  title="Download CodeInOven (Code In Oven) for Mac, Windows, Linux"
  description="Download CodeInOven for macOS, Windows, or Linux. Build real software with AI in a free, open-source workspace for coding, testing, reviews, automations, and long-running work."
  canonical="/download"
/>

<section class="dl">
  <div class="heat-bar dl-heat" aria-hidden="true">
    <span class="heat-core"></span>
  </div>

  <h1>Download CodeInOven</h1>
  <p class="dl-lead">
    Choose your platform and start building. Downloads come straight from our
    mirror, so they are fast. The GitHub release page stays available as a
    fallback.
  </p>

  <ul class="dl-grid">
    {#each PLATFORMS as platform (platform.id)}
      {@const artifact = selectArtifact(
        release,
        platform.id,
        RELEASE_PRIMARY_KIND[platform.id],
      )}
      {@const secondaryKind = RELEASE_SECONDARY_KIND[platform.id]}
      {@const extra = secondaryKind
        ? selectArtifact(release, platform.id, secondaryKind)
        : null}
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
          <span class="dl-go"> Download </span>
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
      GitHub releases
    </a>
  </div>
</section>
