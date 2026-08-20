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
      lead: "Write the engineering specification, not a prompt.",
      body: "Specs stay editable through inline and section annotations. Context is assembled explicitly — system, project, skills, MCPs, checklist, history — so you can see what the agent will be told before it is told.",
      marks: ["system", "project", "skills", "MCPs", "checklist", "history"],
    },
    {
      id: "review",
      title: "Review",
      lead: "The human reviews. The agent implements.",
      body: "Plans surface in the same thread as the work, with visible state transitions and a real approval gate. Nothing moves to implementation because a model felt confident about it.",
      marks: ["plan diff", "state transitions", "approve", "send back"],
    },
    {
      id: "approve",
      title: "Approve",
      lead: "Permission is a policy, not a vibe.",
      body: "Two levels, always on screen. Auto Review runs anything you have not explicitly denied. Full Access is the deliberate, clearly marked exception — the app calls it what it is rather than hiding it behind a friendly toggle.",
      marks: ["Auto Review", "Full Access"],
    },
    {
      id: "implement",
      title: "Implement",
      lead: "Runs you can replay, diff and roll back.",
      body: "Implementation executes against the approved spec with independent audit and rework cycles. Atomic writes, chunked history, checkpoints and per-thread branches mean any session can be reconstructed later.",
      marks: ["checkpoint", "audit", "rework", "diff"],
    },
  ];

  /** Capabilities that are true of the shipped app, not aspirational. */
  const capabilities = [
    {
      icon: Replace,
      title: "One workflow, any harness",
      body: "OpenCode, Codex, Claude Code, Pi, Cline, Antigravity, Muse Code and more plug in behind a single typed driver contract. Pick the engine per thread and swap mid-project — the threads, specs and history stay exactly where they were.",
    },
    {
      icon: ScanEye,
      title: "Vision on any model",
      body: "Every agent sees through our image descriptor, so you can pick the cheapest text-only model and still get full image understanding. The power and price of a text model, with vision bolted on — no premium vision model required.",
    },
    {
      icon: MonitorPlay,
      title: "Computer use, out of the box",
      body: "Agents can run the project, click through the UI and test the result as they build — actually trying the thing, not just writing code and hoping it works.",
    },
    {
      icon: GitPullRequest,
      title: "Git & pull requests, in the loop",
      body: "Status, diffs, staging, commits and push all live in the workspace. Open a pull request and review the change side-by-side without leaving the run you are watching.",
    },
    {
      icon: Cloud,
      title: "Cloud deployments at a glance",
      body: "Monitor live deployments from Coolify, Vercel, Railway, Dokploy or Netlify in the same window — watch a commit go from build to live while the agent is still working.",
    },
    {
      icon: Brain,
      title: "A memory the agents share",
      body: "Durable, searchable memory with categories, priorities and per-project scope. Agents record and recall it across threads, so the next run already knows your rules.",
    },
    {
      icon: Smartphone,
      title: "Remote from your phone",
      body: "One QR scan pairs your phone over an encrypted link. Keep chatting, reviewing and approving from anywhere — LAN-first, with a cloud relay when you are away.",
    },
    {
      icon: Target,
      title: "Threads scoped to the job",
      body: "Scope a thread to a goal or a feature and track it on a kanban board — todo, working, done, issue, pinned. Every agent stays inside the boundary you drew.",
    },
    {
      icon: TerminalSquare,
      title: "A real terminal, attached",
      body: "A PTY-backed terminal lives beside the conversation, so the commands an agent runs and the commands you run share one machine and one working tree.",
    },
  ];

  /** Straight from the app bible — the product's actual commitments. */
  const principles = [
    {
      icon: Radio,
      title: "Determinism over vibes",
      body: "If a run cannot be replayed from persisted state, that is a bug — not a quirk of working with models.",
    },
    {
      icon: FileCheck2,
      title: "The human reviews",
      body: "The agent implements by default, but approval is a gate in the lifecycle, not a courtesy notification after the fact.",
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
      Your agents already write the code.<br />
      <span class="hero-title-accent">Somebody has to run the kitchen.</span>
    </h1>

    <p class="hero-lead anim" style="--d:120ms">
      CodeInOven is the desktop control plane that sits above your coding agents
      — harness-agnostic, one reviewable lifecycle, one auditable record. Git,
      deployments, memory and phone remote all live in the same window. Bring
      your own subscription. Fork the whole thing.
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
      <p>Drives the agents you already have installed</p>
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
      A video of DeepSeek V4 Flash 0731 using computer use to implement and test
      a feature on CodeInOven
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
      installed on your machine and drives it through the same typed contract —
      so the choice of engine stops being an architectural commitment and
      becomes a dropdown.
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
        Any OpenAI-compatible endpoint works. These three are one-click presets
        — everything else is a base URL and a model id.
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
        Sign in through the harness's own account, or bring a key. Credentials
        stay in the harness's config where they belong — CodeInOven does not
        proxy your traffic.
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
      A chat window hides the moment a suggestion becomes a change. CodeInOven
      makes that moment a stage you have to walk through.
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
      Reasoning, tool calls, durations and exit status — inline, and still there
      tomorrow.
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
      Built like an instrument, not a landing page
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
      The permission scope sits in the composer — visible before you send, not
      after.
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
    CodeInOven runs on your desktop, drives the harnesses you already have
    installed, and keeps every run reviewable long after the conversation
    scrolls away.
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
