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
      title: "Inner browser",
      body: "Test localhost, inspect DOM elements, and let agents test web flows directly in the window.",
    },
    {
      icon: Terminal,
      title: "Attached terminal",
      body: "A real shell in your project root. Run builds, migrations, and scripts next to your agent.",
    },
    {
      icon: GitPullRequest,
      title: "GitHub PR reviews",
      body: "Review PRs, inspect diffs, resolve conflicts, and commit staged files without switching to a browser.",
    },
    {
      icon: Sparkles,
      title: "Ideation & prototyping",
      body: "Draft PRDs, prototype quick spikes, and validate architectures before editing production code.",
    },
    {
      icon: Gauge,
      title: "Telemetry & cost tracking",
      body: "Track token burn, latency, and costs per step. Save repetitive build commands as reusable actions.",
    },
    {
      icon: Kanban,
      title: "Projects & scopes",
      body: "Switch between repositories instantly. Track work across Pinned, Todo, Spec, and Done.",
    },
    {
      icon: Replace,
      title: "Universal harness support",
      body: "Runs bundled Pi, or connects to Claude Code, OpenCode, Codex, Cline, Ollama, and LM Studio.",
    },
    {
      icon: ScanEye,
      title: "Vision & desktop driver",
      body: "Feed UI mockups and screenshots directly to models. Agents can drive the desktop UI to verify results.",
    },
    {
      icon: Smartphone,
      title: "Remote phone review",
      body: "Pair via QR code. Check diffs, follow progress, and approve tool permissions from your phone.",
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
  title="CodeInOven: Software Engineering Desktop Workspace"
  description="CodeInOven (Code in Oven) is a desktop workspace for developers. Brainstorm, code, run terminals, test in an inner browser, and review GitHub pull requests with AI agents."
  canonical="/"
/>

<!-- ─── Hero ─────────────────────────────────────────────────────────────── -->
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-inner">
    <p class="eyebrow anim" style="--d:0ms">
      <span class="eyebrow-dot"></span>Open source · Desktop workbench
    </p>

    <h1 id="hero-title" class="hero-title anim" style="--d:60ms">
      The desktop workspace where software gets built.
    </h1>

    <p class="hero-lead anim" style="--d:120ms">
      Brainstorm, code, run shell commands, test web apps in an inner browser, and review pull requests without leaving the window. Pi is bundled out of the box.
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
        See the workbench
        <ArrowUpRight aria-hidden="true" />
      </a>
    </div>

    <!-- The heat element from the product mark, made live. -->
    <div class="heat-bar anim" style="--d:210ms" aria-hidden="true">
      <span class="heat-core"></span>
    </div>

    <!-- The harnesses, in their own colors, right where the claim is made. -->
    <div class="hero-harnesses anim" style="--d:260ms">
      <p>Works with your installed CLI agents</p>
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
    <figcaption>
      DeepSeek v4 flash running inside CodeInOven to test and operate a local desktop app.
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
      Spend your workday in one window.
    </h2>
    <p class="section-lead">
      No more bouncing across terminal windows, browser tabs, GitHub PRs, and chat boxes.
      Everything you need to build software sits in one workstation.
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
        <strong>Engineering toolbox:</strong> Pick the phase you need, from initial brainstorm and PRD to spec creation and implementation.
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
        <strong>Scopes board:</strong> Track work across Pinned, Todo, Spec, and Done columns for each project repository.
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
      Permission controls sit right in the composer, so you verify access before sending a prompt.
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
    <p class="kicker">Zero Ceremony</p>
    <h2 id="ceremony-title">
      No AGENTS.md or CLAUDE.md required.
    </h2>
    <p class="section-lead">
      Built-in instructions guide models to inspect code, adhere to repository conventions, write focused diffs, and test before finishing.
    </p>
  </div>

  <div class="ceremony-grid">
    <article class="ceremony-cell">
      <Sparkles aria-hidden="true" class="ceremony-icon" />
      <span class="ceremony-badge">Built-in rules</span>
      <h3>Engineered discipline</h3>
      <p>
        Agents read files before editing, match existing style, keep diffs small, and test before finishing.
      </p>
    </article>

    <article class="ceremony-cell">
      <Workflow aria-hidden="true" class="ceremony-icon" />
      <span class="ceremony-badge">Checkpoints</span>
      <h3>No prompt loops</h3>
      <p>
        Work runs in phases with clear diffs and approvals. No endless prompt babysitting.
      </p>
    </article>

    <article class="ceremony-cell">
      <Boxes aria-hidden="true" class="ceremony-icon" />
      <span class="ceremony-badge">Instant start</span>
      <h3>Open and build</h3>
      <p>
        Open any project folder and start coding right away. Zero manual configuration.
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
    <p class="kicker">Harnesses & Models</p>
    <h2 id="harnesses-title">Bundled with Pi. Works with your existing tools.</h2>
    <p class="section-lead">
      CodeInOven comes bundled with Pi. Bring an API key or point to a local model.
      If you already have Claude Code, OpenCode, Codex, or Cline installed, CodeInOven runs them too.
    </p>
  </div>

  <div class="bundled-banner reveal">
    <div class="bundled-banner-left">
      <span class="bundled-pill">Bundled</span>
      <p>
        <strong>Pi is included.</strong> No CLI installs required. Add your model key or endpoint and start building.
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
        Supports OpenAI-compatible and Anthropic-compatible endpoints. Connect Ollama, LM Studio, vLLM, or dedicated private cloud servers with a base URL and model name.
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
        Sign in through the provider or bring your own API key. Keys stay in local configuration files on your machine. CodeInOven never proxies your code or prompts through external middleman servers.
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
      Solid engineering follows a reliable sequence: specify, review, approve, implement.
      Every step leaves a clear record you can inspect at any time.
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
      Reasoning steps, shell commands, execution time, and output stay visible on screen.
    </figcaption>
  </figure>
</section>

<!-- ─── Ethos ────────────────────────────────────────────────────────── -->
<section id="ethos" class="section reveal" aria-labelledby="ethos-title">
  <div class="ethos-banner">
    <div class="ethos-head">
      <p class="kicker">Our approach</p>
      <h3 id="ethos-title">We build what people use. If something is missing, send a PR.</h3>
      <p>
        No gimmicks or bloat. We build what developers actually need to ship code. If a harness, provider, or tool you use is missing, open an issue or bring a PR.
      </p>
    </div>

    <div class="ethos-grid">
      <div class="ethos-col">
        <h4><HeartHandshake aria-hidden="true" /> Built for all-day focus</h4>
        <p>
          Organized to keep you in flow without jumping between windows or losing context.
        </p>
      </div>
      <div class="ethos-col">
        <h4><GitFork aria-hidden="true" /> Driven by developer PRs</h4>
        <p>
          New harnesses and providers get added as the community needs them.
        </p>
      </div>
      <div class="ethos-col">
        <h4><ShieldCheck aria-hidden="true" /> Local and private</h4>
        <p>
          Your code never routes through third-party proxies. State stays on your machine.
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
  <h2 id="closer-title">Your entire software day, in one place.</h2>
  <p>
    Free for personal and non-commercial use. Every run stays reviewable even after you close the thread.
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
