<script lang="ts">
	/**
	 * The real product mark, using `/brand/codeinoven-logo.png` from the desktop app.
	 */
	interface Props {
		/** Rendered size in pixels. */
		size?: number;
		class?: string;
	}
	let { size = 28, class: className = '' }: Props = $props();
</script>

<img
	src="/brand/codeinoven-logo.png"
	alt="CodeInOven logo"
	width={size}
	height={size}
	class={className}
	style="width:{size}px;height:{size}px;object-fit:contain"
/>
