import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * A PostHog *project* ingestion key, the only key type safe to compile into a
 * public bundle. A personal API key (`phx_...`) is a secret: the browser ships
 * it to everyone who loads the site. `phc_` keys are write-only and scoped to
 * ingestion, which is exactly what the browser sender needs.
 */
const INGESTION_TOKEN = /^phc_[\w-]+$/;

export const variables = defineEnvVars({
	PUBLIC_POSTHOG_TOKEN: {
		public: true,
		static: true,
		schema: (value) => {
			const token = value?.trim() ?? '';
			// Empty is a supported state: analytics off, consent control hidden.
			if (!token) return '';
			if (!INGESTION_TOKEN.test(token)) {
				throw new Error(
					'PUBLIC_POSTHOG_TOKEN must be a PostHog project key that starts with "phc_". ' +
						'A personal API key ("phx_") is a secret and must never reach the browser bundle. ' +
						'Copy Project settings -> Project API key from the US PostHog project.'
				);
			}
			return token;
		},
		description:
			'Public "phc_" project ingestion key for US PostHog. Empty disables website analytics.'
	}
});
