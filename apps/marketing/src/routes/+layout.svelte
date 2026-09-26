<script lang="ts">
  import "./layout.css";
  import { COMPANY, LICENSE, LINKS, PRODUCT } from "$lib/config";
  import GithubMark from "$lib/components/github-mark.svelte";

  let { children }: import("./$types").LayoutProps = $props();
  let menuOpen = $state(false);
  let navStuck = $state(false);

  const year = new Date().getFullYear();
  const navLinks = [
    { href: "/#workspace", label: "Workspace" },
    { href: "/#how", label: "How it works" },
    { href: "/#agents", label: "Agents" },
    { href: "/#faq", label: "FAQ" },
  ];

  function closeMenu() {
    menuOpen = false;
  }

  function updateNav() {
    navStuck = window.scrollY > 8;
  }
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape") closeMenu();
  }}
  onscroll={updateNav}
/>

<div class="grain" aria-hidden="true"></div>
<div class="scanlines" aria-hidden="true"></div>

<header class="nav" class:is-stuck={navStuck} data-nav>
  <div class="nav-inner">
    <a class="brand" href="/" aria-label="CodeInOven home" onclick={closeMenu}>
      <img src="/brand/codeinoven-logo.webp" alt="" class="brand-mark" />
      <span class="brand-word">Code<em>In</em>Oven</span>
    </a>

    <nav class="nav-links" aria-label="Primary">
      {#each navLinks as link (link.href)}
        <a href={link.href}>{link.label}</a>
      {/each}
    </nav>

    <div class="nav-actions">
      <a
        class="nav-ghost"
        href={LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubMark size={15} />
        GitHub
      </a>
      <a class="nav-cta" href="/download">Download</a>
    </div>

    <button
      class="nav-burger"
      type="button"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      aria-controls="mobile-menu"
      onclick={() => (menuOpen = !menuOpen)}
    >
      <span></span><span></span>
    </button>
  </div>

  <nav
    class="mobile-menu"
    id="mobile-menu"
    aria-label="Mobile"
    hidden={!menuOpen}
    inert={!menuOpen}
  >
    {#each navLinks as link (link.href)}
      <a href={link.href} onclick={closeMenu}>{link.label}</a>
    {/each}
    <a href={LINKS.github} target="_blank" rel="noopener noreferrer" onclick={closeMenu}>
      GitHub
    </a>
    <a href={LINKS.privacy} onclick={closeMenu}>Privacy</a>
    <a href="/download" onclick={closeMenu}>Download</a>
  </nav>
</header>

<main id="top">
  {@render children()}
</main>

<footer class="footer">
  <div class="wrap footer-grid">
    <div class="footer-identity">
      <img src="/brand/codeinoven-logo.webp" alt="" class="footer-mark" />
      <span class="footer-word">Code<em>In</em>Oven</span>
      <p class="footer-line">{PRODUCT.tagline}</p>
    </div>

    <nav class="footer-col" aria-label="Product">
      <h3>Product</h3>
      <a href="/#workspace">Workspace</a>
      <a href="/#how">How it works</a>
      <a href="/download">Download</a>
      <a href="/#faq">FAQ</a>
    </nav>

    <nav class="footer-col" aria-label="Developers">
      <h3>Developers</h3>
      <a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href={LINKS.license} target="_blank" rel="noopener noreferrer">{LICENSE} License</a>
      <a href={LINKS.security} target="_blank" rel="noopener noreferrer">Security</a>
    </nav>

    <nav class="footer-col" aria-label="Company">
      <h3>Company</h3>
      <a href={LINKS.privacy}>Privacy</a>
      <a href={COMPANY.url} target="_blank" rel="noopener noreferrer">{COMPANY.shortName}</a>
    </nav>
  </div>

  <div class="wrap footer-base">
    <p>© {year} {COMPANY.name}</p>
    <p>A product of {COMPANY.name}.</p>
  </div>
</footer>
