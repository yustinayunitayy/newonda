import { fetchFromCMS } from '../payload'

export interface BrandVideoItem {
  videoId: string
  thumbnail?: string
  title: string
}

type BrandSlug = 'onda' | 'onda-valve' | 'onda-exclusive'

export function toBrandVideoItems(docs: any[]): BrandVideoItem[] {
  return (docs ?? [])

    .filter((d) => typeof d === 'object' && d?.stream?.videoId)
    .map((d) => ({
      videoId: d.stream.videoId as string,
      thumbnail: (d.stream.thumbnailUrl as string | undefined) ?? undefined,
      title: d.title as string,
    }))
}

export async function getBrandVideos(brand?: BrandSlug): Promise<BrandVideoItem[]> {
  const data = await fetchFromCMS<{ docs: any[] }>({
    collection: 'brand-video',
    where: brand ? { brand } : undefined,
    limit: 50,
    sort: '-createdAt',
  })

  return toBrandVideoItems(data?.docs ?? [])
}

export const STREAM_BASE = `https://customer-${import.meta.env.CF_CUSTOMER}.cloudflarestream.com`
