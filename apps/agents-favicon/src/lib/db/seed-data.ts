/**
 * Curated registry of AI coding agents and coding tools.
 * This list is maintained manually. The crawler only visits these sources.
 */
export interface SeedAgent {
	slug: string;
	name: string;
	vendor: string;
	description: string;
	websiteUrl?: string;
	githubUrl?: string;
	/** Optional manually approved direct icon URL (highest priority source). */
	iconUrl?: string;
}

export const SEED_AGENTS: SeedAgent[] = [
	{
		slug: 'opencode',
		name: 'OpenCode',
		vendor: 'Anomaly',
		description: 'Open-source coding agent for the terminal.',
		websiteUrl: 'https://opencode.ai',
		githubUrl: 'https://github.com/anomalyco/opencode',
		// Repo-wide crawl finds channel variants; pin the prod desktop app icon.
		iconUrl: 'https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/desktop/icons/prod/icon.png'
	},
	{
		slug: 'claude-code',
		name: 'Claude Code',
		vendor: 'Anthropic',
		description: 'Coding assistant from Anthropic that runs from the terminal.',
		websiteUrl: 'https://code.claude.com',
		githubUrl: 'https://github.com/anthropics/claude-code'
	},
	{
		slug: 'codex',
		name: 'OpenAI Codex',
		vendor: 'OpenAI',
		description: 'Coding assistant from OpenAI, available as a CLI and in ChatGPT.',
		websiteUrl: 'https://openai.com/codex/',
		githubUrl: 'https://github.com/openai/codex'
	},
	{
		slug: 'cursor',
		name: 'Cursor',
		vendor: 'Anysphere',
		description: 'Code editor with pair programming and AI support.',
		websiteUrl: 'https://cursor.com',
		githubUrl: 'https://github.com/cursor/cursor'
	},
	{
		slug: 'gemini-cli',
		name: 'Gemini CLI',
		vendor: 'Google',
		description: 'Open-source terminal tool that runs Gemini models.',
		websiteUrl: 'https://google-gemini.github.io/gemini-cli/',
		githubUrl: 'https://github.com/google-gemini/gemini-cli'
	},
	{
		slug: 'antigravity',
		name: 'Google Antigravity',
		vendor: 'Google',
		description: 'Development platform for AI-assisted coding from Google.',
		websiteUrl: 'https://antigravity.google'
	},
	{
		slug: 'amp',
		name: 'Amp',
		vendor: 'Sourcegraph',
		description: 'Coding assistant from Sourcegraph.',
		websiteUrl: 'https://ampcode.com',
		// ampcode.com sends oversized response headers that break the HTML crawl; pin the SVG mark.
		iconUrl: 'https://ampcode.com/amp-mark-color.svg'
	},
	{
		slug: 'aider',
		name: 'Aider',
		vendor: 'Aider AI',
		description: 'Pair-programming assistant for terminal workflows.',
		websiteUrl: 'https://aider.chat',
		githubUrl: 'https://github.com/Aider-AI/aider'
	},
	{
		slug: 'cline',
		name: 'Cline',
		vendor: 'Cline Bot Inc.',
		description: 'Coding assistant for VS Code.',
		websiteUrl: 'https://cline.bot',
		githubUrl: 'https://github.com/cline/cline'
	},
	{
		slug: 'roo-code',
		name: 'Roo Code',
		vendor: 'Roo Code, Inc.',
		description: 'Coding assistant that runs inside your editor.',
		websiteUrl: 'https://roocode.com',
		githubUrl: 'https://github.com/RooCodeInc/Roo-Code',
		// Repo crawl favors the dark wordmark; pin the square extension icon.
		iconUrl: 'https://raw.githubusercontent.com/RooCodeInc/Roo-Code/main/src/assets/icons/icon.png'
	},
	{
		slug: 'continue',
		name: 'Continue',
		vendor: 'Continue Dev',
		description: 'Open-source coding assistant and platform.',
		websiteUrl: 'https://continue.dev',
		githubUrl: 'https://github.com/continuedev/continue'
	},
	{
		slug: 'goose',
		name: 'Goose',
		vendor: 'Block',
		description: 'Open-source coding agent that can be extended and scripted.',
		websiteUrl: 'https://block.github.io/goose/',
		githubUrl: 'https://github.com/block/goose',
		// Repo crawl favors the wordmark; pin the square desktop app icon.
		iconUrl: 'https://raw.githubusercontent.com/block/goose/main/ui/desktop/src/images/icon.png'
	},
	{
		slug: 'openhands',
		name: 'OpenHands',
		vendor: 'All Hands AI',
		description: 'Open platform for software engineering assistants.',
		websiteUrl: 'https://openhands.dev',
		githubUrl: 'https://github.com/All-Hands-AI/OpenHands'
	},
	{
		slug: 'github-copilot',
		name: 'GitHub Copilot',
		vendor: 'GitHub',
		description: 'Coding assistant and agent used across GitHub.',
		websiteUrl: 'https://github.com/features/copilot'
	},
	{
		slug: 'windsurf',
		name: 'Windsurf',
		vendor: 'Windsurf',
		description: 'Code editor with AI support built in.',
		websiteUrl: 'https://windsurf.com',
		// windsurf.com refuses non-browser connections; official GitHub org avatar instead.
		iconUrl: 'https://github.com/Exafunction.png?size=512'
	},
	{
		slug: 'kilo-code',
		name: 'Kilo Code',
		vendor: 'Kilo Code',
		description: 'VS Code extension that adds an AI coding assistant.',
		websiteUrl: 'https://kilocode.ai',
		githubUrl: 'https://github.com/Kilo-Org/kilocode'
	},
	{
		slug: 'devin',
		name: 'Devin',
		vendor: 'Cognition',
		description: 'Software engineering assistant that handles coding tasks.',
		websiteUrl: 'https://devin.ai',
		// devin.ai refuses non-browser connections; official GitHub org avatar instead.
		iconUrl: 'https://github.com/CognitionAI.png?size=512'
	},
	{
		slug: 'jules',
		name: 'Jules',
		vendor: 'Google',
		description: 'Asynchronous coding assistant by Google.',
		websiteUrl: 'https://jules.google'
	},
	{
		slug: 'amazon-q-developer',
		name: 'Amazon Q Developer',
		vendor: 'Amazon Web Services',
		description: 'AWS development assistant for writing and reviewing code.',
		websiteUrl: 'https://aws.amazon.com/q/developer/'
	},
	{
		slug: 'qwen-code',
		name: 'Qwen Code',
		vendor: 'Alibaba',
		description: 'CLI coding assistant powered by Qwen-Coder models.',
		websiteUrl: 'https://qwenlm.github.io/qwen-code-docs/',
		githubUrl: 'https://github.com/QwenLM/qwen-code'
	},
	{
		slug: 'zed',
		name: 'Zed',
		vendor: 'Zed Industries',
		description: 'Code editor with built-in coding assistants.',
		websiteUrl: 'https://zed.dev',
		githubUrl: 'https://github.com/zed-industries/zed'
	},
	{
		slug: 'factory-droid',
		name: 'Factory Droid',
		vendor: 'Factory',
		description: 'Software development platform with built-in coding helpers.',
		websiteUrl: 'https://factory.ai'
	}
];
