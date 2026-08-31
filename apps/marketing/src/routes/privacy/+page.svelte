<script lang="ts">
	import { COMPANY, LINKS, PRODUCT } from '$lib/config';
	import Seo from '$lib/components/seo.svelte';

	/**
	 * Deliberately short and factual. Every claim here describes behaviour that
	 * is verifiable in the public source repository — do not add commitments the
	 * code does not actually make.
	 */
	const updated = 'August 2026';
</script>

<Seo
	title="Privacy Policy | CodeInOven (Code In Oven)"
	description="How CodeInOven handles your data. Your code, prompts, credentials, and local models stay 100% on your machine."
	canonical="/privacy"
/>

<section class="prose-page">
	<h1>Privacy</h1>
	<p class="prose-meta">Last updated {updated}</p>

	<p class="prose-lead">
		{PRODUCT.name} is a desktop application. The short version: your code, your prompts and your
		credentials stay on your machine, and this website does not track you.
	</p>

	<h2>The application</h2>
	<p>
		{PRODUCT.name} stores its own state in its configuration directory on your computer. That
		state includes projects, threads, specifications, history, and checkpoints. It does not
		upload data anywhere.
	</p>
	<p>
		When you run an agent, {PRODUCT.name} invokes a coding harness that is already installed on your
		machine. That harness talks to whichever model provider you have configured, using credentials
		held in the harness's own configuration. {PRODUCT.name} does not proxy that traffic and never
		sees or stores your provider keys.
	</p>
	<p>
		If you point the app at a local server such as Ollama, LM Studio or llama.cpp, nothing leaves
		your machine at all.
	</p>

	<h2>This website</h2>
	<p>
		This site is a set of static pages. It sets no cookies, runs no analytics, and embeds no
		third-party trackers. Downloads are served by GitHub, whose own privacy policy applies once you
		follow a release link.
	</p>

	<h2>Verifying any of this</h2>
	<p>
		{PRODUCT.name} is
		<a href={LINKS.license} target="_blank" rel="noopener noreferrer">source-available</a>. If you would
		rather confirm the above than take our word for it, the
		<a href={LINKS.github} target="_blank" rel="noopener noreferrer">source is public</a>.
	</p>

	<h2>Contact</h2>
	<p>
		Questions about this policy go to <a href={LINKS.contact}>our inbox</a>. {PRODUCT.name} is a
		product of {COMPANY.name}.
	</p>
</section>
