<script lang="ts">
	/**
	 * The real CodeInOven mark. This directory is a CodeInOven property, so it
	 * carries the product's own logo rather than a look-alike drawn in markup.
	 * Served as an <img> because the logo is a brand asset, not a themeable icon.
	 */
	interface Props {
		size?: number;
		class?: string;
	}
	let { size = 28, class: className = '' }: Props = $props();
</script>

<img
	src="/codeinoven-icon.svg"
	alt=""
	aria-hidden="true"
	width={size}
	height={size}
	class={className}
	style="width:{size}px;height:{size}px"
/>
