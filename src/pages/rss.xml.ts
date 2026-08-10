import type { APIContext } from 'astro'
import { getNewsList } from '../lib/data/onda-news'
import { img } from '../lib/image'

export const prerender = false

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET({ site }: APIContext) {
  const base = site?.href ?? 'https://onda.id/'
  const news = await getNewsList()

  const items = news
    .map((n) => {
      const url = new URL(`/news/${n.slug}`, base).href
      const pub = n.date ? `<pubDate>${new Date(n.date).toUTCString()}</pubDate>` : ''
      const body = `${n.coverUrl ? `<img src="${img(n.coverUrl, 1200)}" alt="${esc(n.title)}" />` : ''}<p>${esc(n.preview ?? '')}</p>`
      return `  <item>
    <title>${esc(n.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    ${pub}
    <description><![CDATA[${body}]]></description>
  </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Berita &amp; Artikel ONDA</title>
  <link>${base}</link>
  <description>Kabar terbaru, tips, dan inspirasi seputar dunia sanitary &amp; plumbing dari ONDA.</description>
  <language>id-ID</language>
  <atom:link href="${new URL('/rss.xml', base).href}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
