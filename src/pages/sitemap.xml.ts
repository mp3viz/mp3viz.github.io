import type { APIRoute } from 'astro';
import { LANGUAGES, getLocalizedPath } from '../i18n/translations';

const SITE_ORIGIN = 'https://mp3viz.github.io';
const ROUTES: Array<'' | 'how-to-use/' | 'hire-me/'> = ['', 'how-to-use/', 'hire-me/'];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0];

  const urlEntries = ROUTES.flatMap((route) => {
    const xDefaultHref = new URL(getLocalizedPath('en', route), SITE_ORIGIN).toString();
    const alternateLinks = [
      ...LANGUAGES.map(
        (lang) =>
          `    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${new URL(
            getLocalizedPath(lang.code, route),
            SITE_ORIGIN
          ).toString()}" />`
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultHref}" />`,
    ].join('\n');

    return LANGUAGES.map((lang) => {
      const loc = new URL(getLocalizedPath(lang.code, route), SITE_ORIGIN).toString();
      const priority = route === '' ? (lang.code === 'en' ? '1.0' : '0.9') : '0.8';
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>weekly</changefreq>',
        `    <priority>${priority}</priority>`,
        alternateLinks,
        '  </url>',
      ].join('\n');
    });
  }).join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
