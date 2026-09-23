<script lang="ts">
  import { COMPANY, LINKS, PRODUCT, SITE_URL } from '$lib/config';

  interface Props {
    title?: string;
    description?: string;
    canonical?: string;
    type?: 'website' | 'article';
    image?: string;
  }

  /**
   * The published social card. `static/meta.webp` is kept beside it as a plain
   * alias of the same image, so card URLs that social crawlers cached before the
   * swap keep resolving instead of 404ing. Update both when the card changes.
   */
  const SOCIAL_IMAGE = `${SITE_URL}/meta.png`;

  let {
    title = 'CodeInOven: Build real products with AI',
    description = PRODUCT.description,
    canonical = '/',
    type = 'website',
    image = SOCIAL_IMAGE
  }: Props = $props();

  const canonicalUrl = $derived(
    canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
  );

  const fullTitle = $derived(
    title.includes('CodeInOven') ? title : `${title} | CodeInOven`
  );

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: COMPANY.name,
    alternateName: [COMPANY.shortName],
    url: COMPANY.url,
    logo: `${SITE_URL}/brand/codeinoven-logo.png`,
    sameAs: [LINKS.github],
    parentOrganization: {
      '@type': 'Organization',
      name: 'Pillardash Solutions Limited',
      url: 'https://pillardash.com'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: PRODUCT.name,
    alternateName: PRODUCT.alternateNames,
    url: SITE_URL,
    description: PRODUCT.tagline,
    publisher: {
      '@id': `${SITE_URL}/#organization`
    }
  };

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: PRODUCT.name,
    alternateName: PRODUCT.alternateNames,
    description: PRODUCT.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Windows, Linux',
    url: SITE_URL,
    downloadUrl: `${SITE_URL}/download`,
    softwareVersion: '0.1.0',
    license: LINKS.license,
    author: {
      '@id': `${SITE_URL}/#organization`
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    image: SOCIAL_IMAGE,
    screenshot: SOCIAL_IMAGE,
    sameAs: [LINKS.github]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is CodeInOven (Code in oven)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CodeInOven (often searched as "Code in oven" or phonetically misheard as "codene") is a free, open-source workspace for building real software with AI. It brings coding agents, a browser, a terminal, pull request reviews, and long-running engineering work into one desktop application. It is developer software, unrelated to pharmaceuticals.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I start without setting up a coding agent first?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Install CodeInOven, add a model provider, and open a project. If you already use Claude Code, OpenCode, Codex, Antigravity, Cline, Pi, or Muse Code, you can run them in the same workspace.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need an AGENTS.md or CLAUDE.md file in my project?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. CodeInOven includes structured prompts that instruct agents to inspect repositories, follow existing patterns, keep diffs focused, and verify results before committing. You open your project and start.'
        }
      }
    ]
  };

  const jsonLd = JSON.stringify([
    organizationSchema,
    websiteSchema,
    softwareAppSchema,
    faqSchema
  ]);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={PRODUCT.keywords} />
  <meta name="author" content={COMPANY.name} />
  <meta name="publisher" content={COMPANY.name} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- OpenGraph -->
  <meta property="og:site_name" content={PRODUCT.name} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content={type} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content={image} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1624" />
  <meta property="og:image:height" content="1061" />
  <meta property="og:image:alt" content="CodeInOven (Code In Oven) - Desktop workstation for AI coding agents" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:image:alt" content="CodeInOven (Code In Oven) - Desktop workstation for AI coding agents" />

  <!-- Entity & Application hints for search engines -->
  <meta name="application-name" content="CodeInOven" />
  <meta name="apple-mobile-web-app-title" content="CodeInOven" />
  <meta name="theme-color" content="#131418" />

  <!-- Schema.org JSON-LD Structured Data -->
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
