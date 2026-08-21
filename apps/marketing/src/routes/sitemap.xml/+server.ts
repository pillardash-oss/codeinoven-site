import type { RequestHandler } from './$types';

export const prerender = true;

const SITE_URL = 'https://codeinoven.com';

const pages = [
	{ url: '', changefreq: 'weekly', priority: '1.0' },
	{ url: '/download', changefreq: 'weekly', priority: '0.9' },
	{ url: '/privacy', changefreq: 'monthly', priority: '0.5' }
];

export const GET: RequestHandler = async () => {
	const lastmod = new Date().toISOString().split('T')[0];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
