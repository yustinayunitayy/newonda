import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getNewsList } from '../lib/data/onda-news'
import { img } from '../lib/image'

export const prerender = false

export async function GET(context: APIContext) {
  const news = await getNewsList()

  return rss({
    title: 'Berita & Artikel ONDA',
    description: 'Kabar terbaru, tips, dan inspirasi seputar dunia sanitary & plumbing dari ONDA.',
    site: context.site?.href ?? 'https://onda.id/',
    items: news.map((n) => ({
      title: n.title,
      description: n.preview ?? n.subtitle ?? '',
      link: `/news/${n.slug}`,
      pubDate: n.date ? new Date(n.date) : undefined,
      content: n.coverUrl
        ? `<img src="${img(n.coverUrl, 1200)}" alt="${n.title}" /><p>${n.preview ?? n.subtitle ?? ''}</p>`
        : undefined,
    })),
    customData: '<language>id-ID</language>',
  })
}
