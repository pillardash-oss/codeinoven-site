<script lang="ts">
	/**
	 * The real product mark, served from `/brand/codeinoven-icon.svg` — the same
	 * asset the desktop app ships as its window and dock icon. It is deliberately
	 * an <img> rather than inlined markup: the logo is a brand asset, not a
	 * themeable icon, and must never be recolored or redrawn.
	 */
	interface Props {
		/** Rendered size in pixels. The mark is line art and reads down to ~20px. */
		size?: number;
		class?: string;
	}
	let { size = 28, class: className = '' }: Props = $props();
</script>

<img
	src="/brand/codeinoven-icon.svg"
	alt=""
	aria-hidden="true"
	width={size}
	height={size}
	class={className}
	style="width:{size}px;height:{size}px"
/>
