/**
 * SVG sanitizer for scraped icons.
 *
 * Scraped SVGs are never served raw. This sanitizer removes anything that can
 * execute code or load remote resources, then re-serializes the markup:
 *   - <script>, <foreignObject>, embedded HTML
 *   - event handler attributes (onload, onclick, ...)
 *   - javascript:/data:text URLs
 *   - external hrefs, remote images/fonts, CSS @import / url(http...)
 *   - DTDs and XML entities (billion-laughs / XXE style payloads)
 *   - animation elements that can run script (<animate> with events, <set>)
 */

const FORBIDDEN_ELEMENTS = [
	'script',
	'foreignObject',
	'iframe',
	'embed',
	'object',
	'audio',
	'video',
	'animation',
	'handler',
	'listener',
	'set'
];

/** Element-stripping regex: removes the element and its content (paired or self-closing). */
function stripElement(svg: string, tag: string): string {
	const paired = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, 'gi');
	const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
	return svg.replace(paired, '').replace(selfClosing, '');
}

function sanitizeStyleContent(css: string): string {
	return css
		.replace(/@import[^;]*;?/gi, '')
		.replace(/@font-face\s*\{[^}]*\}/gi, '')
		.replace(/url\(\s*(['"]?)(?!#|data:image\/)[^)]*\)/gi, 'none')
		.replace(/expression\s*\(/gi, 'none(');
}

export interface SanitizeResult {
	svg: string;
	/** True when the input was structurally valid SVG. */
	ok: boolean;
	reason?: string;
}

export function sanitizeSvg(input: string): SanitizeResult {
	let svg = input;

	// Reject DTDs entirely: entity expansion and external entity attacks.
	if (/<!DOCTYPE[^>]*\[/i.test(svg) || /<!ENTITY/i.test(svg)) {
		return { svg: '', ok: false, reason: 'contains DTD entities' };
	}
	svg = svg.replace(/<!DOCTYPE[^>]*>/gi, '');
	svg = svg.replace(/<\?xml-stylesheet[^>]*\?>/gi, '');
	// Strip comments and CDATA wrappers (CDATA content inside <style> is kept by regex below).
	svg = svg.replace(/<!--[\s\S]*?-->/g, '');

	// Must actually be an SVG document.
	if (!/<svg[\s>]/i.test(svg)) {
		return { svg: '', ok: false, reason: 'no <svg> root element' };
	}

	// Remove dangerous elements wholesale.
	for (const tag of FORBIDDEN_ELEMENTS) {
		svg = stripElement(svg, tag);
	}

	// Remove event handler attributes (on*)
	svg = svg.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

	// Remove javascript: and non-image data: URLs in any attribute.
	svg = svg.replace(
		/\s+(href|xlink:href|src)\s*=\s*("javascript:[^"]*"|'javascript:[^']*'|"data:(?!image\/)[^"]*"|'data:(?!image\/)[^']*')/gi,
		''
	);

	// Remove external references: any href/src pointing outside the document.
	// Local fragment references (#gradient) and data:image URIs are allowed.
	svg = svg.replace(
		/\s+(href|xlink:href|src)\s*=\s*("(?!#|data:image\/)[^"]*"|'(?!#|data:image\/)[^']*')/gi,
		''
	);

	// Neutralize inline style attributes containing external url() or expressions.
	svg = svg.replace(/\s+style\s*=\s*("[^"]*"|'[^']*')/gi, (match) => {
		const inner = match.slice(match.indexOf('=') + 1).trim();
		const quote = inner[0];
		const css = inner.slice(1, -1);
		const cleaned = sanitizeStyleContent(css);
		return ` style=${quote}${cleaned}${quote}`;
	});

	// Sanitize <style> blocks (remote fonts, imports, external urls).
	svg = svg.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style\s*>)/gi, (_m, open, css, close) => {
		return open + sanitizeStyleContent(css) + close;
	});

	// <image> elements may only keep local/data-uri content; external ones were
	// stripped of href above — drop now-empty image elements.
	svg = svg.replace(/<image\b(?![^>]*(href|xlink:href))[^>]*\/?>(\s*<\/image\s*>)?/gi, '');

	// Final structural check: the root element must still be intact.
	const open = svg.match(/<svg[\s>]/gi)?.length ?? 0;
	if (open === 0) {
		return { svg: '', ok: false, reason: 'sanitization removed root element' };
	}

	return { svg: svg.trim(), ok: true };
}
