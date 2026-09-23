/**
 * Single source of truth for every external destination and company fact the
 * marketing site references. Nothing here is inferred at build time — edit the
 * values below and the whole site follows.
 */

export const SITE_URL = 'https://codeinoven.com';

/** Product identity. Mirrors `src/lib/brand.ts` in the desktop app. */
export const PRODUCT = {
  name: 'CodeInOven',
  alternateNames: [
    'Code in oven',
    'Code In Oven',
    'code in oven',
    'codene',
    'CodeInOven App',
    'CodeInOven Desktop',
    'codeinoven'
  ],
  tagline: 'Build real products with AI.',
  description:
    'CodeInOven is a free, open-source workspace for building real software with AI. Start without setup friction, then take on pull request reviews, automations, deployments, worktrees, and long-running engineering work.',
  keywords:
    'Code in oven, CodeInOven, codene, code in oven app, code in oven software, codeinoven, AI software engineering workspace, open source AI coding, GitHub PR review desktop, inner browser developer, terminal workspace, Pillardash'
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
  contact: 'mailto:hey@pillardash.com'
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

/**
 * The release mirror. Builds are served from here rather than GitHub, so a
 * download is a straight file fetch with no redirect chain.
 */
export const MIRROR_ORIGIN = 'https://dl.codeinoven.com';

/** The stable channel's manifest: one entry per published artifact. */
export const RELEASE_MANIFEST_URL = `${MIRROR_ORIGIN}/stable/RELEASE.json`;

/** The desktop platforms the product ships for. */
export type OsPlatform = 'macos' | 'windows' | 'linux';

export interface ReleaseArtifact {
  name: string;
  platform: string;
  arch: string;
  kind: string;
  sizeBytes: number;
  sha256: string;
  sha512: string;
  url: string;
}

export interface ReleaseManifest {
  schemaVersion: number;
  channel: string;
  version: string;
  tag: string;
  publishedAt: string;
  sourceUrl: string;
  artifacts: ReleaseArtifact[];
}

/** The one artifact each platform downloads by default. */
export const RELEASE_PRIMARY_KIND: Record<OsPlatform, string> = {
  macos: 'dmg',
  windows: 'installer',
  linux: 'appimage'
};

/** The alternate package offered next to the default, where one exists. */
export const RELEASE_SECONDARY_KIND: Partial<Record<OsPlatform, string>> = {
  linux: 'deb'
};

/**
 * The artifact a platform should get, or null when the manifest has none for
 * it. Selecting by `platform` + `kind` picks the exact build for the platform
 * and ignores every other entry in the manifest.
 */
export function selectArtifact(
  release: ReleaseManifest | null | undefined,
  platform: OsPlatform,
  kind: string
): ReleaseArtifact | null {
  if (!release) return null;
  return release.artifacts.find((a) => a.platform === platform && a.kind === kind) ?? null;
}

/** A copy-paste command that always names the current artifact. */
export function downloadCommand(artifact: ReleaseArtifact): string {
  return `curl -fL -o ${artifact.name} ${artifact.url}`;
}

/**
 * The visitor's desktop platform, or null when it cannot be trusted (mobile,
 * unknown, or server-side). `userAgentData.platform` is the modern answer;
 * `navigator.platform` is the fallback every current browser still ships.
 */
export function detectPlatform(): OsPlatform | null {
  if (typeof navigator === 'undefined') return null;

  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const value = (nav.userAgentData?.platform ?? navigator.platform ?? '').toLowerCase();
  if (!value) return null;

  // The product is desktop-only; phones and tablets get the all-platform view.
  if (value.includes('android') || value.includes('ios') || value.includes('iphone') || value.includes('ipad')) {
    return null;
  }
  if (value.includes('win')) return 'windows';
  if (value.includes('mac') || value.includes('darwin')) return 'macos';
  if (value.includes('linux') || value.includes('x11') || value.includes('bsd')) return 'linux';
  return null;
}

/** A success is reused for minutes; a failure is retried quickly. */
const RELEASE_TTL_MS = 5 * 60 * 1000;
const RELEASE_RETRY_MS = 30 * 1000;
const RELEASE_TIMEOUT_MS = 5000;

let cachedRelease: { at: number; value: ReleaseManifest | null } | null = null;

function isReleaseManifest(value: unknown): value is ReleaseManifest {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ReleaseManifest>;
  return typeof candidate.version === 'string' && Array.isArray(candidate.artifacts);
}

/**
 * Read the stable manifest. Returns null on any failure so callers can fall
 * back to the all-platform download instead of rendering nothing.
 *
 * Server-side only: the mirror sends no CORS headers, so the browser cannot
 * read it directly. The result is cached in-process, which keeps a prerender
 * or a server render from refetching on every request.
 */
export async function loadRelease(fetcher: typeof fetch = fetch): Promise<ReleaseManifest | null> {
  const now = Date.now();
  if (cachedRelease) {
    const ttl = cachedRelease.value ? RELEASE_TTL_MS : RELEASE_RETRY_MS;
    if (now - cachedRelease.at < ttl) return cachedRelease.value;
  }

  let value: ReleaseManifest | null = null;
  try {
    const response = await fetcher(RELEASE_MANIFEST_URL, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(RELEASE_TIMEOUT_MS)
    });
    if (response.ok) {
      const data: unknown = await response.json();
      if (isReleaseManifest(data)) value = data;
    }
  } catch {
    value = null;
  }

  cachedRelease = { at: now, value };
  return value;
}
