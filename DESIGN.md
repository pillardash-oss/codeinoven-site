# CodeInOven Design Guide

This document captures the current visual and interaction language of CodeInOven. Agents should use it with `APP-BIBLE.md` before changing UI so the product stays consistent across routes and components.

The canonical source of truth for color is the token block in the desktop app's `src/renderer/app.css`. If this document and that file ever disagree, the file wins and this document is the thing that needs fixing.

## Product Personality

CodeInOven is a precision instrument for professionals running coordinated agentic software engineering. The UI is calm and confident: high information density with unmistakable hierarchy, never shouting. Copy is operator-first and verb-driven (`New thread`, `Approve plan`, `Run checks`) with no marketing language inside the app. The product must feel trustworthy — state transitions are visible, destructive actions are explicit, and nothing happens silently. The brand tone is restrained and industrial: true neutral black and Ivory with a whisper of Ember, saying "serious tool," not "SaaS landing page." See `APP-BIBLE.md` for the full philosophy.

## Visual Direction

The app uses a restrained workspace aesthetic:

- Compact top navigation with contextual controls.

- Floating bottom dock for the major modules.

- Soft app canvas, raised surfaces, and thin borders for structure.

- True neutral dark (#0B0B0D) as the dark canvas. There is no blue tint anywhere in the dark theme — greys step through #141417, #1C1C20, #202025, #242429.

- Ivory (#F7F6F2) as the light background, with Ivory (#F5F4F0) as dark-mode text.

- Ember (#CA5A00) as accent only (under 5% usage).

- Strong numeric hierarchy with tabular figures.

- Satoshi as the product typeface.

- Lucide icons for actions and module cues.

- Rounded, tactile controls without playful decoration.

The experience should resemble a focused business dashboard, not a marketing SaaS homepage.

## Theme Tokens

Use the semantic Tailwind v4 tokens defined in the desktop app's `src/renderer/app.css`. Do not hardcode raw black, white, or arbitrary hex color values in UI markup.

Core tokens:

- `bg-app`: page/application background (Ivory #F7F6F2 in light mode, near-black #0B0B0D in dark mode).

- `bg-surface`: primary panels, page sections, tables, auth panels.

- `bg-elevated`: raised controls, row cards, hoverable surface elements.

- `bg-overlay`: active toolbar states, table heads, dropdown hover states.

- `bg-raised`: neutral chips and subtle separated zones.

- `text-foreground`: primary readable text (#081825 in light, Ivory #F5F4F0 in dark).

- `text-muted`: secondary copy and labels.

- `text-dimmed`: tertiary hints, shortcuts, metadata.

- `bg-primary` / `text-primary`: brand color (dark ink in light mode, Ivory in dark mode). Primary inverts between themes; it is not a fixed hue.

- `text-on-primary`: text/icons on primary actions.

- `bg-accent` / `text-accent`: Ember #CA5A00 (under 5% usage for highlights/badges only). Hover is #A94A00; `text-on-accent` is Ivory.

- `border-border` / `border-border-strong`: #E2E1DC / #C8C7C2 in light, #27272C / #3B3B42 in dark.

- `bg-danger` / `text-danger`: destructive actions.

Light mode uses Ivory backgrounds with dark ink. Dark mode uses true neutral black backgrounds with Ivory text — never a blue-tinted navy, and never pure `#000`. Ember is reserved for accent elements only (badges, special highlights, limited to 5% of UI). Every new UI element must work in both themes through tokens, not one-off color values.

## Typography

Use Satoshi from `apps/app/static/assets/font` through the app font stack. Keep text practical and compact.

- Page titles: `text-xl` to `text-2xl`, `font-bold` or `font-semibold`, `tracking-tight`.

- Section titles: `text-sm` to `text-base`, `font-semibold`.

- Labels and table headers: `text-xs`, `font-semibold`, often uppercase with modest tracking.

- Body/help text: `text-sm`, `text-muted`, readable line height.

- Token counts, durations, costs, diff stats, and step numbers: `tabular-nums`, strong weight, tight hierarchy.

- Paths, commands, model ids, hashes, and agent output use the mono stack.

Do not scale text with viewport width. Avoid oversized display type inside dashboards, tables, forms, cards, or sidebars.

## Layout

Favor dense, scannable operator layouts:

- The workspace is a fixed three-zone shell: thread rail on the left, conversation or spec in the middle, context panel on the right. `body` does not scroll — individual panes do.

- Standard pane rhythm is `space-y-6`, panels with `p-4`, `p-5`, or `p-6`.

- Panels and modals may use `rounded-xl`/`rounded-2xl`; interactive controls stay at the enforced 2px radius.

- Keep cards for repeated items, empty states, modals, and framed tools. Do not nest cards inside cards.

- Preserve stable dimensions for toolbars, filters, buttons, icon buttons, and row cards. Controls should not cause layout shift when toggled, and streaming agent output must not reflow the surrounding chrome.

## Components

Prefer existing reusable components in `src/renderer/lib/components` before creating new markup:

- `layout/AppHeader.svelte` for the workspace title bar and contextual controls.

- `layout/CollapsibleSidebar.svelte` for the thread rail; `layout/ContextSidebar.svelte` for the right-side context panel.

- `ui/Modal.svelte` and `ui/DockableModal.svelte` for overlays; `ui/Tooltip.svelte` and `ui/Toaster.svelte` for transient affordances.

- `shared/StatusBadge.svelte` and `shared/ScopeBadge.svelte` for state and scope labels instead of freeform colored text.

- `shared/ThreadSelect.svelte`, `shared/ProjectSelect.svelte`, `shared/ModelPicker.svelte`, and the other pickers for selection controls.

- `shared/RichMarkdownEditor.svelte` for editable specification and annotation surfaces.

- `markdown/` for rendered agent output; use `.markdown-body` styles rather than inventing prose classes.

Feature-area components live beside their domain (`threads/`, `specs/`, `chats/`, `terminal/`, `scope/`, `memory/`, `files/`, `settings/`). Put new work in the matching folder. If a component will be used in two or more places, promote it to `shared/` or `ui/`.

## Buttons And Controls

Buttons should be familiar, compact, and action-oriented.

- Primary actions use `bg-primary text-on-primary hover:bg-primary-hover` (dark ink background with Ivory text in light mode; inverted in dark mode).

- Secondary actions use tokenized borders and elevated/overlay hover states.

- Accent actions (use sparingly, under 5%): `bg-accent text-on-accent hover:bg-accent-hover` (Ember).

- Minimum action height is usually `h-8`, `h-9`, `h-10`, or `min-h-[36px]`.

- Use icons from `@lucide/svelte` inside action buttons when the action benefits from a recognizable symbol.

- Icon-only controls need accessible labels.

- Controls are near-square by design. `app.css` forces `border-radius: 2px` on buttons, inputs, textareas, selects, menus, and dialogs — do not fight it with `rounded-*` utilities. Reserve fully rounded shapes for avatars, status dots, and pills.

- Focus is visible on buttons (`outline: 1px solid var(--color-foreground)`), and deliberately suppressed on text inputs, where focus is communicated through border and background only.

- Do not write boolean Svelte props as `prop={true}`; use the shorthand attribute.

Avoid arbitrary z-index values when Tailwind has a matching class. For example, use `z-10` instead of `z-[10]`.

## Tables And Data Views

Lists are the core of the app: threads, specs, runs, checkpoints, files, and memory entries.

- Rows use thin borders, muted headers, and subtle overlay hover states.

- Use `StatusBadge` and `ScopeBadge` for state cells instead of freeform colored text. Thread state colors are fixed and semantic: `--color-thread-pinned` yellow, working blue, unread green, error red, done grey.

- Streaming and long-running rows must reserve their final height so output does not push the list around.

- Empty results should explain the state briefly and offer a concrete next action.

- Keep counts, durations, and costs right-aligned where comparison matters.

- Content is selectable by default — operators copy paths, ids, and agent output constantly. Only chrome (buttons, menus, tabs, labels) opts out of selection.

## Forms

Forms should feel deliberate and forgiving.

- Labels are compact, muted, and explicit.

- Inputs use tokenized elevated backgrounds, thin borders, and muted placeholders. They do not get a focus ring — focus reads through border and background.

- Keep optional fields truly optional and explain only where it reduces confusion.

- Use the product's vocabulary: thread, spec, plan, approval, run, checkpoint, scope, driver, harness, MCP, skill, checklist.

- Anything that changes what an agent can do (scope, permissions, model, driver) must show its current value before it is edited, never just after.

## Overlays

Overlays should feel like part of the workspace, not separate pages.

- Modals are centered with tokenized surfaces, thin borders, and short scale/fade transitions (`ui/Modal.svelte`).

- Use `ui/DockableModal.svelte` when the operator needs to keep working while the overlay stays open — inspecting a diff while the run continues, for example.

- Backdrops use tokenized app overlays and light blur where established.

- Do not introduce full page reloads for modal, drawer, or navigation actions.

## Navigation

CodeInOven is a desktop workspace, not a multi-page site. Navigation is selection, not routing: you switch project, thread, and pane — you do not travel between pages.

- The shell is `AppHeader` on top, `CollapsibleSidebar` on the left, the active workspace in the middle, and `ContextSidebar` on the right.

- Never trigger a full page load or a browser-style navigation. State moves through stores, not URLs.

- Do not use `event.stopPropagation()` on containers that also contain interactive children — it silently breaks selection handlers.

### Header

The header is contextual and reflects the active project and thread.

- The header title comes from the active project/thread state. Do not hardcode a title that can drift from the store.

- Header controls are for things that apply to the current thread: project switch, model/driver selection, scope, and run actions.

- Keep the header compact. Anything that needs explanation belongs in a menu, not in header chrome.

### Sidebars

Both sidebars are persistent, collapsible, and remembered.

- The left rail is the thread list. It carries state color, search, and creation — it is the primary way of moving around the app.

- The right panel is context: assembled context, files, memory, scope, and terminal. It explains what the agent can see.

- Collapsed state is a user preference and must survive restart (`lib/stores/sidebar.svelte.ts`, `lib/stores/context-sidebar.svelte.ts`).

- Neither sidebar may cover content. Collapsing changes layout width, it does not overlay.

### Keyboard

Keyboard behavior is first-class in a desktop tool.

- Search, thread switching, and dialog dismissal must all be reachable without the mouse.

- Overlays follow the same contract everywhere: escape closes, enter confirms, arrows move, focus returns to the trigger.

## Motion

Motion is subtle and functional.

- Base button/control transitions are around 160ms.

- Hover can lift controls slightly or change surface color.

- Active states can scale down slightly.

- Modal and sheet transitions should stay short, around 100-150ms.

- Icon animations may be used for navigation or command affordances, but should not distract from work.

Do not add decorative animation, animated backgrounds, or large page transitions unless the workflow needs it.

## Iconography And Brand

Use `@lucide/svelte` for interface icons. Keep stroke widths near the existing range and size icons to the control: often 14-18px in toolbars, 18-22px in cards and empty states.

Use the shared brand mark component for the logo. Do not recreate the logo in CSS or ad-hoc SVG markup. The mark is a tile plus an Ember flame — the flame is the only place the accent appears at full strength in chrome.

## Copywriting

The app copy should sound like an operator's workspace:

- Use direct labels: `New thread`, `Approve plan`, `Run checks`, `Rework`, `Add checkpoint`, `Edit scope`.

- Prefer concrete nouns over abstractions.

- Name the actor. Say what the agent did, what it proposes, and what is still waiting on the human.

- Empty states should say what is missing and what to do next.

- Avoid generic marketing copy inside the app. Marketing voice lives on the site, never in the workspace.

## Accessibility

Accessibility is part of the design system:

- Every icon-only button needs an `aria-label`.

- Dialogs and sheets need clear titles and escape/close behavior.

- Form fields need labels and validation messages.

- Preserve visible focus outlines on buttons and other actionable chrome. Text inputs intentionally have no ring and must communicate focus through border and background contrast instead.

- Ember on black passes for large and bold text and for icons, but not for small body copy. Use `text-muted` or `text-foreground` for anything long-form and keep Ember for badges, marks, and emphasis.

- Keep contrast token-driven for light and dark modes.

- Do not hide essential actions behind hover-only UI on mobile.

## Anti-Patterns

Do not introduce:

- Raw `black`, `white`, `#000`, `#fff`, or arbitrary theme-breaking hex colors in UI code.

- Blue-tinted "obsidian" navy as a dark surface. The dark theme is true neutral; navy is retired.

- Auric gold (`#D4AF37`). Ember `#CA5A00` is the only accent.

- Purple/blue gradient SaaS visuals, glassmorphism, decorative blobs, or hero sections **inside the app**.

- Oversized typography in operational screens.

- Nested cards or floating decorative section cards.

- Full page loads for normal app navigation.

- Layout shift when filters, selections, streaming output, or optional controls appear.

- Deprecated Svelte patterns, `any`, `as any`, or `console.*`.

- Redundant Tailwind classes such as conflicting text color utilities.

## Marketing Site

`apps/marketing` is the one place where marketing voice and display typography are correct. It shares the brand, not the workspace rules.

- The site is dark-only. It mirrors the app's dark tokens rather than redefining them: `app #0B0B0D`, `surface #141417`, `elevated #1C1C20`, `overlay #242429`, `foreground #F5F4F0`, `line #27272C`, `accent #CA5A00`.

- Tokens live in `apps/marketing/src/routes/layout.css`. When `src/renderer/app.css` changes in the desktop app, this file has to follow.

- Hero sections, display type, scroll reveals, and the orbital signal animation are allowed here and only here.

- Ember still stays under roughly 5% of the surface. It carries the brand mark, step numbers, badges, and the glow — not body copy, not buttons. The primary button is Ivory on black.

- Copy may be persuasive, but it must stay true to the product: specify, review, approve, implement. No invented capabilities, no vague AI superlatives.

## Before Shipping UI Work

For UI changes:

1. Read `APP-BIBLE.md`.
2. Reuse existing components and tokens.
3. Verify both light and dark themes for app work; the marketing site is dark-only.
4. Run the required Bun scripts available for the touched app.
5. Keep commits scoped to files you changed.
