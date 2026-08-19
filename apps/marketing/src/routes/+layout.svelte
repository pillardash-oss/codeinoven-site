<script lang="ts">
  import "./layout.css";
  import BrandMark from "$lib/components/brand-mark.svelte";
  import GithubMark from "$lib/components/github-mark.svelte";
  import { COMPANY, LICENSE, LINKS, PRODUCT } from "$lib/config";
  import { Kanban, X } from "@lucide/svelte";

  let { children } = $props();

  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/#lifecycle", label: "Lifecycle" },
    { href: "/#harnesses", label: "Harnesses" },
    { href: "/#workstation", label: "Workstation" },
    { href: "/#principles", label: "Principles" },
  ];

  let menuOpen = $state(false);

  /** Any navigation closes the sheet — every link is a same-page anchor. */
  const close = () => (menuOpen = false);
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape") close();
  }}
/>

<svelte:head>
  <title>CodeInOven — Your AI coding work, under control</title>
  <meta name="description" content={PRODUCT.description} />
  <meta
    property="og:title"
    content="CodeInOven — Your AI coding work, under control."
  />
  <meta property="og:description" content={PRODUCT.description} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content="https://codeinoven.com/meta.webp" />
  <meta property="og:image:type" content="image/webp" />
  <meta property="og:image:width" content="1731" />
  <meta property="og:image:height" content="909" />
  <meta property="og:url" content="https://codeinoven.com" />
  <meta property="og:site_name" content="CodeInOven" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="CodeInOven — Your AI coding work, under control."
  />
  <meta name="twitter:description" content={PRODUCT.description} />
  <meta name="twitter:image" content="https://codeinoven.com/meta.webp" />
</svelte:head>

<div class="shell" class:menu-open={menuOpen}>
  <header class="nav">
    <a class="brand" aria-label="CodeInOven — home" href="/" onclick={close}>
      <BrandMark size={26} />
      <span class="brand-word">Code<em>In</em>Oven</span>
    </a>

    <!-- Desktop -->
    <nav class="nav-links" aria-label="Primary">
      {#each navLinks as link (link.href)}
        <a href={link.href}>{link.label}</a>
      {/each}
      <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
        <GithubMark size={14} />
        GitHub
      </a>
      <a class="nav-cta" href="/download">Download</a>
    </nav>

    <!-- Mobile -->
    <div class="nav-mobile">
      <button
        type="button"
        class="nav-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onclick={() => (menuOpen = !menuOpen)}
      >
        {#if menuOpen}
          <X aria-hidden="true" size={16} strokeWidth={1.8} />
        {:else}
          <Kanban aria-hidden="true" size={16} strokeWidth={1.8} />
        {/if}
      </button>
    </div>
  </header>

  <!-- Mobile sheet. Hidden from assistive tech and tab order when closed. -->
  <nav
    id="mobile-menu"
    class="mobile-sheet"
    aria-label="Mobile"
    inert={!menuOpen}
  >
    {#each navLinks as link (link.href)}
      <a href={link.href} onclick={close}>{link.label}</a>
    {/each}
    <a
      href={LINKS.github}
      target="_blank"
      rel="noopener noreferrer"
      onclick={close}
    >
      <GithubMark size={15} />
      GitHub
    </a>
    <a
      href={LINKS.license}
      target="_blank"
      rel="noopener noreferrer"
      onclick={close}
    >
      {LICENSE} licence
    </a>
    <a class="mobile-download" href="/download" onclick={close}>Download</a>
  </nav>

  <main>
    {@render children()}
  </main>

  <footer class="site-footer">
    <!-- Centred identity block: mark, wordmark, what it is, who makes it. -->
    <div class="footer-identity">
      <BrandMark size={44} />
      <span class="footer-word">Code<em>In</em>Oven</span>
      <p class="footer-line">{PRODUCT.tagline}</p>
      <p class="footer-company">
        A product of
        <a href={COMPANY.url} target="_blank" rel="noopener noreferrer"
          >{COMPANY.name}</a
        >
      </p>

      <nav class="footer-links" aria-label="Footer">
        <a href="/download">Download</a>
        <a href={LINKS.github} target="_blank" rel="noopener noreferrer"
          >GitHub</a
        >
        <a href={LINKS.security} target="_blank" rel="noopener noreferrer"
          >Security</a
        >
        <a href={LINKS.privacy}>Privacy</a>
        <a href={LINKS.license} target="_blank" rel="noopener noreferrer"
          >{LICENSE} licence</a
        >
      </nav>
    </div>

    <div class="footer-base">
      <span>© {year} {COMPANY.name}</span>
      <span class="footer-lifecycle"
        >specify → review → approve → implement</span
      >
    </div>
  </footer>
</div>
