import adapter from '@sveltejs/adapter-bun';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			adapter: adapter({
				// Ship brotli and gzip variants of every client asset and prerendered
				// page. The server negotiates per request, so this is free at runtime.
				precompress: true
			})
		})
	]
});
