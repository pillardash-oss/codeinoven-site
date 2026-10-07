import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_POSTHOG_TOKEN: {
		public: true,
		static: true,
		schema: (value) => value ?? '',
		description: 'Public ingestion token for US PostHog. Empty disables website analytics.'
	}
});
