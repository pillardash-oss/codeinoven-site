<script lang="ts">
  import { COMPANY, LINKS, PRODUCT, SITE_URL } from '$lib/config';

  interface Props {
    title?: string;
    description?: string;
    canonical?: string;
    type?: 'website' | 'article';
    image?: string;
  }

  let {
    title = 'CodeInOven: Your AI coding work, under control',
    description = PRODUCT.description,
    canonical = '/',
    type = 'website',
    image = `${SITE_URL}/meta.webp`
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
    image: `${SITE_URL}/meta.webp`,
    screenshot: `${SITE_URL}/meta.webp`,
    sameAs: [LINKS.github]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is CodeInOven?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CodeInOven (pronounced Code In Oven, three words) is an open-source desktop engineering workspace for software developers. It brings together coding agents, an inner web browser, an attached terminal, and GitHub pull request reviews under one window. It is developer software, unrelated to pharmaceuticals.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need to install an agent harness before using CodeInOven?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. CodeInOven comes bundled with Pi out of the box. Add your model endpoint or API key and start working. If you already have Claude Code, OpenCode, Codex, Antigravity, Cline, or Muse Code installed on your machine, CodeInOven detects and runs them too.'
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
  <meta property="og:image:type" content="image/webp" />
  <meta property="og:image:width" content="1731" />
  <meta property="og:image:height" content="909" />
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
