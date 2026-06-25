import { fetchFromCMS } from '../payload'

export interface StoreItem {
  storeName: string
  address: string
}

export async function getStores(): Promise<StoreItem[]> {
  const data = await fetchFromCMS<{ docs: any[] }>({
    collection: 'stores',
    limit: 500,
    sort: 'storeName',
  })

  return (data?.docs ?? []).map((d) => ({
    storeName: d.storeName as string,
    address: d.address as string,
  }))
}
