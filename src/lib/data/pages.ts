import { fetchFromCMS } from '../payload'
import type { HeroBlock } from './blocks'
import type { StatsBarBlock } from './blocks'

export type PageBlock = HeroBlock | StatsBarBlock

export interface Page {
  id: number
  title: string
  slug: string
  meta?: {
    title?: string
    description?: string
    image?: { url: string }
  }
  blocks: PageBlock[]
}
export async function getPage(slug: string) {
  const data = await fetchFromCMS<{ docs: Page[] }>({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return data?.docs[0] ?? null
}
