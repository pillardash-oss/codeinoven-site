<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import GithubIcon from '@lucide/svelte/icons/folder-git-2';

	const submissionsUrl =
		import.meta.env.PUBLIC_SUBMISSIONS_URL ??
		'https://github.com/anomalyco/codeinoven-website/issues';

	const exampleSubmission = `{
  "name": "Claude Code",
  "slug": "claude-code",
  "vendor": "Anthropic",
  "websiteUrl": "https://code.claude.com",
  "githubUrl": "https://github.com/anthropics/claude-code"
}`;
</script>

<svelte:head>
	<title>Submit an agent — Favicons</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12">
	<div class="flex flex-col gap-3">
		<h1 class="text-3xl font-bold tracking-tight">Submit an agent</h1>
		<p class="text-muted-foreground">
			Missing an AI coding agent or agentic developer tool? New applications are added manually
			to keep the directory curated and reliable.
		</p>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>What we need</Card.Title>
			<Card.Description>
				Each entry needs an official website, a GitHub repository, or both.
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<pre
				class="overflow-x-auto rounded-lg border bg-muted/40 p-4 font-mono text-xs leading-relaxed">{exampleSubmission}</pre>
			<p class="text-sm text-muted-foreground">
				Once accepted, the daily crawler automatically finds and refreshes the icon from the
				official sources you provide.
			</p>
		</Card.Content>
		<Card.Footer>
			<Button href={submissionsUrl} target="_blank" rel="noopener noreferrer">
				<GithubIcon data-icon="inline-start" />
				Open a submission issue
			</Button>
		</Card.Footer>
	</Card.Root>

	<p class="text-sm text-muted-foreground">
		Only agents with identifiable official sources are accepted. Icons from random third-party
		logo websites are never used.
	</p>
</div>
