/**
 * Curated registry of AI coding agents and agentic developer tools.
 * This list is maintained manually — the crawler only visits these sources.
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
		description: 'Open-source AI coding agent for the terminal.',
		websiteUrl: 'https://opencode.ai',
		githubUrl: 'https://github.com/anomalyco/opencode',
		// Repo-wide crawl finds channel variants; pin the prod desktop app icon.
		iconUrl: 'https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/desktop/icons/prod/icon.png'
	},
	{
		slug: 'claude-code',
		name: 'Claude Code',
		vendor: 'Anthropic',
		description: 'Agentic coding tool by Anthropic that lives in your terminal.',
		websiteUrl: 'https://code.claude.com',
		githubUrl: 'https://github.com/anthropics/claude-code'
	},
	{
		slug: 'codex',
		name: 'OpenAI Codex',
		vendor: 'OpenAI',
		description: 'OpenAI coding agent available as a CLI and in ChatGPT.',
		websiteUrl: 'https://openai.com/codex/',
		githubUrl: 'https://github.com/openai/codex'
	},
	{
		slug: 'cursor',
		name: 'Cursor',
		vendor: 'Anysphere',
		description: 'AI-powered code editor built for pair programming with AI.',
		websiteUrl: 'https://cursor.com',
		githubUrl: 'https://github.com/cursor/cursor'
	},
	{
		slug: 'gemini-cli',
		name: 'Gemini CLI',
		vendor: 'Google',
		description: 'Open-source AI agent that brings Gemini into your terminal.',
		websiteUrl: 'https://google-gemini.github.io/gemini-cli/',
		githubUrl: 'https://github.com/google-gemini/gemini-cli'
	},
	{
		slug: 'antigravity',
		name: 'Google Antigravity',
		vendor: 'Google',
		description: 'Agent-first development platform by Google.',
		websiteUrl: 'https://antigravity.google'
	},
	{
		slug: 'amp',
		name: 'Amp',
		vendor: 'Sourcegraph',
		description: 'Agentic coding tool by Sourcegraph.',
		websiteUrl: 'https://ampcode.com',
		// ampcode.com sends oversized response headers that break the HTML crawl; pin the SVG mark.
		iconUrl: 'https://ampcode.com/amp-mark-color.svg'
	},
	{
		slug: 'aider',
		name: 'Aider',
		vendor: 'Aider AI',
		description: 'AI pair programming in your terminal.',
		websiteUrl: 'https://aider.chat',
		githubUrl: 'https://github.com/Aider-AI/aider'
	},
	{
		slug: 'cline',
		name: 'Cline',
		vendor: 'Cline Bot Inc.',
		description: 'Autonomous coding agent for VS Code.',
		websiteUrl: 'https://cline.bot',
		githubUrl: 'https://github.com/cline/cline'
	},
	{
		slug: 'roo-code',
		name: 'Roo Code',
		vendor: 'Roo Code, Inc.',
		description: 'AI-powered autonomous coding agent that lives in your editor.',
		websiteUrl: 'https://roocode.com',
		githubUrl: 'https://github.com/RooCodeInc/Roo-Code',
		// Repo crawl favors the dark wordmark; pin the square extension icon.
		iconUrl: 'https://raw.githubusercontent.com/RooCodeInc/Roo-Code/main/src/assets/icons/icon.png'
	},
	{
		slug: 'continue',
		name: 'Continue',
		vendor: 'Continue Dev',
		description: 'Open-source AI code assistant and agent platform.',
		websiteUrl: 'https://continue.dev',
		githubUrl: 'https://github.com/continuedev/continue'
	},
	{
		slug: 'goose',
		name: 'Goose',
		vendor: 'Block',
		description: 'Open-source, extensible AI agent that automates engineering tasks.',
		websiteUrl: 'https://block.github.io/goose/',
		githubUrl: 'https://github.com/block/goose',
		// Repo crawl favors the wordmark; pin the square desktop app icon.
		iconUrl: 'https://raw.githubusercontent.com/block/goose/main/ui/desktop/src/images/icon.png'
	},
	{
		slug: 'openhands',
		name: 'OpenHands',
		vendor: 'All Hands AI',
		description: 'Open platform for AI software developer agents.',
		websiteUrl: 'https://openhands.dev',
		githubUrl: 'https://github.com/All-Hands-AI/OpenHands'
	},
	{
		slug: 'github-copilot',
		name: 'GitHub Copilot',
		vendor: 'GitHub',
		description: 'AI coding assistant and agent integrated across GitHub.',
		websiteUrl: 'https://github.com/features/copilot'
	},
	{
		slug: 'windsurf',
		name: 'Windsurf',
		vendor: 'Windsurf',
		description: 'Agentic AI-native code editor.',
		websiteUrl: 'https://windsurf.com',
		// windsurf.com refuses non-browser connections; official GitHub org avatar instead.
		iconUrl: 'https://github.com/Exafunction.png?size=512'
	},
	{
		slug: 'kilo-code',
		name: 'Kilo Code',
		vendor: 'Kilo Code',
		description: 'Open-source AI agent extension for VS Code.',
		websiteUrl: 'https://kilocode.ai',
		githubUrl: 'https://github.com/Kilo-Org/kilocode'
	},
	{
		slug: 'devin',
		name: 'Devin',
		vendor: 'Cognition',
		description: 'Autonomous AI software engineer.',
		websiteUrl: 'https://devin.ai',
		// devin.ai refuses non-browser connections; official GitHub org avatar instead.
		iconUrl: 'https://github.com/CognitionAI.png?size=512'
	},
	{
		slug: 'jules',
		name: 'Jules',
		vendor: 'Google',
		description: 'Asynchronous AI coding agent by Google.',
		websiteUrl: 'https://jules.google'
	},
	{
		slug: 'amazon-q-developer',
		name: 'Amazon Q Developer',
		vendor: 'Amazon Web Services',
		description: 'Generative AI assistant for software development on AWS.',
		websiteUrl: 'https://aws.amazon.com/q/developer/'
	},
	{
		slug: 'qwen-code',
		name: 'Qwen Code',
		vendor: 'Alibaba',
		description: 'Coding agent CLI powered by Qwen-Coder models.',
		websiteUrl: 'https://qwenlm.github.io/qwen-code-docs/',
		githubUrl: 'https://github.com/QwenLM/qwen-code'
	},
	{
		slug: 'zed',
		name: 'Zed',
		vendor: 'Zed Industries',
		description: 'High-performance code editor with built-in AI agents.',
		websiteUrl: 'https://zed.dev',
		githubUrl: 'https://github.com/zed-industries/zed'
	},
	{
		slug: 'factory-droid',
		name: 'Factory Droid',
		vendor: 'Factory',
		description: 'Agent-native software development platform.',
		websiteUrl: 'https://factory.ai'
	}
];
