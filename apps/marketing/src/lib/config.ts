/**
 * Single source of truth for every external destination and company fact the
 * marketing site references. Nothing here is inferred at build time — edit the
 * values below and the whole site follows.
 */

/** Product identity. Mirrors `src/lib/brand.ts` in the desktop app. */
export const PRODUCT = {
  name: 'CodeInOven',
  tagline: 'Keep control of AI coding work, from idea to delivery.',
  description:
    'CodeInOven helps your AI coding tools work together in one place, with your approval at every important step.'
} as const;

/** The company behind the product. */
export const COMPANY = {
  name: 'Pillardash Solutions Limited',
  shortName: 'Pillardash',
  url: 'https://pillardash.com'
} as const;

/**
 * The GitHub repository. Everything GitHub-shaped on the site derives from this
 * one value — edit it here and releases, issues and the source links follow.
 */
export const REPO = 'pillardash-oss/codeinoven';

/** The open-source licence the repository ships under. */
export const LICENSE = 'MIT';

/** External links. */
export const LINKS = {
  github: `https://github.com/${REPO}`,
  /** Always resolves to the newest published build — no version pinned here. */
  releases: `https://github.com/${REPO}/releases/latest`,
  license: `https://github.com/${REPO}/blob/main/LICENSE`,
  security: `https://github.com/${REPO}/security/policy`,
  privacy: '/privacy',
  docs: null as string | null,
  contact: 'mailto:hello@pillardash.com'
} as const;

export interface Platform {
  id: 'macos' | 'windows' | 'linux';
  name: string;
  /** What the release actually publishes for this platform. */
  artifact: string;
  /** macOS ships first; the others follow. */
  available: boolean;
}

/** Mirrors the build targets in the app's electron-builder.yml. */
export const PLATFORMS: readonly Platform[] = [
  { id: 'macos', name: 'macOS', artifact: '.dmg', available: true },
  { id: 'windows', name: 'Windows', artifact: '.exe', available: true },
  { id: 'linux', name: 'Linux', artifact: '.AppImage · .deb', available: true }
];
