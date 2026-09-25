import { loadRelease } from '$lib/config';
import type { LayoutServerLoad } from './$types';

/**
 * One read of the stable manifest for every page. The hero, the footer and the
 * download page all build their download affordance from it, so it lives on
 * the layout. `loadRelease` returns null when the mirror is unreachable, and
 * the UI falls back to the all-platform download rather than rendering nothing.
 */
export const load: LayoutServerLoad = async ({ fetch }) => ({
	release: await loadRelease(fetch)
});
