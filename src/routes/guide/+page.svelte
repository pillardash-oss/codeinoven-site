<script lang="ts">
  import Seo from "#lib/components/seo.svelte";
  import { LINKS } from "#lib/config.ts";

  const guideSections = [
    { href: "#first-steps", label: "Get started" },
    { href: "#work-with-agent", label: "Ask for a change" },
    { href: "#review-work", label: "Review the work" },
    { href: "#settings", label: "Set up agents and models" },
    { href: "#help", label: "When something gets stuck" },
  ];
</script>

<Seo
  title="Getting started with CodeInOven"
  description="A practical guide to opening a project, working with a coding agent, and reviewing changes in CodeInOven."
  canonical="/guide"
  type="article"
/>

<main class="guide-page">
  <header class="guide-hero">
    <div class="guide-wrap guide-hero-inner">
      <div class="guide-breadcrumb"><a href="/">CodeInOven</a><span aria-hidden="true">/</span><span>Guide</span></div>
      <h1>Make your first change with CodeInOven.</h1>
      <p>Open a project, tell an agent what you want to change, and review the result before it lands in your code.</p>
      <a class="guide-primary" href="/download">Download CodeInOven</a>
    </div>
  </header>

  <div class="guide-wrap guide-layout">
    <nav class="guide-index" aria-label="On this page">
      <p>On this page</p>
      {#each guideSections as section (section.href)}
        <a href={section.href}>{section.label}</a>
      {/each}
    </nav>

    <article class="guide-content">
      <section id="first-steps" class="guide-section">
        <h2>Get started</h2>
        <p>CodeInOven works with folders and Git repositories on your computer. If you already have a project, you can open that folder directly.</p>
        <ol class="guide-steps">
          <li><span>1</span><div><h3>Install and open the app</h3><p><a href="/download">Download CodeInOven</a> for your computer, install it, then launch it.</p></div></li>
          <li><span>2</span><div><h3>Add your project</h3><p>In Projects, choose <strong>Local Folder</strong> to open a folder on this computer, or <strong>Clone Git Repo</strong> to bring in a repository. You can also connect an Oven if your project lives on another machine.</p></div></li>
          <li><span>3</span><div><h3>Start a thread</h3><p>Open the project and start a thread. A thread is a conversation about one piece of work, such as fixing a bug or adding a setting.</p></div></li>
        </ol>
      </section>

      <section id="work-with-agent" class="guide-section">
        <h2>Ask for a change</h2>
        <p>Choose an available agent and model in the message composer, describe the outcome you want, then send your message. You can start with a plain request such as “Explain how sign-in works before changing anything.”</p>
        <p>For a small change, say what should happen and any limits that matter. For a larger idea, ask the agent to help plan it first. CodeInOven shows the agent’s activity and any review or permission requests in the thread.</p>
        <aside class="guide-note"><strong>New to coding agents?</strong><span>Ask the agent to explain its plan in everyday language. You can clarify the request before work begins.</span></aside>
      </section>

      <section id="review-work" class="guide-section">
        <h2>Review the work</h2>
        <p>When the agent finishes, read its summary and open the Git or Changes panel to inspect the files it changed. Keep the changes you want, and ask for adjustments if something is missing.</p>
        <ol class="guide-review-list">
          <li><span>Read the summary</span><p>Check what the agent says it changed and what it could not complete.</p></li>
          <li><span>Inspect the diff</span><p>Review the added and removed lines in the changed files.</p></li>
          <li><span>Run your checks</span><p>Use the project’s usual run or test steps, then ask the agent to fix any problems you find.</p></li>
          <li><span>Commit when ready</span><p>Use the Git panel to commit the changes you have reviewed, or keep working in the thread.</p></li>
        </ol>
      </section>

      <section id="settings" class="guide-section">
        <h2>Set up agents and models</h2>
        <p>Open <strong>Settings → Harnesses</strong> to see which coding agents CodeInOven can use and configure model providers. Some agents need to be installed and signed in on your computer first. Pi is included with the app.</p>
        <p>To use a hosted provider, add its account details in the harness settings. You can also connect a compatible local model server. The choices available in a thread depend on the selected agent.</p>
      </section>

      <section id="help" class="guide-section">
        <h2>When something gets stuck</h2>
        <ul class="guide-help-list">
          <li><strong>An agent is missing.</strong> Open Settings → Harnesses and follow the install or sign-in guidance shown there.</li>
          <li><strong>The agent cannot use a model.</strong> Check that the provider is configured and that the selected model is available for that agent.</li>
          <li><strong>A command asks for permission.</strong> Read the request in the thread and allow it only if you understand what it will do.</li>
          <li><strong>You need help diagnosing a problem.</strong> Open Settings → About and create a diagnostics bundle to share when asking for support.</li>
        </ul>
      </section>

      <details class="agent-section">
        <summary>Agent Section</summary>
        <div class="agent-section-body">
          <p>This section gives coding agents a concise map of the product and links to deeper references. It stays closed unless you open it.</p>
          <ul>
            <li><strong>Product overview:</strong> <a href={`${LINKS.github}/blob/main/README.md`}>Repository README</a></li>
            <li><strong>Engineering lifecycle:</strong> <a href={`${LINKS.github}/blob/main/docs/ENGINEERING-LIFECYCLE.md`}>Stage behavior, approval points, and recovery</a></li>
            <li><strong>Assistant view:</strong> <a href={`${LINKS.github}/blob/main/docs/ASSISTANT-VIEW.md`}>Routines and scheduled work</a></li>
            <li><strong>Oven setup:</strong> <a href={`${LINKS.github}/blob/main/docs/OVEN-SETUP.md`}>Remote machine setup and project checkouts</a></li>
          </ul>
          <p>Useful user-facing entry points include Projects for adding local folders or cloning Git repositories, Settings → Harnesses for agent and model setup, the thread composer for choosing a runtime, and the Git panel for reviewing project changes.</p>
        </div>
      </details>
    </article>
  </div>
</main>

<style>
  .guide-page { color: var(--fg); background: var(--app); }
  .guide-wrap { width: min(100% - 2.5rem, 1120px); margin-inline: auto; }
  .guide-hero { border-bottom: 1px solid var(--line); background: radial-gradient(ellipse at 78% 10%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 38%), var(--app); }
  .guide-hero-inner { padding-block: clamp(3.5rem, 9vw, 7rem); }
  .guide-breadcrumb { display: flex; gap: .65rem; margin-bottom: 2.2rem; color: var(--muted); font-size: .82rem; }
  .guide-breadcrumb a { color: var(--fg-dim); text-decoration: none; }
  .guide-hero h1 { max-width: 760px; font-size: clamp(2.5rem, 7vw, 5.4rem); font-weight: 500; line-height: 1.08; letter-spacing: -.065em; }
  .guide-hero p { max-width: 650px; margin-top: 1.4rem; color: var(--fg-dim); font-family: system-ui, sans-serif; font-size: 1.08rem; line-height: 1.8; }
  .guide-primary { display: inline-flex; margin-top: 1.8rem; padding: .85rem 1.1rem; background: var(--accent); color: var(--fg); font-size: .9rem; font-weight: 600; text-decoration: none; }
  .guide-primary:hover { background: var(--accent-hover); }
  .guide-layout { display: grid; grid-template-columns: 190px minmax(0, 720px); justify-content: space-between; gap: 4rem; padding-block: 4rem 7rem; }
  .guide-index { position: sticky; top: 5.5rem; align-self: start; display: grid; gap: .3rem; }
  .guide-index p { margin-bottom: .75rem; color: var(--muted); font-size: .78rem; }
  .guide-index a { padding: .45rem .6rem; border-left: 1px solid var(--line-strong); color: var(--fg-dim); font-size: .82rem; text-decoration: none; }
  .guide-index a:hover { border-color: var(--accent); color: var(--fg); }
  .guide-section { scroll-margin-top: 6rem; padding-block: 0 3.5rem; }
  .guide-section + .guide-section { padding-top: 2.6rem; border-top: 1px solid var(--line); }
  .guide-section h2 { margin-bottom: 1rem; font-size: clamp(1.6rem, 3vw, 2.15rem); font-weight: 500; letter-spacing: -.045em; }
  .guide-section > p, .guide-steps p, .guide-review-list p, .guide-help-list, .guide-note { color: var(--fg-dim); font-family: system-ui, sans-serif; font-size: .96rem; line-height: 1.8; }
  .guide-section > p + p { margin-top: 1rem; }
  .guide-section a, .agent-section a { color: var(--fg); text-decoration-color: var(--accent); text-underline-offset: 3px; }
  .guide-steps { display: grid; gap: 1.5rem; margin-top: 1.8rem; }
  .guide-steps li { display: grid; grid-template-columns: 2.2rem 1fr; gap: 1rem; }
  .guide-steps li > span { display: grid; width: 2rem; height: 2rem; place-items: center; border: 1px solid var(--line-strong); color: var(--accent-hover); font-size: .85rem; }
  .guide-steps h3 { margin: 0 0 .25rem; font-size: 1rem; font-weight: 600; }
  .guide-note { display: grid; gap: .2rem; margin-top: 1.6rem; padding: 1rem 1.1rem; border-left: 2px solid var(--accent); background: var(--surface); }
  .guide-note strong { color: var(--fg); }
  .guide-review-list { display: grid; gap: 1.1rem; margin-top: 1.5rem; }
  .guide-review-list li { padding-top: .9rem; border-top: 1px solid var(--line); }
  .guide-review-list span { font-size: .94rem; font-weight: 600; color: var(--fg); }
  .guide-help-list { display: grid; gap: 1rem; margin-top: 1.3rem; }
  .guide-help-list strong { color: var(--fg); }
  .agent-section { margin-top: .8rem; border: 1px solid var(--line-strong); background: var(--surface); }
  .agent-section summary { padding: 1rem 1.2rem; cursor: pointer; color: var(--fg); font-weight: 600; }
  .agent-section summary::marker { color: var(--accent-hover); }
  .agent-section-body { padding: 0 1.2rem 1.3rem; color: var(--fg-dim); font-family: system-ui, sans-serif; font-size: .9rem; line-height: 1.8; }
  .agent-section-body ul { display: grid; gap: .45rem; margin-block: .9rem; }
  @media (max-width: 720px) {
    .guide-layout { grid-template-columns: 1fr; gap: 2.5rem; padding-block: 2.5rem 4rem; }
    .guide-index { position: static; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .guide-index p { grid-column: 1 / -1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .guide-primary { transition: none; }
  }
</style>
