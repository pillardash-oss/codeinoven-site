<script lang="ts">
  import { COMPANY, LICENSE, LINKS, PRODUCT } from "$lib/config";
  import Seo from "$lib/components/seo.svelte";

  const updated = "September 2026";
</script>

<Seo
  title="Privacy Policy · CodeInOven"
  description="How CodeInOven stores application data, handles coding-agent requests, and collects data on its website."
  canonical="/privacy"
/>

<section class="inner-page policy-page" aria-labelledby="privacy-title">
  <div class="wrap">
    <div class="page-crumb">
      <a href="/">CodeInOven</a><span aria-hidden="true">/</span><span>Privacy</span>
    </div>

    <header class="page-heading policy-heading">
      <h1 id="privacy-title">Privacy policy</h1>
      <p class="page-lead">
        This policy describes what {PRODUCT.name} stores, where coding-agent
        requests go, and what data the website collects.
      </p>
      <p class="policy-updated">Last updated <time datetime="2026-09">{updated}</time></p>
    </header>

    <div class="policy-layout">
      <nav class="policy-index" aria-label="On this page">
        <p>On this page</p>
        <a href="#application">The application</a>
        <a href="#providers">Model providers</a>
        <a href="#local-models">Local models</a>
        <a href="#website">This website</a>
        <a href="#verify">Verify and contact</a>
      </nav>

      <article class="policy-copy">
        <section id="application" aria-labelledby="application-title">
          <p class="policy-kicker">01 / Local application data</p>
          <h2 id="application-title">The application</h2>
          <p>
            {PRODUCT.name} stores its application state in a configuration
            directory on your computer. This includes project records, threads,
            specifications, history, and checkpoints. {PRODUCT.name} does not
            send this stored application state to its servers.
          </p>
        </section>

        <section id="providers" aria-labelledby="providers-title">
          <p class="policy-kicker">02 / Requests to a model</p>
          <h2 id="providers-title">Your coding agent talks to its provider</h2>
          <p>
            When you run an agent, {PRODUCT.name} starts the coding agent
            installed on your computer. That agent may send prompts, code, and
            other context to the provider configured for it. The provider
            handles those requests under its own terms and privacy policy.
            {PRODUCT.name} does not proxy the requests or handle your provider
            credentials.
          </p>
          <div class="request-path" aria-label="Model request path">
            <span>Your project</span><span aria-hidden="true">›</span>
            <span>Installed coding agent</span><span aria-hidden="true">›</span>
            <span>Provider you chose</span>
          </div>
        </section>

        <section id="local-models" aria-labelledby="local-title">
          <p class="policy-kicker">03 / Local model server</p>
          <h2 id="local-title">When you use a local model</h2>
          <p>
            If you configure an agent to use a local model server, such as
            Ollama, LM Studio, or llama.cpp, requests to that server remain on
            your machine.
          </p>
        </section>

        <section id="website" aria-labelledby="website-title">
          <p class="policy-kicker">04 / Website and downloads</p>
          <h2 id="website-title">This website</h2>
          <p>
            The website serves static pages. It does not set cookies or use
            analytics or third-party tracking scripts.
          </p>
          <p>
            Downloads come from the {PRODUCT.name} release mirror. GitHub
            releases are available as a fallback. If you follow that link,
            GitHub's privacy policy applies to your visit there.
          </p>
          <a class="policy-download-link" href="/download">
            See download options <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section id="verify" aria-labelledby="verify-title">
          <p class="policy-kicker">05 / Check the source</p>
          <h2 id="verify-title">Verify and contact</h2>
          <p>
            {PRODUCT.name} is open source under the
            <a href={LINKS.license} target="_blank" rel="noopener noreferrer">{LICENSE} license</a>.
            The <a href={LINKS.github} target="_blank" rel="noopener noreferrer">source is public</a>
            if you want to check how it works.
          </p>
          <p>
            Questions about this policy? <a href={LINKS.contact}>Write to {COMPANY.shortName}</a>.
            {PRODUCT.name} is a product of {COMPANY.name}.
          </p>
        </section>
      </article>
    </div>
  </div>
</section>
