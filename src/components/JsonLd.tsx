/**
 * JSON-LD structured data for SEO.
 *
 * - `SiteJsonLd`    → injected once in the root layout (Organization +
 *                      NewsMediaOrganization + WebSite with SearchAction)
 * - `ArticleJsonLd` → injected on each article page (NewsArticle + BreadcrumbList)
 */

import { SOCIAL_LINKS } from '@/lib/social';

const SITE_URL = 'https://truerateliberia.com';
const SITE_NAME = 'TrueRate';

/* ── Shared logo reference ───────────────────────────────────────────── */

const logo = {
  '@type': 'ImageObject',
  url: `${SITE_URL}/icon-light.png`,
  width: 512,
  height: 512,
};

/* ── Enabled social profile URLs ─────────────────────────────────────── */

const sameAs = SOCIAL_LINKS.filter((s) => s.enabled).map((s) => s.href);

/* ── Site-wide JSON-LD (root layout) ─────────────────────────────────── */

const siteGraphItems = [
  // 1. Organization
  {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo,
    sameAs,
    description:
      'TrueRate is Liberia\u2019s financial intelligence platform \u2014 news, live market data, economic analytics, business, technology, and videos covering the economy, markets, and policy that shape the country.',
    foundingDate: '2026',
    founders: [{ '@type': 'Person', name: 'Moses Julian Sackey', jobTitle: 'Founder' }],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Monrovia',
      addressCountry: 'LR',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Liberia',
      sameAs: 'https://www.wikidata.org/wiki/Q1014',
    },
    knowsAbout: [
      'Liberia economy',
      'Liberian dollar exchange rate',
      'Liberia financial markets',
      'Central Bank of Liberia',
      'West Africa business',
      'Liberia technology',
      'Liberia banking',
      'Liberia policy',
      'Liberia startups',
    ],
  },
  // 2. NewsMediaOrganization (extends Organization for Google News)
  {
    '@type': 'NewsMediaOrganization',
    '@id': `${SITE_URL}/#newsMediaOrg`,
    name: SITE_NAME,
    url: SITE_URL,
    logo,
    sameAs,
    foundingDate: '2026',
    actionableFeedbackPolicy: `${SITE_URL}/feedback`,
    correctionsPolicy: `${SITE_URL}/about#standards`,
    ethicsPolicy: `${SITE_URL}/about#standards`,
    publishingPrinciples: `${SITE_URL}/about#standards`,
    masthead: `${SITE_URL}/about`,
    noBylinesPolicy: `${SITE_URL}/about#standards`,
  },
  // 3. WebSite (enables sitelinks search box in SERPs)
  {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/news?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
];

const siteJsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': siteGraphItems,
}).replace(/</g, '\\u003c');

export function SiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: siteJsonLdString }}
    />
  );
}

/* ── Per-article JSON-LD ─────────────────────────────────────────────── */

export interface ArticleJsonLdProps {
  title: string;
  description: string;
  slug: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  heroImage?: string;
  heroAlt?: string;
  categoryLabel?: string;
  categorySlug?: string;
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  publishedTime,
  modifiedTime,
  authorName,
  heroImage,
  heroAlt,
  categoryLabel,
  categorySlug,
}: ArticleJsonLdProps) {
  const articleUrl = `${SITE_URL}/news/${slug}`;

  const graph: Record<string, unknown>[] = [
    // NewsArticle
    {
      '@type': 'NewsArticle',
      '@id': `${articleUrl}#article`,
      headline: title,
      description,
      url: articleUrl,
      mainEntityOfPage: articleUrl,
      ...(publishedTime && { datePublished: publishedTime }),
      ...(modifiedTime && { dateModified: modifiedTime }),
      ...(authorName && {
        author: { '@type': 'Person', name: authorName },
      }),
      publisher: {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        logo,
      },
      ...(heroImage && {
        image: {
          '@type': 'ImageObject',
          url: heroImage,
          ...(heroAlt && { caption: heroAlt }),
        },
      }),
      ...(categoryLabel && {
        articleSection: categoryLabel,
      }),
      isAccessibleForFree: true,
    },
    // BreadcrumbList
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'News',
          item: `${SITE_URL}/news`,
        },
        ...(categorySlug && categoryLabel
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: categoryLabel,
                item: `${SITE_URL}/${categorySlug}`,
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: title,
              },
            ]
          : [
              {
                '@type': 'ListItem',
                position: 3,
                name: title,
              },
            ]),
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c'),
      }}
    />
  );
}
