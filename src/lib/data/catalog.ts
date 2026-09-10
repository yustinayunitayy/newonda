import { fetchFromCMS } from '../payload'

export interface CatalogItem {
  title: string
  fileUrl?: string
  coverUrl?: string
  anchor: string
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const ORDER = ['onda', 'exclusive', 'agen-teknik', 'pdam']
const rank = (anchor: string) => {
  const i = ORDER.indexOf(anchor)
  return i === -1 ? 99 : i
}

export async function getCatalogs(): Promise<CatalogItem[]> {
  const data = await fetchFromCMS<{ docs: any[] }>({
    collection: 'catalog',
    where: { id: { not_equals: 11 } },
    limit: 100,
    depth: 1,
  })

  return (data?.docs ?? [])
    .map((d) => ({
      title: d.title as string,
      fileUrl: typeof d.file === 'object' ? (d.file?.url as string | undefined) : undefined,
      coverUrl: typeof d.cover === 'object' ? (d.cover?.url as string | undefined) : undefined,
      anchor: (d.anchor as string | undefined) || slugify(d.title as string),
    }))
    .sort((a, b) => rank(a.anchor) - rank(b.anchor))
}
