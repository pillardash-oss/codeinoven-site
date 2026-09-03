/**
 * The harnesses CodeInOven drives and the model backends it can point them at.
 *
 * Mirrors the canonical manifest in the desktop app
 * (`src/main/harness-registry.ts`) and the local-server quick presets in
 * `BaseUrlProviderEditor.svelte`. Order matches the app so the site never
 * claims a harness the product does not actually detect.
 */

export interface Harness {
	/** Matches the app's harness id and the icon filename in `/harness`. */
	id: string;
	name: string;
	vendor: string;
	/** The binary CodeInOven probes for on your machine. */
	command: string;
	/** Whether this driver accepts custom base-URL providers. */
	customProviders: boolean;
	/**
	 * True when the vendor ships a complete app-icon tile (its own rounded
	 * background), false when the asset is a bare glyph on transparency. Tiles
	 * render full-bleed; glyphs get a surface chip so they have a body.
	 */
	tile: boolean;
	website: string;
}

export const HARNESSES: readonly Harness[] = [
	{
		id: 'pi',
		name: 'Pi',
		vendor: 'Earendil Works',
		command: 'pi',
		customProviders: true,
		tile: true,
		website: 'https://pi.dev'
	},
	{
		id: 'codex',
		name: 'Codex CLI',
		vendor: 'OpenAI',
		command: 'codex',
		customProviders: true,
		tile: true,
		website: 'https://developers.openai.com/codex'
	},
	{
		id: 'claude-code',
		name: 'Claude Code',
		vendor: 'Anthropic',
		command: 'claude',
		customProviders: true,
		tile: false,
		website: 'https://docs.anthropic.com/en/docs/claude-code'
	},
	{
		id: 'opencode',
		name: 'OpenCode',
		vendor: 'OpenCode',
		command: 'opencode',
		customProviders: true,
		tile: true,
		website: 'https://opencode.ai'
	},
	{
		id: 'cline',
		name: 'Cline',
		vendor: 'Cline',
		command: 'cline',
		customProviders: true,
		tile: false,
		website: 'https://github.com/cline/cline'
	},
	{
		id: 'antigravity',
		name: 'Antigravity',
		vendor: 'Google',
		command: 'agy',
		customProviders: false,
		tile: true,
		website: 'https://antigravity.google'
	},
	{
		id: 'muse-code',
		name: 'Muse Code',
		vendor: 'Meta',
		command: 'muse',
		customProviders: false,
		tile: true,
		website: 'https://developer.meta.com/ai/products/muse-code/'
	}
];

export interface LocalBackend {
	/** Matches the icon filename in `/providers`, or `null` for a generic mark. */
	id: string | null;
	name: string;
	/** The default endpoint CodeInOven pre-fills when you pick this preset. */
	baseUrl: string;
}

/** One-click local presets, plus the escape hatch for anything else. */
export const LOCAL_BACKENDS: readonly LocalBackend[] = [
	{ id: 'ollama', name: 'Ollama', baseUrl: 'http://localhost:11434/v1' },
	{ id: 'lmstudio', name: 'LM Studio', baseUrl: 'http://localhost:1234/v1' },
	{ id: null, name: 'llama.cpp', baseUrl: 'http://localhost:8080/v1' }
];

/** Hosted vendors reachable through the same OpenAI-compatible plumbing. */
export const HOSTED_PROVIDERS: readonly string[] = [
	'openai',
	'anthropic',
	'google',
	'xai',
	'deepseek',
	'qwen',
	'mistral',
	'groq',
	'openrouter',
	'huggingface'
];
