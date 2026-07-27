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
    preview: d.NewsPreview,
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
  const d = new Date(iso)
  const tgl = d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
  const jam = d
    .toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    })
    .replace(':', '.')
  return `${tgl}, ${jam} WIB`
}
