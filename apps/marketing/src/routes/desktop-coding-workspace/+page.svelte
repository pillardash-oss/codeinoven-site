<script lang="ts">
  import Seo from "$lib/components/seo.svelte";
  import { LINKS } from "$lib/config";

  const workflow = [
    {
      number: "01",
      title: "Open the project you already have.",
      text: "CodeInOven works with a local project and the coding agents installed on your machine. Your files stay in their usual place.",
    },
    {
      number: "02",
      title: "Give the agent the tools the work needs.",
      text: "Keep the project, terminal, browser, and Git changes close while an agent works. Choose a hosted model or connect a local model server.",
    },
    {
      number: "03",
      title: "Review the change before it ships.",
      text: "Follow the run, inspect the diff, and keep the commits you want. CodeInOven leaves you in control of what lands in your project.",
    },
  ];
</script>

<Seo
  title="Desktop workspace for AI coding agents"
  description="Bring coding agents, your local project, terminal, browser, and Git review into one open-source desktop workspace. Download CodeInOven for macOS, Windows, or Linux."
  canonical="/desktop-coding-workspace"
  type="article"
/>

<main class="workspace-page">
  <section class="workspace-hero" aria-labelledby="workspace-title">
    <div class="workspace-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="workspace-wrap workspace-hero-grid">
      <div>
        <p class="workspace-kicker">A desktop coding workspace</p>
        <h1 id="workspace-title">Your coding agent belongs beside the code.</h1>
        <p class="workspace-intro">
          CodeInOven brings your project, coding agents, terminal, browser, and Git review into one desktop app. Work with the agents you already use, then inspect every change before you keep it.
        </p>
        <div class="workspace-actions">
          <a class="workspace-button" href="/download">Download CodeInOven <span aria-hidden="true">↗</span></a>
          <a class="workspace-text-link" href={LINKS.github} target="_blank" rel="noopener noreferrer">Read the source</a>
        </div>
        <p class="workspace-platforms">Free and open source · macOS · Windows · Linux</p>
      </div>
      <aside class="workspace-console" aria-label="What stays in view while an agent works">
        <div class="console-top"><span></span><span></span><span></span><small>project / current run</small></div>
        <div class="console-body">
          <p class="console-label">IN THE SAME WORKSPACE</p>
          <ul>
            <li><span class="console-index">A</span><span>Project files</span><b>open</b></li>
            <li><span class="console-index">B</span><span>Agent run</span><b class="console-active">live</b></li>
            <li><span class="console-index">C</span><span>Terminal + browser</span><b>attached</b></li>
            <li><span class="console-index">D</span><span>Diff + checkpoints</span><b>review</b></li>
          </ul>
          <div class="console-rule"><span></span><small>you decide what stays</small></div>
        </div>
      </aside>
    </div>
  </section>

  <section class="workspace-section workspace-fit" aria-labelledby="fit-title">
    <div class="workspace-wrap workspace-two-col">
      <div>
        <p class="workspace-kicker">The useful distinction</p>
        <h2 id="fit-title">An agent does the task. The workspace holds the work.</h2>
      </div>
      <div class="workspace-prose">
        <p>A coding agent can plan and change code. A desktop workspace gives that agent a place to work with your project, run commands, check a page, and show you the resulting diff.</p>
        <p>CodeInOven brings those pieces together around your real files. It supports several coding agents and model providers, so you can choose the setup that fits each project.</p>
      </div>
    </div>
  </section>

  <section class="workspace-section workspace-process" aria-labelledby="process-title">
    <div class="workspace-wrap">
      <div class="workspace-section-head">
        <p class="workspace-kicker">A practical loop</p>
        <h2 id="process-title">From the first question to a reviewable change.</h2>
      </div>
      <ol class="workspace-steps">
        {#each workflow as step (step.number)}
          <li>
            <span class="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <section class="workspace-section workspace-details" aria-labelledby="details-title">
    <div class="workspace-wrap workspace-two-col">
      <div>
        <p class="workspace-kicker">Made for real projects</p>
        <h2 id="details-title">Keep your setup. Keep your say.</h2>
      </div>
      <div class="workspace-detail-list">
        <article>
          <h3>Use the agents you know</h3>
          <p>Run supported coding agents from the same workspace. Pick a different agent for another thread without moving your project.</p>
        </article>
        <article>
          <h3>Choose where models run</h3>
          <p>Connect hosted providers or a local model server. CodeInOven sends requests to the provider you select, not through its own model proxy.</p>
        </article>
        <article>
          <h3>Review actual project changes</h3>
          <p>See commands, diffs, and checkpoints as work happens. Commit the changes you choose to keep.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="workspace-end" aria-labelledby="workspace-end-title">
    <div class="workspace-wrap workspace-end-inner">
      <p class="workspace-kicker">Start with the project on your machine</p>
      <h2 id="workspace-end-title">Bring your agent into the work.</h2>
      <p>CodeInOven is free, open source, and available for macOS, Windows, and Linux.</p>
      <a class="workspace-button" href="/download">Choose your download <span aria-hidden="true">↗</span></a>
    </div>
  </section>
</main>

<style>
  .workspace-page {
    --ink: #e9e9df;
    --muted: #a2a49a;
    --line: rgba(228, 227, 210, .15);
    --acid: #c8f06c;
    color: var(--ink);
    background: #111310;
    font-family: "JetBrains Mono Variable", "SFMono-Regular", monospace;
  }

  .workspace-wrap { width: min(1120px, calc(100% - 48px)); margin: 0 auto; }
  .workspace-hero { position: relative; overflow: hidden; border-bottom: 1px solid var(--line); background: radial-gradient(ellipse at 85% 36%, rgba(138, 164, 78, .15), transparent 36%), #111310; }
  .workspace-hero-grid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(340px, .8fr); gap: 8%; align-items: center; min-height: 680px; padding-top: 100px; padding-bottom: 100px; }
  .workspace-kicker { margin: 0 0 22px; color: var(--acid); font-size: .69rem; letter-spacing: .16em; text-transform: uppercase; }
  .workspace-hero h1, .workspace-section h2, .workspace-end h2 { margin: 0; font-family: "JetBrains Mono Variable", "SFMono-Regular", monospace; font-weight: 500; letter-spacing: -.07em; line-height: 1.08; }
  .workspace-hero h1 { max-width: 680px; font-size: clamp(2.8rem, 6.4vw, 5.6rem); }
  .workspace-intro { max-width: 610px; margin: 28px 0 0; color: #c0c1b7; font-size: 1rem; line-height: 1.85; }
  .workspace-actions { display: flex; flex-wrap: wrap; gap: 24px; align-items: center; margin-top: 34px; }
  .workspace-button { display: inline-flex; gap: 26px; align-items: center; padding: 15px 18px; color: #16190f; background: var(--acid); font-size: .8rem; font-weight: 700; text-decoration: none; transition: background .2s, transform .2s; }
  .workspace-button:hover { background: #ddff91; transform: translateY(-2px); }
  .workspace-button span { font-size: 1.1rem; }
  .workspace-text-link { color: var(--ink); font-size: .78rem; text-underline-offset: 5px; }
  .workspace-platforms { margin: 18px 0 0; color: #85877d; font-size: .68rem; letter-spacing: .04em; }
  .workspace-orbit { position: absolute; top: 5%; right: -13%; width: min(60vw, 740px); aspect-ratio: 1; border: 1px solid rgba(200, 240, 108, .09); border-radius: 50%; }
  .workspace-orbit::before, .workspace-orbit::after { position: absolute; inset: 11%; border: 1px solid rgba(200, 240, 108, .08); border-radius: 50%; content: ""; }
  .workspace-orbit::after { inset: 24%; }
  .workspace-orbit span { position: absolute; top: 50%; left: 0; width: 7px; height: 7px; border-radius: 50%; background: var(--acid); box-shadow: 0 0 22px rgba(200, 240, 108, .8); }
  .workspace-orbit span:nth-child(2) { top: 19%; left: 70%; width: 4px; height: 4px; opacity: .6; }
  .workspace-orbit span:nth-child(3) { top: 78%; left: 25%; width: 5px; height: 5px; opacity: .4; }
  .workspace-console { border: 1px solid rgba(227, 231, 204, .2); background: rgba(20, 23, 18, .92); box-shadow: 0 28px 100px rgba(0, 0, 0, .4); transform: rotate(1.2deg); }
  .console-top { display: flex; align-items: center; gap: 6px; height: 43px; padding: 0 15px; border-bottom: 1px solid var(--line); }
  .console-top > span { width: 7px; height: 7px; border: 1px solid #75796c; border-radius: 50%; }
  .console-top small { margin-left: 12px; color: #8a8c80; font-size: .61rem; }
  .console-body { padding: 25px 24px 22px; }
  .console-label { margin: 0 0 22px; color: #8f9381; font-size: .59rem; letter-spacing: .14em; }
  .console-body ul { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; }
  .console-body li { display: grid; grid-template-columns: 27px 1fr auto; gap: 10px; align-items: center; min-height: 54px; border-top: 1px solid rgba(228, 227, 210, .1); color: #d9dbd0; font-size: .7rem; }
  .console-index { color: #777b6d; font-size: .61rem; }
  .console-body li b { color: #898d7e; font-size: .57rem; font-weight: 400; text-transform: uppercase; }
  .console-body li b.console-active { color: var(--acid); }
  .console-rule { display: flex; gap: 11px; align-items: center; margin-top: 20px; color: var(--acid); font-size: .6rem; }
  .console-rule span { width: 24px; height: 1px; background: var(--acid); }
  .workspace-section { padding: 112px 0; }
  .workspace-two-col { display: grid; grid-template-columns: .85fr 1fr; gap: 12%; }
  .workspace-section h2, .workspace-end h2 { max-width: 590px; font-size: clamp(2rem, 4vw, 3.5rem); }
  .workspace-prose { padding-top: 12px; }
  .workspace-prose p { margin: 0 0 20px; color: #b9bbb1; font-size: .91rem; line-height: 1.9; }
  .workspace-process { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: #171a15; }
  .workspace-section-head { max-width: 700px; margin-bottom: 65px; }
  .workspace-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px; margin: 0; padding: 0; list-style: none; }
  .workspace-steps li { min-height: 215px; padding: 22px 22px 18px 0; border-top: 1px solid rgba(200, 240, 108, .45); }
  .step-number { color: var(--acid); font-size: .65rem; letter-spacing: .1em; }
  .workspace-steps h3, .workspace-detail-list h3 { margin: 30px 0 12px; font-size: 1rem; font-weight: 500; line-height: 1.5; }
  .workspace-steps p, .workspace-detail-list p { margin: 0; color: #aeb0a5; font-family: system-ui, sans-serif; font-size: .88rem; line-height: 1.8; }
  .workspace-details { background: #e8e8dc; color: #20231c; }
  .workspace-details .workspace-kicker { color: #607728; }
  .workspace-detail-list { display: grid; grid-template-columns: 1fr 1fr; gap: 38px 30px; }
  .workspace-detail-list article { padding-top: 17px; border-top: 1px solid rgba(32, 35, 28, .25); }
  .workspace-detail-list h3 { margin: 0 0 12px; }
  .workspace-detail-list p { color: #505349; }
  .workspace-end { padding: 100px 0; border-top: 1px solid var(--line); background: radial-gradient(ellipse at 50% 110%, rgba(153, 180, 83, .15), transparent 50%), #111310; text-align: center; }
  .workspace-end-inner { display: grid; justify-items: center; }
  .workspace-end h2 { max-width: 720px; }
  .workspace-end-inner > p:not(.workspace-kicker) { max-width: 560px; margin: 20px 0 28px; color: var(--muted); font-size: .88rem; line-height: 1.8; }
  @media (max-width: 760px) {
    .workspace-wrap { width: min(100% - 36px, 560px); }
    .workspace-hero-grid { grid-template-columns: 1fr; gap: 54px; min-height: 0; padding-top: 92px; padding-bottom: 75px; }
    .workspace-hero h1 { font-size: clamp(2.65rem, 13vw, 4.4rem); }
    .workspace-console { max-width: 500px; }
    .workspace-orbit { top: 16%; right: -45%; width: 100vw; }
    .workspace-section { padding: 78px 0; }
    .workspace-two-col { grid-template-columns: 1fr; gap: 34px; }
    .workspace-section-head { margin-bottom: 40px; }
    .workspace-steps { grid-template-columns: 1fr; gap: 20px; }
    .workspace-steps li { min-height: 0; padding-bottom: 25px; }
    .workspace-steps h3 { margin-top: 18px; }
    .workspace-detail-list { grid-template-columns: 1fr; gap: 25px; }
    .workspace-end { padding: 78px 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .workspace-button { transition: none; }
  }
</style>
