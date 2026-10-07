<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { PUBLIC_POSTHOG_TOKEN } from '$app/env/public';
  import {
    analyticsChoice, capture, chooseAnalytics, configureAnalytics, disposeAnalytics,
    flushAnalytics, pageViewed, privacyRequested, syncAnalyticsConsent, trackLink,
    type AnalyticsChoice,
  } from '#lib/analytics.ts';

  let enabled = $state(false);
  let choice = $state<AnalyticsChoice>(null);
  let editing = $state(false);
  let privateVisit = $state(false);
  let ready = false;
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  let scrollDepth = 0;

  onMount(() => {
    enabled = configureAnalytics(PUBLIC_POSTHOG_TOKEN);
    privateVisit = privacyRequested();
    choice = analyticsChoice();
    syncAnalyticsConsent();
    ready = true;
    pageViewed();
    return () => { clearTimeout(scrollTimer); disposeAnalytics(); };
  });
  afterNavigate(() => {
    if (!ready) return;
    scrollDepth = 0;
    clearTimeout(scrollTimer);
    pageViewed();
  });
  function choose(value: Exclude<AnalyticsChoice, null>) {
    chooseAnalytics(value);
    choice = value;
    editing = false;
    pageViewed();
  }
  function syncChoice(event: StorageEvent) {
    if (event.key !== 'codeinoven.analytics.choice' && event.key !== null) return;
    choice = analyticsChoice();
    syncAnalyticsConsent();
    scrollDepth = 0;
    pageViewed();
  }
  function scroll() {
    if (choice !== 'allowed' || scrollTimer) return;
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
<svelte:window onstorage={syncChoice} onscroll={scroll} onpagehide={() => { void flushAnalytics(); }} />

{#if enabled && !privateVisit}
  <button class="analytics-settings" type="button" onclick={() => (editing = !editing)} aria-expanded={editing || choice === null}>
    Analytics preferences
  </button>
  {#if choice === null || editing}
    <aside class="analytics-choice" aria-label="Website analytics preferences">
      <div>
        <strong>Help us improve the website</strong>
        <p>Allow anonymous visit and download statistics through PostHog? <a href="/privacy#website">Privacy details</a></p>
      </div>
      <div class="analytics-actions">
        <button type="button" onclick={() => choose('declined')}>Decline</button>
        <button type="button" class="allow" onclick={() => choose('allowed')}>Allow analytics</button>
      </div>
    </aside>
  {/if}
{/if}

<style>
  .analytics-settings { background: none; border: 0; padding: 0; color: var(--muted); font: inherit; font-size: 0.75rem; cursor: pointer; }
  .analytics-choice { position: fixed; bottom: 1rem; left: 1rem; right: 1rem; z-index: 50; max-width: 52rem; margin-inline: auto; padding: 1.25rem; background: var(--surface); color: var(--fg); border: 1px solid var(--line-strong); display: flex; align-items: center; gap: 1.5rem; box-shadow: 0 0.5rem 2rem var(--app); }
  strong { font-size: 0.875rem; font-weight: 500; }
  p { color: var(--muted); font-size: 0.75rem; margin-top: 0.375rem; }
  a { text-decoration: underline; }
  .analytics-actions { display: flex; gap: 0.75rem; flex-shrink: 0; }
  .analytics-actions button { border: 1px solid var(--line-strong); background: var(--elevated); color: var(--fg); padding: 0.75rem; font: inherit; font-size: 0.75rem; cursor: pointer; }
  .analytics-actions .allow { border-color: var(--accent); }
  button:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
  @media (max-width: 40rem) { .analytics-choice { flex-direction: column; align-items: flex-start; gap: 1rem; } }
</style>
