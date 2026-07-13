import type { APIRoute } from 'astro'
import { getNewsList } from '../lib/data/onda-news'

export const prerender = false

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href ?? 'https://onda.id/'
  const news = await getNewsList()

  const urls = news
    .map((n) => {
      const loc = esc(new URL(`/news/${n.slug}`, base).href)
      const lastmod = n.date ? `\n    <lastmod>${new Date(n.date).toISOString()}</lastmod>` : ''
      return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
