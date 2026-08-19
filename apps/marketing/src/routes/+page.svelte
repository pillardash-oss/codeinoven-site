<script lang="ts">
  import { onMount } from "svelte";
  import {
    HARNESSES,
    HOSTED_PROVIDERS,
    LOCAL_BACKENDS,
  } from "$lib/data/harnesses";
  import { LICENSE, LINKS } from "$lib/config";
  import OsIcon from "$lib/components/os-icon.svelte";
  import {
    ArrowUpRight,
    Brain,
    Cloud,
    FileCheck2,
    GitPullRequest,
    MonitorPlay,
    Radio,
    Replace,
    ScanEye,
    ShieldCheck,
    SlidersHorizontal,
    Smartphone,
    Target,
    TerminalSquare,
  } from "@lucide/svelte";

  /** The four lifecycle stages, exactly as the app models them. */
  const lifecycle = [
    {
      id: "specify",
      title: "Specify",
      lead: "Start with clear instructions, not a guess.",
      body: "You define the goal, constraints, and checks in one place. Before the agent runs, you can review the full context you gave it and make corrections.",
      marks: ["system", "project", "skills", "MCPs", "checklist", "history"],
    },
    {
      id: "review",
      title: "Review",
      lead: "You review each step before it goes to code.",
      body: "The agent writes a plan in the same thread first. You see each proposed change and approve only what should move forward.",
      marks: ["plan diff", "state transitions", "approve", "send back"],
    },
    {
      id: "approve",
      title: "Approve",
      lead: "You decide what the agent can edit.",
      body: "Permission level is always visible. Auto Review is safe by default, while full access is an explicit, manual choice.",
      marks: ["Auto Review", "Full Access"],
    },
    {
      id: "implement",
      title: "Implement",
      lead: "Every run is reviewable, repeatable, and reversible.",
      body: "After approval, changes are applied with checkpoints and clear diffs. You can replay work and rollback if needed.",
      marks: ["checkpoint", "audit", "rework", "diff"],
    },
  ];

  /** Capabilities that are true of the shipped app, not aspirational. */
  const capabilities = [
    {
      icon: Replace,
      title: "One workflow, any harness",
      body: "Use the AI tools you already have. You can switch between OpenCode, Codex, Claude Code, Pi, Cline, Antigravity, Muse Code and others without losing your current work.",
    },
    {
      icon: ScanEye,
      title: "Vision on any model",
      body: "Need image understanding? Add our image helper and keep using your preferred text model. You get visuals without changing your whole workflow.",
    },
    {
      icon: MonitorPlay,
      title: "Computer use, out of the box",
      body: "Agents can open your project UI and test features as they work, so changes are checked in real behavior, not only in files.",
    },
    {
      icon: GitPullRequest,
      title: "Git & pull requests, in the loop",
      body: "Status, diffs, staging, commits, and pushes all stay in one place. You can review pull requests without jumping out of your current workflow.",
    },
    {
      icon: Cloud,
      title: "Cloud deployments at a glance",
      body: "Watch deployments on Coolify, Vercel, Railway, Dokploy, or Netlify from the same interface, from code change to live update.",
    },
    {
      icon: Brain,
      title: "A memory the agents share",
      body: "Keep shared notes and rules per project. New runs can reuse that memory so each attempt starts from what matters.",
    },
    {
      icon: Smartphone,
      title: "Remote from your phone",
      body: "Pair once with a QR code. You can review and approve work from your phone whether you are local or away.",
    },
    {
      icon: Target,
      title: "Threads scoped to the job",
      body: "Keep each run focused on one goal. The board shows todo, working, done, and issues so work stays scoped and organized.",
    },
    {
      icon: TerminalSquare,
      title: "A real terminal, attached",
      body: "A real terminal is available next to the conversation, so both you and the agent work from the same project folder.",
    },
  ];

  /** Straight from the app bible — the product's actual commitments. */
  const principles = [
    {
      icon: Radio,
      title: "Determinism over vibes",
      body: "If a run cannot be replayed from saved state, that is a bug we want to fix, not accepted behavior.",
    },
    {
      icon: FileCheck2,
      title: "The human reviews",
      body: "The agent proposes and executes work, but nothing lands without your approval.",
    },
    {
      icon: ShieldCheck,
      title: "Never touch what is not yours",
      body: "CodeInOven keeps its own state in its own config directory. It does not write uninvited into your repository.",
    },
    {
      icon: SlidersHorizontal,
      title: "Bounded on purpose",
      body: "Threads, history chunks and checkpoints are all capped. Growth is a decision you make, never something that happens to you.",
    },
  ];

  onMount(() => {
    const els = document.querySelectorAll(".reveal");
    // `js` is set synchronously in app.html; drop it if we cannot observe, so
    // nothing stays stuck at opacity 0.
    if (!("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("js");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  });
</script>

<!-- ─── Hero ─────────────────────────────────────────────────────────────── -->
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-inner">
    <p class="eyebrow anim" style="--d:0ms">
      <span class="eyebrow-dot"></span>Open source · {LICENSE} licensed
    </p>

    <h1 id="hero-title" class="hero-title anim" style="--d:60ms">
      Your AI coding tools can start fast.<br />
      <span class="hero-title-accent">You still keep control.</span>
    </h1>

    <p class="hero-lead anim" style="--d:120ms">
      CodeInOven brings your existing coding agents together in one place.
      You can review plans, approve changes, and watch Git, deployments,
      memory, and remote sessions all in one interface. Bring your own model
      access. Fork the project and run it your way.
    </p>

    <div class="hero-actions anim" style="--d:180ms">
      <a class="button" href="/download">
        <OsIcon os="macos" />
        Download for macOS
      </a>
      <a class="ghost-link" href="/download">
        Windows · Linux
        <ArrowUpRight aria-hidden="true" />
      </a>
    </div>

    <!-- The heat element from the product mark, made live. -->
    <div class="heat-bar anim" style="--d:240ms" aria-hidden="true">
      <span class="heat-core"></span>
    </div>

    <!-- The harnesses, in their own colors, right where the claim is made. -->
    <div class="hero-harnesses anim" style="--d:300ms">
      <p>Works with the agents you already use</p>
      <ul>
        {#each HARNESSES as harness, i (harness.id)}
          <li
            style="--i:{i}"
            title={harness.name}
            class={harness.tile ? "is-tile" : "is-glyph"}
          >
            <img src="/harness/{harness.id}.svg" alt={harness.name} />
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Real capture of the running application. The app has its own window
	     chrome, so it is shown as-is rather than inside an invented frame.
	     The static frame is the poster; once it loads the muted recording
	     plays through the same shot. -->
  <figure id="workstation" class="hero-shot reveal">
    <video
      src="/shots/workspace-hero.mp4"
      poster="/shots/workspace.png"
      aria-label="The CodeInOven workspace: a project and thread rail on the left, an agent run in the
			middle showing reasoning traces and tool calls with status, and a context panel on the right."
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      width="1920"
      height="1254"
    ></video>
    <figcaption>
      A video of DeepSeek implementing and testing a feature on CodeInOven using
      the built-in app tester.
    </figcaption>
  </figure>
</section>

<!-- ─── Harness matrix — the differentiator ──────────────────────────────── -->
<section
  id="harnesses"
  class="section reveal"
  aria-labelledby="harnesses-title"
>
  <div class="section-head">
    <p class="kicker">The matrix</p>
    <h2 id="harnesses-title">
      Bring your own harness. All of them, if you like.
    </h2>
    <p class="section-lead">
      Most tools marry you to one agent. CodeInOven detects what is already
      installed and drives each one the same way —
      so the choice of engine is a practical decision, not a lock-in decision.
    </p>
  </div>

  <ul class="harness-grid">
    {#each HARNESSES as harness (harness.id)}
      <li class="harness-cell">
        <a href={harness.website} target="_blank" rel="noopener noreferrer">
          <span class="harness-mark {harness.tile ? 'is-tile' : 'is-glyph'}">
            <img src="/harness/{harness.id}.svg" alt="" aria-hidden="true" />
          </span>
          <span class="harness-name">{harness.name}</span>
          <span class="harness-vendor">{harness.vendor}</span>
          <code class="harness-cmd">{harness.command}</code>
          <span
            class="harness-flag"
            class:harness-flag-off={!harness.customProviders}
          >
            {harness.customProviders ? "custom providers" : "vendor models"}
          </span>
        </a>
      </li>
    {/each}
  </ul>

  <div class="backend-split">
    <div class="backend-block">
      <h3>Or point it at your own metal</h3>
      <p>
        Any OpenAI-compatible endpoint works. These three are one-click presets;
        everything else uses your base URL and model name.
      </p>
      <ul class="backend-list">
        {#each LOCAL_BACKENDS as backend (backend.name)}
          <li>
            <span class="backend-mark">
              {#if backend.id}
                <img
                  src="/providers/{backend.id}.svg"
                  alt=""
                  aria-hidden="true"
                />
              {:else}
                <TerminalSquare aria-hidden="true" size={16} />
              {/if}
            </span>
            <span class="backend-name">{backend.name}</span>
            <code>{backend.baseUrl}</code>
          </li>
        {/each}
      </ul>
    </div>

    <div class="backend-block">
      <h3>Or the hosted ones you already pay for</h3>
      <p>
        Sign in through the harness account or add a key. Credentials stay in that
        harness config; CodeInOven does not proxy your requests.
      </p>
      <ul class="provider-wall">
        {#each HOSTED_PROVIDERS as provider (provider)}
          <li>
            <img
              src="/providers/{provider}.svg"
              alt={provider}
              loading="lazy"
            />
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<!-- ─── Lifecycle ────────────────────────────────────────────────────────── -->
<section
  id="lifecycle"
  class="section section-narrow reveal"
  aria-labelledby="lifecycle-title"
>
  <div class="section-head">
    <p class="kicker">The lifecycle</p>
    <h2 id="lifecycle-title">Four stages. No silent jumps between them.</h2>
    <p class="section-lead">
      A normal chat can hide when a suggestion becomes real code. CodeInOven
      makes that moment a clear, step-by-step check you cannot skip.
    </p>
  </div>

  <ol class="stage-rail">
    {#each lifecycle as stage, index (stage.id)}
      <li class="stage reveal">
        <div class="stage-index" aria-hidden="true">
          <span>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div class="stage-body">
          <h3>{stage.title}</h3>
          <p class="stage-lead">{stage.lead}</p>
          <p class="stage-copy">{stage.body}</p>
          <div class="stage-marks">
            {#each stage.marks as mark (mark)}
              <span>{mark}</span>
            {/each}
          </div>
        </div>
      </li>
    {/each}
  </ol>

  <figure class="inline-shot reveal">
    <img
      src="/shots/trace.png"
      alt="A CodeInOven run in progress: collapsible thinking blocks with durations, and tool call
			rows showing shell commands and file reads with success, failure and running status."
      width="1400"
      height="960"
      loading="lazy"
      decoding="async"
    />
    <figcaption>
      Reasoning, commands, timing, and results stay visible, not hidden in logs.
    </figcaption>
  </figure>
</section>

<!-- ─── Capabilities ─────────────────────────────────────────────────────── -->
<section
  id="capabilities"
  class="section reveal"
  aria-labelledby="capabilities-title"
>
  <div class="section-head">
    <p class="kicker">The workstation</p>
    <h2 id="capabilities-title">
      Built for daily work, not marketing
    </h2>
  </div>

  <div class="cap-grid">
    {#each capabilities as capability (capability.title)}
      <article class="cap-cell reveal">
        <capability.icon aria-hidden="true" class="cap-icon" />
        <h3>{capability.title}</h3>
        <p>{capability.body}</p>
      </article>
    {/each}
  </div>

  <figure class="composer-shot reveal">
    <img
      src="/shots/composer.png"
      alt="The CodeInOven composer, showing the current permission scope set to Full Access, the
			selected model, and a stop control while the agent works."
      width="1400"
      height="263"
      loading="lazy"
      decoding="async"
    />
    <figcaption>
      Permission level is always visible before you start a run.
    </figcaption>
  </figure>
</section>

<!-- ─── Principles ───────────────────────────────────────────────────────── -->
<section
  id="principles"
  class="section section-narrow reveal"
  aria-labelledby="principles-title"
>
  <div class="section-head">
    <p class="kicker">Principles</p>
    <h2 id="principles-title">The rules the product holds itself to</h2>
  </div>

  <div class="principle-grid">
    {#each principles as principle (principle.title)}
      <article class="principle-cell">
        <principle.icon aria-hidden="true" class="principle-icon" />
        <div>
          <h3>{principle.title}</h3>
          <p>{principle.body}</p>
        </div>
      </article>
    {/each}
  </div>
</section>

<!-- ─── Close ────────────────────────────────────────────────────────────── -->
<section id="get-started" class="closer reveal" aria-labelledby="closer-title">
  <div class="heat-bar closer-heat" aria-hidden="true">
    <span class="heat-core"></span>
  </div>
  <h2 id="closer-title">Your agents. Your models. Your machine.</h2>
  <p>
    CodeInOven runs on your desktop, works with your current setup, and keeps
    every run easy to review, even after the chat is done.
  </p>
  <div class="closer-actions">
    <a class="button" href="/download">
      <OsIcon os="macos" />
      Download CodeInOven
    </a>
    <a
      class="ghost-link"
      href={LINKS.github}
      target="_blank"
      rel="noopener noreferrer"
    >
      Read the source
      <ArrowUpRight aria-hidden="true" />
    </a>
  </div>
</section>
