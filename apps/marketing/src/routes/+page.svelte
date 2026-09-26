<script lang="ts">
  import { onMount } from "svelte";
  import Seo from "$lib/components/seo.svelte";
  import { HARNESSES, HOSTED_PROVIDERS, LOCAL_BACKENDS } from "$lib/data/harnesses";
  import {
    LINKS,
    PLATFORMS,
    RELEASE_PRIMARY_KIND,
    RELEASE_SECONDARY_KIND,
    downloadCommand,
    selectArtifact,
    type OsPlatform,
  } from "$lib/config";
  import { Check, Copy, ArrowUpRight } from "@lucide/svelte";

  let { data }: import("./$types").PageProps = $props();
  const release = $derived(data.release ?? null);
  const providers = [...new Set([
    ...HOSTED_PROVIDERS,
    ...LOCAL_BACKENDS.flatMap((backend) => backend.id ? [backend.id] : []),
  ])];
  const JOURNEY_STEPS = [
    {
      id: "brainstorm",
      tab: "Brainstorm",
      src: "/journey/brainstorm.png",
      alt: "A CodeInOven brainstorm document organizing discoveries, decisions, and open questions for a product idea.",
      title: "Turn a rough idea into a plan.",
      description: "Think through the problem, record decisions, and give the work a clear direction before implementation.",
    },
    {
      id: "design",
      tab: "Design",
      src: "/journey/design.png",
      alt: "A website design open in CodeInOven's in-app browser, ready for visual review and feedback.",
      title: "See the product before you build it.",
      description: "Preview the interface, leave feedback on what needs to change, and settle the direction together.",
    },
    {
      id: "implement",
      tab: "Implement",
      src: "/journey/implement.png",
      alt: "A CodeInOven engineering thread beside a live website design preview while the implementation is in progress.",
      title: "Carry the design into the code.",
      description: "Give your agent the project context and chosen design, then follow the changes in your real workspace.",
    },
    {
      id: "launch",
      tab: "Launch",
      src: "/journey/launch.png",
      alt: "A product launch video playing in CodeInOven's in-app preview.",
      title: "Make the launch part of the work.",
      description: "Create a product video, preview the cut, and prepare it to introduce what you made.",
    },
    {
      id: "monitor",
      tab: "Monitor",
      src: "/journey/monitor.png",
      alt: "The CodeInOven assistant reviewing Search Console findings and social engagement in a scheduled routine.",
      title: "Keep learning after release.",
      description: "Track Search Console and connected social engagement. Ask your assistant for improvements, then draft or publish posts through connected tools.",
    },
  ] as const;
  type JourneyStepId = (typeof JOURNEY_STEPS)[number]["id"];

  let selectedPlatform = $state<OsPlatform>("macos");
  let selectedJourneyStep = $state<JourneyStepId>("brainstorm");
  let copied = $state(false);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const selectedArtifact = $derived(
    selectArtifact(release, selectedPlatform, RELEASE_PRIMARY_KIND[selectedPlatform]),
  );
  const secondaryKind = $derived(RELEASE_SECONDARY_KIND[selectedPlatform]);
  const secondaryArtifact = $derived(
    secondaryKind ? selectArtifact(release, selectedPlatform, secondaryKind) : null,
  );
  const selectedCommand = $derived(
    selectedArtifact ? downloadCommand(selectedArtifact) : null,
  );
  const selectedJourney = $derived(
    JOURNEY_STEPS.find((step) => step.id === selectedJourneyStep) ?? JOURNEY_STEPS[0],
  );

  function selectPlatformWithKeyboard(event: KeyboardEvent, current: OsPlatform) {
    const index = PLATFORMS.findIndex((platform) => platform.id === current);
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % PLATFORMS.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + PLATFORMS.length) % PLATFORMS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = PLATFORMS.length - 1;
    else return;

    event.preventDefault();
    const next = PLATFORMS[nextIndex];
    selectedPlatform = next.id;
    document.getElementById(`platform-${next.id}`)?.focus();
  }

  function selectJourneyWithKeyboard(event: KeyboardEvent, current: JourneyStepId) {
    const index = JOURNEY_STEPS.findIndex((step) => step.id === current);
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % JOURNEY_STEPS.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + JOURNEY_STEPS.length) % JOURNEY_STEPS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = JOURNEY_STEPS.length - 1;
    else return;

    event.preventDefault();
    const next = JOURNEY_STEPS[nextIndex];
    selectedJourneyStep = next.id;
    document.getElementById(`journey-tab-${next.id}`)?.focus();
  }

  async function copyCommand() {
    if (!selectedCommand) return;
    try {
      await navigator.clipboard.writeText(selectedCommand);
      copied = true;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => (copied = false), 1600);
    } catch {
      // The command remains selectable if clipboard access is unavailable.
    }
  }

  onMount(() => {
    const heroVideo = document.querySelector<HTMLVideoElement>("[data-hero-video]");
    if (heroVideo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void heroVideo.play().catch(() => {});
    }

    const elements = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  });
</script>

<Seo
  title="CodeInOven: Build Real Products With AI"
  description="CodeInOven is a free, open-source workspace for building real software with AI. Plan, build, test, review, and ship with the coding agents you already trust."
  canonical="/"
/>

      <!-- ─── Hero ──────────────────────────────────────────────────────── -->
      <section class="hero">
        <div class="hero-glow" aria-hidden="true"></div>
        <div class="wrap hero-inner">
          <h1 class="hero-title">
            Turn your agent<br />
            into an <span class="hl">engineer</span>.
          </h1>

          <p class="hero-sub">
            Every plan, tool call, diff, and commit lands in your real project.
            Agents that read the codebase, run the tests, and ship the change
            while you stay in charge.
          </p>

          <div class="hero-actions">
            <a class="btn btn-primary" href="/download">
              Download for macOS, Windows, and Linux
            </a>
            <a class="btn btn-ghost" href={LINKS.github} target="_blank" rel="noopener noreferrer">
              View on GitHub
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>

          <p class="hero-note">Free and open source under the MIT license.</p>
        </div>

        <div class="wrap hero-media" data-reveal>
          <figure class="screen screen-hero">
            <div class="screen-bar" aria-hidden="true">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <span class="screen-title">codeinoven / workspace</span>
            </div>
            <video
              poster="/shots/workspace.png"
              data-hero-video
              aria-label="The CodeInOven workspace: project rail on the left, an agent run in the middle showing reasoning traces and tool calls, and a context panel on the right."
              muted
              loop
              playsinline
              preload="metadata"
            >
              <source src="/shots/workspace-hero.mp4" type="video/mp4" />
            </video>
          </figure>
        </div>
      </section>

      <!-- ─── Agents strip ──────────────────────────────────────────────── -->
      <section class="agents-band" id="agents" aria-labelledby="agents-title">
        <div class="wrap">
          <p class="band-line" id="agents-title">Bring the coding agents you already run.</p>
        </div>
        <div class="marquee" data-marquee>
          <ul class="marquee-track">
            <li class="agent-chip"><img src="/harness/pi.svg" alt="" /><span>Pi</span></li>
            <li class="agent-chip"><img src="/harness/codex.svg" alt="" /><span>Codex CLI</span></li>
            <li class="agent-chip is-glyph"><img src="/harness/claude-code.svg" alt="" /><span>Claude Code</span></li>
            <li class="agent-chip"><img src="/harness/opencode.svg" alt="" /><span>OpenCode</span></li>
            <li class="agent-chip is-glyph"><img src="/harness/cline.svg" alt="" /><span>Cline</span></li>
            <li class="agent-chip"><img src="/harness/antigravity.svg" alt="" /><span>Antigravity</span></li>
            <li class="agent-chip"><img src="/harness/muse-code.svg" alt="" /><span>Muse Code</span></li>
          </ul>
        </div>
        <div class="wrap agents-foot">
          <p>
            Point them at any model. Hosted keys or a local server, your choice.
            Keys stay on your machine, and CodeInOven never routes your code or
            prompts through its own proxy.
          </p>
          <ul class="provider-wall" aria-label="Supported model providers">
            <li><img src="/providers/openai.svg" alt="OpenAI" /></li>
            <li><img src="/providers/anthropic.svg" alt="Anthropic" /></li>
            <li><img src="/providers/google.svg" alt="Google" /></li>
            <li><img src="/providers/xai.svg" alt="xAI" /></li>
            <li><img src="/providers/deepseek.svg" alt="DeepSeek" /></li>
            <li><img src="/providers/qwen.svg" alt="Qwen" /></li>
            <li><img src="/providers/mistral.svg" alt="Mistral" /></li>
            <li><img src="/providers/groq.svg" alt="Groq" /></li>
            <li><img src="/providers/openrouter.svg" alt="OpenRouter" /></li>
            <li><img class="is-brand" src="/providers/huggingface.svg" alt="Hugging Face" /></li>
            <li><img src="/providers/ollama.svg" alt="Ollama" /></li>
            <li><img src="/providers/lmstudio.svg" alt="LM Studio" /></li>
          </ul>
        </div>
      </section>

      <!-- ─── Statement one ─────────────────────────────────────────────── -->
      <section class="statement" aria-labelledby="stmt1">
        <div class="wrap statement-inner" data-reveal>
          <div class="statement-main">
            <p class="statement-label">From idea to launch, in one workspace.</p>
            <h2 id="stmt1" class="statement-title">
              Make the product. Then help it grow.
            </h2>
          </div>
          <div class="statement-detail">
            <p class="statement-lead">
              Design the experience before you build it, carry the approved
              direction into implementation, create a launch video, and keep
              learning from the people who find your product.
            </p>
            <div class="statement-actions">
              <a class="btn btn-primary" href="/download">Download</a>
              <a class="btn btn-ghost" href={LINKS.github} target="_blank" rel="noopener noreferrer">View the source</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Feature: board + workspace ────────────────────────────────── -->
      <section class="feature" id="workspace" aria-labelledby="feat1">
        <div class="wrap feature-head" data-reveal>
          <h2 id="feat1" class="section-title">
            See the work as it moves.
          </h2>
          <p class="section-lead">
            Track projects across Pinned, Todo, Unread, and Done. Open a thread
            to inspect the agent's reasoning, commands, diffs, and checkpoints.
          </p>
        </div>

        <div class="wrap board-grid" data-reveal>
          <figure class="screen board-a">
            <div class="screen-bar" aria-hidden="true">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <span class="screen-title">scopes board</span>
            </div>
            <img src="/shots/scopes-board.png" alt="The Scopes board showing Pinned, Todo, Unread, and Done columns across project boards." loading="lazy" decoding="async" />
            <figcaption>
              Each project has a board for work that needs attention.
            </figcaption>
          </figure>

          <figure class="screen board-b">
            <div class="screen-bar" aria-hidden="true">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <span class="screen-title">engineering toolbox</span>
            </div>
            <img src="/shots/engineering-toolbox.png" alt="The Engineering Toolbox with stages for Brainstorm, PRD, Spec, Assignment, Achievement, and Auto Pilot." loading="lazy" decoding="async" />
            <figcaption>
              Choose a workflow stage for planning, implementation, and review.
            </figcaption>
          </figure>
        </div>
      </section>

      <!-- ─── Feature: idea to merged ───────────────────────────────────── -->
      <section class="feature" id="how" aria-labelledby="feat2">
        <div class="wrap feature-head" data-reveal>
          <h2 id="feat2" class="section-title">
            Start with the design. Finish with a change you can review.
          </h2>
          <p class="section-lead">
            Explore the experience before implementation. Carry the approved
            direction into your codebase, then follow the agent's work through
            tests, diffs, and checkpoints.
          </p>
        </div>

        <div class="wrap shot-stack" data-reveal>
          <figure class="screen shot-wide">
            <div class="screen-bar" aria-hidden="true">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <span class="screen-title">run trace</span>
            </div>
            <img src="/shots/trace.png" alt="A CodeInOven run in progress showing reasoning steps, shell commands, and file reads with status." loading="lazy" decoding="async" />
          </figure>
          <figure class="screen shot-narrow">
            <div class="screen-bar" aria-hidden="true">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <span class="screen-title">composer</span>
            </div>
            <img src="/shots/composer.png" alt="The CodeInOven composer showing permission scope, model selector, and run controls." loading="lazy" decoding="async" />
          </figure>
          <figure class="screen shot-narrow">
            <div class="screen-bar" aria-hidden="true">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <span class="screen-title">terminal</span>
            </div>
            <img src="/shots/terminal.png" alt="An attached terminal running a build inside the CodeInOven workspace." loading="lazy" decoding="async" />
          </figure>
        </div>
      </section>

      <!-- ─── Idea to growth ────────────────────────────────────────────── -->
      <section class="journey" id="journey" aria-labelledby="journey-title">
        <div class="wrap journey-inner" data-reveal>
          <div class="journey-intro">
            <p class="journey-eyebrow">One loop, from idea to audience</p>
            <h2 id="journey-title">Keep the whole product moving.</h2>
            <p class="journey-lead">
              Design, implementation, launch, and what comes after. Work through
              the full product cycle without scattering the context across tools.
            </p>
          </div>

          <div class="journey-showcase">
            <div class="journey-tabs" role="tablist" aria-label="Product journey">
              {#each JOURNEY_STEPS as step, index (step.id)}
                <button
                  id="journey-tab-{step.id}"
                  type="button"
                  role="tab"
                  aria-selected={selectedJourneyStep === step.id}
                  aria-controls="journey-panel"
                  tabindex={selectedJourneyStep === step.id ? 0 : -1}
                  onclick={() => (selectedJourneyStep = step.id)}
                  onkeydown={(event) => selectJourneyWithKeyboard(event, step.id)}
                >
                  <span class="journey-tab-num" aria-hidden="true">0{index + 1}</span>
                  <span>{step.tab}</span>
                </button>
              {/each}
            </div>

            <div
              class="journey-panel"
              id="journey-panel"
              role="tabpanel"
              aria-labelledby="journey-tab-{selectedJourney.id}"
              tabindex="0"
            >
              <figure class="screen journey-visual">
                <div class="screen-bar" aria-hidden="true">
                  <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                  <span class="screen-title">{selectedJourney.tab} in CodeInOven</span>
                </div>
                <img
                  src={selectedJourney.src}
                  alt={selectedJourney.alt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <h3>{selectedJourney.title}</h3>
                  <p>{selectedJourney.description}</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Principles ────────────────────────────────────────────────── -->
      <section class="principles" aria-labelledby="principles-title">
        <div class="wrap">
          <div class="feature-head" data-reveal>
            <h2 id="principles-title" class="section-title">
              Long work, given a clear shape.
            </h2>
            <p class="section-lead">
              Agents are useful when you can see what they did and decide what
              happens next. That is the whole design.
            </p>
          </div>

          <ul class="principle-grid" data-reveal>
            <li class="principle">
              <span class="principle-num">01</span>
              <h3>Read before writing</h3>
              <p>
                Agents inspect the repository, follow its patterns, keep changes
                focused, and check their own work.
              </p>
            </li>
            <li class="principle">
              <span class="principle-num">02</span>
              <h3>Permission you set</h3>
              <p>
                Tool calls ask within the tier you choose. Auto Review by
                default, full access only if you switch it on yourself.
              </p>
            </li>
            <li class="principle">
              <span class="principle-num">03</span>
              <h3>Every step on record</h3>
              <p>
                Reasoning, commands, diffs, and checkpoints stay visible, and
                any phase can be rolled back.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <!-- ─── Stats ─────────────────────────────────────────────────────── -->
      <section class="stats" aria-label="CodeInOven at a glance">
        <div class="wrap">
          <ul class="stat-row" data-reveal>
            <li class="stat">
              <span class="stat-value">7</span>
              <span class="stat-label">coding agents, one workspace</span>
            </li>
            <li class="stat">
              <span class="stat-value">12</span>
              <span class="stat-label">model providers shown here</span>
            </li>
            <li class="stat">
              <span class="stat-value">Direct</span>
              <span class="stat-label">requests go to your chosen provider</span>
            </li>
            <li class="stat">
              <span class="stat-value">MIT</span>
              <span class="stat-label">free, open source license</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- ─── Desktop ───────────────────────────────────────────────────── -->
      <section class="desktop" id="download" aria-labelledby="desktop-title">
        <div class="wrap desktop-inner" data-reveal>
          <div class="desktop-copy">
            <h2 id="desktop-title" class="section-title">CodeInOven for your desktop.</h2>
            <p class="section-lead">
              The full workspace on macOS, Windows, and Linux. Point it at your
              project and your agent gets everything it needs: an attached
              terminal, an inner browser, diffs, pull requests, and worktrees.
            </p>
            <div class="download-block">
              <div class="dl-tabs" role="tablist" aria-label="Choose your platform">
                {#each PLATFORMS as platform (platform.id)}
                  <button
                    id="platform-{platform.id}"
                    type="button"
                    role="tab"
                    aria-selected={selectedPlatform === platform.id}
                    aria-controls="platform-download-panel"
                    tabindex={selectedPlatform === platform.id ? 0 : -1}
                    onclick={() => {
                      selectedPlatform = platform.id;
                      copied = false;
                    }}
                    onkeydown={(event) => selectPlatformWithKeyboard(event, platform.id)}
                  >
                    {platform.name}
                  </button>
                {/each}
              </div>
              <div
                class="cmd"
                id="platform-download-panel"
                role="tabpanel"
                aria-labelledby="platform-{selectedPlatform}"
              >
                <code>{selectedCommand ?? "Open the download page for available builds"}</code>
                <button
                  class="cmd-copy"
                  type="button"
                  aria-label={copied ? "Download command copied" : "Copy download command"}
                  title="Copy download command"
                  disabled={!selectedCommand}
                  onclick={copyCommand}
                >
                  {#if copied}
                    <Check aria-hidden="true" />
                  {:else}
                    <Copy aria-hidden="true" />
                  {/if}
                </button>
              </div>
              {#if selectedPlatform === "linux" && secondaryArtifact}
                <p class="dl-alt">
                  Prefer Debian or Ubuntu?
                  <a href={secondaryArtifact.url}>Download the .deb package</a>
                </p>
              {:else if !selectedCommand}
                <p class="dl-alt">
                  Build links are unavailable right now. <a href="/download">See all downloads</a>.
                </p>
              {/if}
            </div>
          </div>

          <figure class="screen screen-desktop" data-reveal>
            <div class="screen-bar" aria-hidden="true">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <span class="screen-title">workspace</span>
            </div>
            <img src="/shots/workspace.png" alt="The CodeInOven workspace with a project list, agent run, and code editor." loading="lazy" decoding="async" />
          </figure>
        </div>
      </section>

      <!-- ─── FAQ ───────────────────────────────────────────────────────── -->
      <section class="faq" id="faq" aria-labelledby="faq-title">
        <div class="wrap">
          <h2 id="faq-title" class="section-title" data-reveal>Frequently asked questions</h2>

          <div class="faq-list" data-reveal>
            <details class="faq-item">
              <summary>What is CodeInOven?</summary>
              <div class="faq-body">
                <p>
                  CodeInOven is an open-source workspace for building real
                  software with AI. You bring a coding agent, open a project,
                  and work on the same change together: plan it, write it, run
                  it, review the diff, and commit what you keep.
                </p>
              </div>
            </details>

            <details class="faq-item">
              <summary>Which coding agents work with CodeInOven?</summary>
              <div class="faq-body">
                <p>
                  Pi, Codex CLI, Claude Code, OpenCode, Cline, Antigravity, and
                  Muse Code. CodeInOven detects the ones installed on your
                  machine and you pick between them per thread. You are never
                  locked to one.
                </p>
              </div>
            </details>

            <details class="faq-item">
              <summary>Can I use my own models?</summary>
              <div class="faq-body">
                <p>
                  Yes. Sign in through a hosted provider or bring your own API
                  key. CodeInOven also speaks OpenAI-compatible and
                  Anthropic-compatible endpoints, so Ollama, LM Studio, vLLM, or
                  a private cloud server all work with a base URL and a model
                  name.
                </p>
              </div>
            </details>

            <details class="faq-item">
              <summary>Where does my code go?</summary>
              <div class="faq-body">
                <p>
                  Nowhere you did not send it. Your code never routes through a
                  CodeInOven proxy, keys stay on your machine, and the app keeps
                  its own state in its own config directory rather than writing
                  into your repository.
                </p>
              </div>
            </details>

            <details class="faq-item">
              <summary>What does it cost?</summary>
              <div class="faq-body">
                <p>
                  CodeInOven is free and open source under the MIT license. You
                  pay only for the models you choose to use, directly to the
                  provider you choose.
                </p>
              </div>
            </details>

            <details class="faq-item">
              <summary>What platforms does it run on?</summary>
              <div class="faq-body">
                <p>
                  macOS, Windows, and Linux. Builds for all three are published
                  to the stable release mirror, and the download above picks the
                  right one for your machine.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <!-- ─── Closer ────────────────────────────────────────────────────── -->
      <section class="closer" aria-labelledby="closer-title">
        <div class="wrap closer-inner" data-reveal>
          <h2 id="closer-title" class="closer-title">
            What will you build when<br />
            setup stops getting in the way?
          </h2>
          <p class="closer-sub">CodeInOven is free and open source under the MIT license.</p>
          <div class="closer-actions">
            <a class="btn btn-primary" href="/download">Download CodeInOven</a>
            <a class="btn btn-ghost" href={LINKS.github} target="_blank" rel="noopener noreferrer">
              Read the source
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>


        </div>
      </section>
