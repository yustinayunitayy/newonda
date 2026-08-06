import { fetchFromCMS } from '../payload'

export type SiteType = 'official' | 'prodcast'
export type MenuItemType = 'link' | 'product'
export type DisplayType = 'mega' | 'dropdown'
export type SourceType = 'all-brands'

export interface MenuItem {
  id: string
  label: string
  type: MenuItemType
  link?: string
  display?: DisplayType
  source?: SourceType
}

export interface Navigation {
  id: string
  name: string
  site: SiteType
  menu: MenuItem[]
}

interface PayloadResponse<T> {
  docs: T[]
}
export async function getNavigation(site: SiteType = 'official') {
  const data = await fetchFromCMS<PayloadResponse<Navigation>>({
    collection: 'navigations',
    where: { site: { equals: site } },
    limit: 1,
  })
  return data?.docs[0] ?? null
}
