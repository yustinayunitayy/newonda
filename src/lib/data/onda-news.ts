import { fetchFromCMS, getOne } from '../payload'

export interface NewsCategory {
  name: string
  slug: string
}

export interface NewsItem {
  id: number
  slug: string
  title: string
  preview?: string
  categories: NewsCategory[]
  coverUrl?: string
  date?: string
}

export interface NewsDetail extends NewsItem {
  description: any
}

function textOf(node: any): string {
  if (typeof node?.text === 'string') return node.text
  if (Array.isArray(node?.children)) return node.children.map(textOf).join('')
  return ''
}

function previewOf(d: any): string | undefined {
  let text = (d.NewsPreview ?? '').trim()
  if (!text) {
    const children = d.Description?.root?.children
    if (Array.isArray(children)) {
      for (const node of children) {
        if (node?.type !== 'paragraph') continue
        const t = textOf(node).trim()
        if (t) {
          text = t
          break
        }
      }
    }
  }
  if (!text) return undefined
  if (text.length <= 160) return text
  const cut = text.slice(0, 160)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

function mapCategories(cat: any): NewsCategory[] {
  if (!Array.isArray(cat)) return []
  return cat
    .filter((c) => typeof c === 'object' && c)
    .map((c) => ({ name: c.NewsCategory as string, slug: c.slug as string }))
}

function coverOf(d: any): string | undefined {
  return typeof d.CoverImage === 'object' ? (d.CoverImage?.url as string | undefined) : undefined
}

function toItem(d: any): NewsItem {
  return {
    id: d.id,
    slug: d.slug ?? String(d.id),
    title: d.NewsTitle,
    preview: previewOf(d),
    categories: mapCategories(d.Category),
    coverUrl: coverOf(d),
    date: d.createdAt,
  }
}

export async function getNewsList(): Promise<NewsItem[]> {
  const data = await fetchFromCMS<{ docs: any[] }>({
    collection: 'onda-news',
    limit: 100,
    depth: 1,
    sort: '-createdAt',
  })
  return (data?.docs ?? []).map(toItem)
}

export async function getNewsBySlug(slug: string): Promise<NewsDetail | null> {
  const doc = await getOne<any>('onda-news', { slug: { equals: slug } }, 1)
  if (!doc) return null
  return { ...toItem(doc), description: doc.Description }
}

export async function getNewsCategories(): Promise<NewsCategory[]> {
  const data = await fetchFromCMS<{ docs: any[] }>({
    collection: 'onda-news-category',
    limit: 50,
    sort: 'NewsCategory',
  })
  return (data?.docs ?? []).map((c) => ({ name: c.NewsCategory as string, slug: c.slug as string }))
}

export function formatNewsDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}
