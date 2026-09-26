<script lang="ts">
  import Seo from "$lib/components/seo.svelte";
  import {
    LINKS,
    PLATFORMS,
    RELEASE_PRIMARY_KIND,
    RELEASE_SECONDARY_KIND,
    selectArtifact,
  } from "$lib/config";
  import OsIcon from "$lib/components/os-icon.svelte";
  import { ArrowUpRight } from "@lucide/svelte";

  let { data }: import("./$types").PageProps = $props();
  const release = $derived(data.release ?? null);
</script>

<Seo
  title="Download CodeInOven"
  description="Download the CodeInOven desktop workspace for macOS, Windows, or Linux."
  canonical="/download"
/>

<section class="inner-page download-page" aria-labelledby="download-title">
  <div class="wrap">
    <div class="page-crumb">
      <a href="/">CodeInOven</a><span aria-hidden="true">/</span><span>Download</span>
    </div>

    <header class="page-heading download-heading">
      <div>
        <p class="page-eyebrow"><span class="status-dot" aria-hidden="true"></span>Latest stable release</p>
        <h1 id="download-title">Choose your platform.</h1>
        <p class="page-lead">
          Get the desktop workspace for macOS, Windows, or Linux. Downloads come
          straight from the CodeInOven mirror.
        </p>
      </div>
      <aside class="mirror-note" aria-label="Download source">
        <span class="mirror-label">Release channel</span>
        <strong>Stable</strong>
        <span>
          {release
            ? "Direct from our mirror. No installer wrapper."
            : "The mirror is unavailable. Use GitHub releases as a fallback."}
        </span>
      </aside>
    </header>

    <section class="download-grid" aria-label="Choose your operating system">
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
        {#if platform.id === "linux"}
          <article class="download-card linux-card">
            <div class="download-card-head">
              <span class="os-glyph" aria-hidden="true"><OsIcon os={platform.id} size={22} /></span>
              <span class="platform-type">AppImage · x64</span>
            </div>
            <div class="linux-copy">
              <h2>Linux</h2>
              <p>Choose the package that fits your distribution.</p>
            </div>
            <div class="linux-actions">
              <a class="download-action" href={artifact?.url ?? LINKS.releases}>
                <span><strong>AppImage</strong><small>Portable · most distributions</small></span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              {#if extra}
                <a class="download-action download-action-secondary" href={extra.url}>
                  <span><strong>Debian package</strong><small>For Debian and Ubuntu</small></span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              {:else}
                <a class="download-action download-action-secondary" href={LINKS.releases}>
                  <span><strong>Debian package</strong><small>See current GitHub release assets</small></span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              {/if}
            </div>
          </article>
        {:else}
          <article class="download-card">
            <div class="download-card-head">
              <span class="os-glyph" aria-hidden="true"><OsIcon os={platform.id} size={22} /></span>
              <span class="platform-type">
                {platform.id === "macos" ? "Disk image · arm64" : "Installer · x64"}
              </span>
            </div>
            <h2>{platform.name}</h2>
            <p>
              {platform.id === "macos"
                ? "Open the disk image and move CodeInOven into Applications."
                : "Run the installer to add CodeInOven to your desktop."}
            </p>
            <code class="artifact-name">{artifact?.name ?? platform.artifact}</code>
            <a class="download-action" href={artifact?.url ?? LINKS.releases}>
              <span>Download for {platform.name}</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          </article>
        {/if}
      {/each}
    </section>

    <div class="release-fallback">
      <span>Need an older build or source archive?</span>
      <a href={LINKS.releases} target="_blank" rel="noopener noreferrer">
        Browse GitHub releases <span aria-hidden="true">↗</span>
      </a>
    </div>
  </div>
</section>
