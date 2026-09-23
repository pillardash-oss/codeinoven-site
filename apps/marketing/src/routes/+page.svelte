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
      title: "Build and test in one place",
      body: "Run your app, inspect the DOM, and let agents test real browser flows without leaving the workspace.",
    },
    {
      icon: Terminal,
      title: "Attached terminal",
      body: "A real shell in your project root. Run builds, migrations, and scripts next to your agent.",
    },
    {
      icon: GitPullRequest,
      title: "Review pull requests",
      body: "Inspect diffs, resolve conflicts, and commit the right files without moving the work to another tool.",
    },
    {
      icon: Sparkles,
      title: "Think before you commit",
      body: "Turn a rough idea into a PRD, test a prototype, and settle the architecture before changing production code.",
    },
    {
      icon: Gauge,
      title: "Know what the work costs",
      body: "See token use, latency, and cost for each step. Save repeated commands as actions you can run again.",
    },
    {
      icon: Kanban,
      title: "Many projects, one workspace",
      body: "Move between repositories, keep long-running work organized, and isolate parallel changes in worktrees.",
    },
    {
      icon: Replace,
      title: "Use the agents you trust",
      body: "Work across Claude Code, OpenCode, Codex, Cline, Pi, and more. Change agents without changing how you work.",
    },
    {
      icon: ScanEye,
      title: "Vision and computer use",
      body: "Give any supported model screenshots and mockups. Let agents use the desktop to check the result themselves.",
    },
    {
      icon: Smartphone,
      title: "Keep an eye on long runs",
      body: "Check diffs, follow progress, and approve tool permissions from your phone while work continues.",
    },
  ];

  /** Straight from the app bible — the product's actual commitments. */
  const principles = [
    {
      icon: Radio,
      title: "Work you can inspect",
      body: "Runs, tool calls, diffs, and checkpoints stay visible. You can see what changed and why.",
    },
    {
      icon: FileCheck2,
      title: "You stay in charge",
      body: "Set the permission level, review the plan, and decide what lands in your project.",
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
  title="CodeInOven: Build real products with AI"
  description="A free, open-source workspace for building real software with AI. Start without setup friction, then take on PR reviews, automations, deployments, worktrees, and long-running engineering work."
  canonical="/"
/>

<!-- ─── Hero ─────────────────────────────────────────────────────────────── -->
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-inner">
    <p class="eyebrow anim" style="--d:0ms">
      <span class="eyebrow-dot"></span>Free and open source · macOS, Windows, Linux
    </p>

    <h1 id="hero-title" class="hero-title anim" style="--d:60ms">
      Build real products with AI.
    </h1>

    <p class="hero-lead anim" style="--d:120ms">
      Open a project and start. The agents, terminal, browser, reviews, and
      deployment tools you need are already in one workspace, with no setup
      ritual between you and the work.
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
    </div>

    <!-- The heat element from the product mark, made live. -->
    <div class="heat-bar anim" style="--d:210ms" aria-hidden="true">
      <span class="heat-core"></span>
    </div>

    <!-- The harnesses, in their own colors, right where the claim is made. -->
    <div class="hero-harnesses anim" style="--d:260ms">
      <p>Bring the coding agents and models you already use</p>
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

  <!-- Real capture of the running application. -->
  <figure class="hero-shot reveal">
    <video
      src="/shots/workspace-hero.mp4"
      poster="/shots/workspace.png"
      aria-label="The CodeInOven workspace: project rail on the left, agent run in the
			middle showing reasoning traces and tool calls with status, and a context panel on the right."
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      width="1920"
      height="1254"
    ></video>
  </figure>
</section>

<!-- ─── The All-Day Workstation ─────────────────────────────────────────── -->
<section
  id="workstation"
  class="section reveal"
  aria-labelledby="workstation-title"
>
  <div class="section-head">
    <h2 id="workstation-title">Everything you need to do the work.</h2>
    <p class="section-lead">
      Start with an idea. Prototype it, write the code, test the real app,
      review the pull request, and watch the deployment. CodeInOven keeps the
      whole job together.
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
        alt="Engineering Toolbox stages: Brainstorm, PRD, Spec, Assignment, Achievement, and Auto Pilot"
        width="1400"
        height="875"
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <strong>Engineering toolbox:</strong> Pick the phase you need, from initial
        brainstorm and PRD to spec creation and implementation.
      </figcaption>
    </figure>

    <figure class="workspace-card">
      <img
        src="/shots/scopes-board.png"
        alt="Scopes board organizing threads into Pinned, Todo, Spec, and Done columns across project scopes"
        width="1400"
        height="875"
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <strong>Scopes board:</strong> Track work across Pinned, Todo, Spec, and
        Done columns for each project repository.
      </figcaption>
    </figure>
  </div>

  <figure class="composer-shot reveal">
    <img
      src="/shots/composer.png"
      alt="The CodeInOven composer, showing permission scope, model selector, and run controls."
      width="1400"
      height="263"
      loading="lazy"
      decoding="async"
    />
    <figcaption>
      Permission controls sit right in the composer, so you verify access before
      sending a prompt.
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
    <p class="kicker">Start here</p>
    <h2 id="ceremony-title">Open your project. Start building.</h2>
    <p class="section-lead">
      You do not need to assemble a toolchain or write instruction files before
      useful work can begin. CodeInOven gives agents the structure they need and
      gives you control over what they can do.
    </p>
  </div>

  <div class="ceremony-grid">
    <article class="ceremony-cell">
      <Sparkles aria-hidden="true" class="ceremony-icon" />
      <span class="ceremony-badge">Project aware</span>
      <h3>It reads before it writes</h3>
      <p>
        Agents inspect your repository, follow its patterns, keep changes
        focused, and check their work.
      </p>
    </article>

    <article class="ceremony-cell">
      <Workflow aria-hidden="true" class="ceremony-icon" />
      <span class="ceremony-badge">Checkpoints</span>
      <h3>Long work has a shape</h3>
      <p>
        Complex tasks move through clear phases with checkpoints, diffs, and
        approvals. You can step away without losing the thread.
      </p>
    </article>

    <article class="ceremony-cell">
      <Boxes aria-hidden="true" class="ceremony-icon" />
      <span class="ceremony-badge">Instant start</span>
      <h3>Setup is not the product</h3>
      <p>
        Open a folder and get to the part that matters. Add your own tools and
        preferences when you need them.
      </p>
    </article>
  </div>
</section>

<!-- ─── Harness and model support ───────────────────────────────────────── -->
<section
  id="harnesses"
  class="section reveal"
  aria-labelledby="harnesses-title"
>
  <div class="section-head">
    <p class="kicker">Your tools</p>
    <h2 id="harnesses-title">Use the models and coding agents you trust.</h2>
    <p class="section-lead">
      Keep the tools that already work for you. CodeInOven runs installed coding
      agents, connects to hosted providers, and works with local models.
    </p>
  </div>

  <div class="bundled-banner reveal">
    <div class="bundled-banner-left">
      <span class="bundled-pill">Your choice</span>
      <p>
        <strong>One workspace, different agents.</strong> Move work across
        harnesses and models without rebuilding your process around each one.
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
      <h3>Local models and private clouds</h3>
      <p>
        Supports OpenAI-compatible and Anthropic-compatible endpoints. Connect
        Ollama, LM Studio, vLLM, or dedicated private cloud servers with a base
        URL and model name.
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
      <h3>Hosted provider keys</h3>
      <p>
        Sign in through the provider or bring your own API key. Keys stay on
        your machine. CodeInOven does not route your code or prompts through its
        own proxy.
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
    <h2 id="lifecycle-title">Give complex work a clear path.</h2>
    <p class="section-lead">
      Describe the outcome, review the plan, set the permissions, and let the
      agent work. Every step leaves a record you can inspect.
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
      alt="A CodeInOven run in progress showing reasoning traces, shell commands, and file reads with status"
      width="1400"
      height="960"
      loading="lazy"
      decoding="async"
    />
    <figcaption>
      Reasoning steps, shell commands, execution time, and output stay visible
      on screen.
    </figcaption>
  </figure>
</section>

<!-- ─── Ethos ────────────────────────────────────────────────────────── -->
<section id="ethos" class="section reveal" aria-labelledby="ethos-title">
  <div class="ethos-banner">
    <div class="ethos-head">
      <p class="kicker">Our approach</p>
      <h3 id="ethos-title">
        Free to use. Open to change.
      </h3>
      <p>
        CodeInOven is open source under the MIT license. Use it for your work,
        study how it works, or add the tool you wish it had. The application can
        grow with the people building real things in it.
      </p>
    </div>

    <div class="ethos-grid">
      <div class="ethos-col">
        <h4><HeartHandshake aria-hidden="true" /> Made for real work</h4>
        <p>
          Small prototypes and long-running engineering tasks belong in the
          same workspace.
        </p>
      </div>
      <div class="ethos-col">
        <h4><GitFork aria-hidden="true" /> Yours to extend</h4>
        <p>
          If a model, integration, or workflow is missing, the source is open
          and contributions are welcome.
        </p>
      </div>
      <div class="ethos-col">
        <h4><ShieldCheck aria-hidden="true" /> Local and private</h4>
        <p>
          Your code never routes through third-party proxies. State stays on
          your machine.
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
    <h2 id="principles-title">Serious tools earn trust.</h2>
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
  <h2 id="closer-title">
    What will you build when setup stops getting in the way?
  </h2>
  <p>CodeInOven is free and open source under the MIT license.</p>
  <div class="closer-actions">
    <a class="button" href="/download">
      <OsIcon os="macos" />
      <OsIcon os="windows" />
      <OsIcon os="linux" />
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
