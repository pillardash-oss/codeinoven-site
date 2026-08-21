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

  /** Capabilities that are true of the shipped app, not aspirational. */
  const capabilities = [
    {
      icon: Replace,
      title: "One workflow, any harness",
      body: "OpenCode, Codex, Claude Code, Pi, Cline, Antigravity, Muse Code, and more. Switching harnesses keeps your current work.",
    },
    {
      icon: ScanEye,
      title: "Vision on any model",
      body: "Add the image helper when a task needs screenshots or mockups understood. You keep the text model you already use.",
    },
    {
      icon: MonitorPlay,
      title: "Computer use, out of the box",
      body: "Agents open your project UI and test what they build against real behavior, not just the files they wrote.",
    },
    {
      icon: GitPullRequest,
      title: "Git and pull requests stay visible",
      body: "Status, diffs, staging, commits, pushes, and pull requests live in the same view as the conversation.",
    },
    {
      icon: Cloud,
      title: "Cloud deployments at a glance",
      body: "Deployments on Coolify, Vercel, Railway, Dokploy, and Netlify, from code change to live update.",
    },
    {
      icon: Brain,
      title: "A memory the agents share",
      body: "Per-project notes and rules that every new run picks up.",
    },
    {
      icon: Smartphone,
      title: "Remote from your phone",
      body: "Pair once with a QR code, then review and approve from anywhere.",
    },
    {
      icon: Target,
      title: "Threads scoped to the job",
      body: "One goal per thread, tracked on a board: todo, working, done, issues.",
    },
    {
      icon: TerminalSquare,
      title: "A real terminal, attached",
      body: "It sits next to the conversation and points at the same project folder, so you and the agent see the same files.",
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

<!-- ─── Hero ─────────────────────────────────────────────────────────────── -->
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-inner">
    <p class="eyebrow anim" style="--d:0ms">
      <span class="eyebrow-dot"></span>Open source · {LICENSE} licensed
    </p>

    <h1 id="hero-title" class="hero-title anim" style="--d:60ms">
      One place to run your<br />
      <span class="hero-title-accent">AI coding agents.</span>
    </h1>

    <p class="hero-lead anim" style="--d:120ms">
      CodeInOven is a desktop app that runs OpenCode, Claude Code, Codex, and
      other agents in one window. Every change passes through a plan you
      review and approve before it reaches your code. Bring your own model
      access.
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
        <li class="is-more" title="And more">+∞</li>
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
      DeepSeek v4 flash 0731 operating a Mac using the CUA driver seamlessly.
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
    <h2 id="harnesses-title">Bring your own agent.</h2>
    <p class="section-lead">
      CodeInOven detects what is installed and drives every harness the same
      way. Switching engines does not mean starting over.
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
        </a>
      </li>
    {/each}
  </ul>

  <div class="backend-split">
    <div class="backend-block">
      <h3>Or your own backend</h3>
      <p>
        OpenAI- and Anthropic-compatible endpoints both work. These three are
        presets; everything else takes a base URL and a model name.
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
      Every job runs the same path: specify, review, approve, implement. Each
      step leaves a record you can read later.
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

<!-- ─── Capabilities ─────────────────────────────────────────────────────── -->
<section
  id="capabilities"
  class="section reveal"
  aria-labelledby="capabilities-title"
>
  <div class="section-head">
    <p class="kicker">The workstation</p>
    <h2 id="capabilities-title">
      Everything in one window
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
  <h2 id="closer-title">Runs on your desktop. Works with what you have.</h2>
  <p>
    MIT licensed and free to fork. Every run stays reviewable, even after the
    chat is done.
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
