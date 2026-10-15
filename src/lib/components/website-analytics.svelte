<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { PUBLIC_POSTHOG_TOKEN } from '$app/env/public';
  import {
    capture, configureAnalytics, disposeAnalytics, flushAnalytics, pageViewed,
    startAnalytics, trackLink,
  } from '#lib/analytics.ts';

  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  let scrollDepth = 0;
  let active = false;

  onMount(() => {
    active = configureAnalytics(PUBLIC_POSTHOG_TOKEN);
    startAnalytics();
    pageViewed();
    return () => { clearTimeout(scrollTimer); disposeAnalytics(); };
  });
  afterNavigate(() => {
    if (!active) return;
    scrollDepth = 0;
    clearTimeout(scrollTimer);
    pageViewed();
  });
  function scroll() {
    if (!active || scrollTimer) return;
    scrollTimer = setTimeout(() => {
      scrollTimer = undefined;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height <= 0) return;
      const depth = Math.min(100, Math.floor(window.scrollY / height * 4) * 25);
      if (depth > scrollDepth) {
        scrollDepth = depth;
        capture('website_scroll_depth', { depth });
      }
    }, 500);
  }
</script>

<svelte:document onclick={trackLink} onvisibilitychange={() => {
  if (document.visibilityState === 'hidden') void flushAnalytics();
}} />
<svelte:window onscroll={scroll} onpagehide={() => { void flushAnalytics(); }} />
