<script lang="ts">
  import { onMount } from "svelte";
  import {
    HARNESSES,
    HOSTED_PROVIDERS,
    LOCAL_BACKENDS,
  } from "$lib/data/harnesses";
  import { LINKS } from "$lib/config";
  import OsIcon from "$lib/components/os-icon.svelte";
  import Seo from "$lib/components/seo.svelte";
  import {
    ArrowUpRight,
    Boxes,
    Brain,
    Cloud,
    FileCheck2,
    Flame,
    Gauge,
    GitFork,
    GitPullRequest,
    Globe,
    HeartHandshake,
    Kanban,
    MonitorPlay,
    Radio,
    Replace,
    ScanEye,
    ShieldCheck,
    SlidersHorizontal,
    Smartphone,
    Sparkles,
    Target,
    Terminal,
    TerminalSquare,
    Workflow,
  } from "@lucide/svelte";

  /** The four lifecycle stages, exactly as the app models them. */
  const lifecycle = [
    {
      id: "specify",
      title: "Specify",
      lead: "A spec with fixed sections.",
      body: "Problem, Resolution, Success Criteria, Test Strategy, Commit Pattern, Constraints & Risks. Same structure every time, so nothing important stays unsaid.",
      marks: [
        "problem",
        "resolution",
        "success criteria",
        "test strategy",
        "commit pattern",
      ],
    },
    {
      id: "review",
      title: "Review",
      lead: "Read it before anything runs.",
      body: "The agent drafts the spec from your thread. Annotate any section and send it back. Once you approve, that text is the contract the work is held to.",
      marks: ["annotations", "versions", "approve", "send back"],
    },
    {
      id: "approve",
      title: "Approve",
      lead: "Permissions are explicit.",
      body: "Tool calls ask within the tier you set. Auto Review by default; full access only if you switch it on yourself.",
      marks: ["Auto Review", "Full Access"],
    },
    {
      id: "implement",
      title: "Implement",
      lead: "Checked work, phase by phase.",
      body: "Each phase lands as a checkpoint with a diff. An audit pass tests the result against Success Criteria before you merge.",
      marks: ["checkpoints", "diffs", "audit", "rollback"],
    },
  ];

  /** Core capabilities of the all-day engineering workstation. */
  const workstationCapabilities = [
    {
      icon: Globe,
      title: "Integrated inner browser",
      body: "Test web apps as they run in real time, inspect the live DOM, navigate technical docs, and let vision or CUA agents verify real user flows directly in the window.",
    },
    {
      icon: Terminal,
      title: "Attached project terminal",
      body: "A real shell session attached to your active project workspace. Run builds, linters, migrations, Docker commands, and scripts side-by-side with your agent.",
    },
    {
      icon: GitPullRequest,
      title: "Native GitHub PR studio",
      body: "Review pull requests, check live diffs, resolve merge conflicts, stage surgical changes, and commit directly without context-switching to the web.",
    },
    {
      icon: Sparkles,
      title: "Ideation & brainstorm studio",
      body: "Brainstorm product concepts, generate PRDs, prototype rapid spikes, and validate architectures before committing a single line of production code.",
    },
    {
      icon: Gauge,
      title: "Telemetry, usage & cost tracking",
      body: "Live visibility into token burn, context windows, API rates, and per-step costs. Create reusable project actions to automate repetitive build routines.",
    },
    {
      icon: Kanban,
      title: "Projects & scopes Kanban",
      body: "Switch effortlessly between multiple repositories and organize work into focused scopes: Pinned, Todo, Spec, and Done—with zero context collision.",
    },
    {
      icon: Replace,
      title: "One workflow, any harness",
      body: "Bundled with Pi out of the box, or drive your installed OpenCode, Codex, Claude Code, Antigravity, Cline, Muse Code, and more without starting over.",
    },
    {
      icon: ScanEye,
      title: "Vision & CUA on any model",
      body: "Add the image helper when a task needs screenshots or mockups understood. Agents operate the desktop UI, test real interactions, and verify visual styling.",
    },
    {
      icon: Smartphone,
      title: "Remote review from mobile",
      body: "Pair once with a QR code, then review and approve from anywhere. Watch progress, read diffs, and approve permissions from your phone.",
    },
  ];

  /** Straight from the app bible — the product's actual commitments. */
  const principles = [
    {
      icon: Radio,
      title: "Determinism over vibes",
      body: "Every run replays from saved state. If one cannot, that is a bug.",
    },
    {
      icon: FileCheck2,
      title: "The human reviews",
      body: "The agent proposes and executes. Nothing lands without your approval.",
    },
    {
      icon: ShieldCheck,
      title: "Never touch what is not yours",
      body: "CodeInOven keeps its state in its own config directory and writes nothing uninvited into your repository.",
    },
    {
      icon: SlidersHorizontal,
      title: "Bounded on purpose",
      body: "Threads, history chunks, and checkpoints are capped. Growth is a decision, not drift.",
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

<Seo
  title="CodeInOven: Where Real Software Gets Built"
  description="CodeInOven is an all-day desktop engineering workspace. Brainstorm, prototype, code, review GitHub PRs, run terminals, and test live web apps with AI agents. Bundled with Pi out of the box."
  canonical="/"
/>

<!-- ─── Hero ─────────────────────────────────────────────────────────────── -->
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-inner">
    <p class="eyebrow anim" style="--d:0ms">
      <span class="eyebrow-dot"></span>Open source · All-day workspace
    </p>

    <h1 id="hero-title" class="hero-title anim" style="--d:60ms">
      Where real software gets built.<br />
      <span class="hero-title-accent">Not just where AI gets prompted.</span>
    </h1>

    <p class="hero-lead anim" style="--d:120ms">
      CodeInOven is the desktop workspace where you spend the whole day building.
      Brainstorm, prototype, code, review GitHub PRs, run terminals, and test web apps
      live in the integrated browser—without leaving the window. Pre-tuned prompts keep
      agents aligned like senior engineers, with zero setup ritual and bundled Pi out of the box.
    </p>

    <div class="hero-actions anim" style="--d:180ms">
      <a class="button" href="/download">
        Download
        <span class="button-os" aria-hidden="true">
          <OsIcon os="macos" />
          <OsIcon os="windows" />
          <OsIcon os="linux" />
        </span>
        <span class="sr-only">for macOS, Windows, and Linux</span>
      </a>
      <a class="ghost-link" href="#workstation">
        Explore the workspace
        <ArrowUpRight aria-hidden="true" />
      </a>
    </div>

    <!-- Quick highlights -->
    <div class="hero-pills anim" style="--d:210ms">
      <span class="hero-pill"><Flame aria-hidden="true" /> Bundled with Pi (zero prerequisites)</span>
      <span class="hero-pill"><Boxes aria-hidden="true" /> Zero AGENTS.md ceremony</span>
      <span class="hero-pill"><Globe aria-hidden="true" /> Inner browser & attached terminal</span>
      <span class="hero-pill"><TerminalSquare aria-hidden="true" /> OpenAI & Anthropic endpoints</span>
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
        <li class="is-more" title="And more">+∞</li>
      </ul>
    </div>
  </div>

  <!-- Real capture of the running application. -->
  <figure class="hero-shot reveal">
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
      DeepSeek v4 flash operating a Mac using the CUA driver seamlessly inside the CodeInOven workspace.
    </figcaption>
  </figure>
</section>

<!-- ─── The All-Day Workstation ─────────────────────────────────────────── -->
<section
  id="workstation"
  class="section reveal"
  aria-labelledby="workstation-title"
>
  <div class="section-head">
    <p class="kicker">The All-Day Workbench</p>
    <h2 id="workstation-title">
      You barely need to leave CodeInOven.
    </h2>
    <p class="section-lead">
      When building in CodeInOven, you stop juggling 15 apps. You barely open an external browser
      to test, barely launch a separate terminal for scripts, barely switch to GitHub for PRs,
      and stop jumping to ChatGPT for research. Everything needed to take software from concept
      to production lives in one coherent workbench.
    </p>
  </div>

  <div class="cap-grid">
    {#each workstationCapabilities as capability (capability.title)}
      <article class="cap-cell reveal">
        <capability.icon aria-hidden="true" class="cap-icon" />
        <h3>{capability.title}</h3>
        <p>{capability.body}</p>
      </article>
    {/each}
  </div>

  <!-- Real screenshots of the Engineering Toolbox and Scopes Board -->
  <div class="workspace-duo reveal">
    <figure class="workspace-card">
      <img
        src="/shots/engineering-toolbox.png"
        alt="Engineering Toolbox — pick the stages to run: Brainstorm, PRD, Spec, Assignment, Achievement, Auto Pilot"
        width="1400"
        height="875"
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <strong>Engineering Toolbox:</strong> Move cleanly through Brainstorm, PRD, Spec, Assignment, Achievement, and Auto Pilot without context loss.
      </figcaption>
    </figure>

    <figure class="workspace-card">
      <img
        src="/shots/scopes-board.png"
        alt="Scopes board — organize threads into Pinned, Todo, Spec, and Done columns across project scopes"
        width="1400"
        height="875"
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <strong>Scopes Kanban:</strong> Organize threads across Pinned, Todo, Spec, and Done columns for each repository scope.
      </figcaption>
    </figure>
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

<!-- ─── Zero Ceremony & Prompt Rigor ────────────────────────────────────── -->
<section
  id="zero-ceremony"
  class="section reveal"
  aria-labelledby="ceremony-title"
>
  <div class="section-head">
    <p class="kicker">Zero Ceremony · No Prompt Fatigue</p>
    <h2 id="ceremony-title">
      Start immediately. No AGENTS.md or CLAUDE.md required.
    </h2>
    <p class="section-lead">
      Most AI tools demand hours of prompt tinkering, rigid instruction files, and constant prompt
      babysitting just to prevent circular drift and hallucinated file edits. CodeInOven bakes senior
      engineering discipline directly into the system prompts and harness execution.
    </p>
  </div>

  <div class="ceremony-grid">
    <article class="ceremony-cell">
      <Sparkles aria-hidden="true" class="ceremony-icon" />
      <span class="ceremony-badge">Engineered Scaffolding</span>
      <h3>Pre-tuned engineering prompts</h3>
      <p>
        Built-in system instructions teach models to act like real software engineers: verifying facts before answering, adhering to repository conventions, writing surgical diffs, and explaining architectural decisions.
      </p>
    </article>

    <article class="ceremony-cell">
      <Workflow aria-hidden="true" class="ceremony-icon" />
      <span class="ceremony-badge">Eliminate Fatigue</span>
      <h3>Zero circular prompt loops</h3>
      <p>
        Cuts exhausting back-and-forth prompt babysitting between human and LLMs to the barest minimum. Tasks run phase-by-phase with clear checkpoints, deterministic tests, and explicit approvals.
      </p>
    </article>

    <article class="ceremony-cell">
      <Boxes aria-hidden="true" class="ceremony-icon" />
      <span class="ceremony-badge">Instant Productivity</span>
      <h3>Drop in any project & go</h3>
      <p>
        No setup ritual or configuration tax. Add any repository to Projects and your agent is immediately productive from turn one—without spending an afternoon authoring custom prompt manuals.
      </p>
    </article>
  </div>
</section>

<!-- ─── Harness matrix — Batteries Included ─────────────────────────────── -->
<section
  id="harnesses"
  class="section reveal"
  aria-labelledby="harnesses-title"
>
  <div class="section-head">
    <p class="kicker">Batteries Included</p>
    <h2 id="harnesses-title">Bundled with Pi. Ready for every harness and model.</h2>
    <p class="section-lead">
      If you do not have an agent harness installed, CodeInOven comes bundled with Pi out of the box.
      Connect your favorite API key or local model and start coding immediately. If you already have
      harnesses installed, CodeInOven auto-detects and unifies them all.
    </p>
  </div>

  <div class="bundled-banner reveal">
    <div class="bundled-banner-left">
      <span class="bundled-pill">Bundled Default</span>
      <p>
        <strong>Comes bundled with Pi.</strong> No harness installed on your machine? CodeInOven ships with Pi built-in so you can start working immediately—just add your API key or model endpoint.
      </p>
    </div>
  </div>

  <ul class="harness-grid">
    {#each HARNESSES as harness (harness.id)}
      <li class="harness-cell">
        <a href={harness.website} target="_blank" rel="noopener noreferrer">
          <span class="harness-mark {harness.tile ? 'is-tile' : 'is-glyph'}">
            <img src="/harness/{harness.id}.svg" alt="" aria-hidden="true" />
          </span>
          <span class="harness-name">{harness.name}</span>
        </a>
      </li>
    {/each}
  </ul>

  <div class="backend-split">
    <div class="backend-block">
      <h3>Or your own backend</h3>
      <p>
        OpenAI- and Anthropic-compatible endpoints both work. Connect local models, dedicated cloud GPUs, or private VPCs with a base URL and model name.
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
              class={provider === "huggingface" ? "is-brand" : ""}
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
    <h2 id="lifecycle-title">Spec first. Code after approval.</h2>
    <p class="section-lead">
      Real engineering follows a predictable rhythm. Every job runs the same path:
      specify, review, approve, implement. Each step leaves a record you can read later.
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
      Reasoning, commands, timing, and results stay visible.
    </figcaption>
  </figure>
</section>

<!-- ─── Ethos ────────────────────────────────────────────────────────── -->
<section id="ethos" class="section reveal" aria-labelledby="ethos-title">
  <div class="ethos-banner">
    <div class="ethos-head">
      <p class="kicker">Community & Ethos</p>
      <h3 id="ethos-title">We build what people use. If it's missing, send a PR.</h3>
      <p>
        We don't add features just for marketing bullet points. We build what directly enhances developer productivity, eliminates fatigue, and gets real software shipped. If a harness, provider, or capability matters to your workflow, our ethos is simple: open an issue or bring a PR. So long as developers use it, it will be built in CodeInOven.
      </p>
    </div>

    <div class="ethos-grid">
      <div class="ethos-col">
        <h4><HeartHandshake aria-hidden="true" /> Built to End Fatigue</h4>
        <p>
          Every workflow is designed for long, focused engineering sessions. We strip out cognitive friction, prompt anxiety, and context-switching so you can stay in flow.
        </p>
      </div>
      <div class="ethos-col">
        <h4><GitFork aria-hidden="true" /> Community-Driven Evolution</h4>
        <p>
          All we need is a PR. Whether it's an emerging model format, a new CLI agent, or a custom toolchain, whatever developers rely on gets embraced.
        </p>
      </div>
      <div class="ethos-col">
        <h4><ShieldCheck aria-hidden="true" /> 100% Local & Sovereign</h4>
        <p>
          Your source code never routes through third-party proxy services. State lives in your local machine and your project's .cio scratchpad, completely reviewable.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- ─── Principles ───────────────────────────────────────────────────────── -->
<section
  id="principles"
  class="section section-narrow reveal"
  aria-labelledby="principles-title"
>
  <div class="section-head">
    <p class="kicker">Principles</p>
    <h2 id="principles-title">The rules it runs by</h2>
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
  <h2 id="closer-title">Your entire software day, under one roof.</h2>
  <p>
    Free for personal and non-commercial use. Every run stays reviewable, even
    after the chat is done.
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
