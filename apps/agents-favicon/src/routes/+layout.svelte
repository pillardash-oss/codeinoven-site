<script lang="ts">
  import "./layout.css";
  import { Toaster } from "$lib/components/ui/sonner";
  import SiteHeader from "$lib/components/site/site-header.svelte";
  import SiteFooter from "$lib/components/site/site-footer.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <title>Favicons: icons for AI coding agents</title>
  <meta
    name="description"
    content="A curated directory of icons for AI coding agents and coding tools, refreshed daily. Copy SVG, download originals, or use the JSON API."
  />
  <meta property="og:title" content="Favicons: icons for AI coding agents" />
  <meta
    property="og:description"
    content="A curated directory of icons for AI coding agents and coding tools, refreshed daily."
  />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content="https://codeinoven.com/meta.webp" />
  <meta property="og:image:type" content="image/webp" />
  <meta property="og:image:width" content="1731" />
  <meta property="og:image:height" content="909" />
  <meta property="og:site_name" content="CodeInOven Agents Favicons" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Favicons: icons for AI coding agents" />
  <meta
    name="twitter:description"
    content="A curated directory of icons for AI coding agents and coding tools, refreshed daily."
  />
  <meta name="twitter:image" content="https://codeinoven.com/meta.webp" />
</svelte:head>

<Toaster richColors />

<div class="flex min-h-svh flex-col bg-background text-foreground">
  <SiteHeader />
  <main class="flex-1">
    {@render children()}
  </main>
  <SiteFooter />
</div>
