import { fetchGlobal } from '../payload'

export interface SeoSettings {
  siteName: string
  titleTemplate: string
  defaultDescription: string
  defaultOgImage?: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
}

interface ResolvedSeo {
  title: string
  description: string
  ogImage: string
  ogImageWidth: number
  ogImageHeight: number
  siteName: string
  titleTemplate: string
}

interface PageSeoOverride {
  title?: string
  description?: string
  ogImage?: string
  ogImageWidth?: number
  ogImageHeight?: number
  noIndex?: boolean
}

export async function resolveSeo(override: PageSeoOverride = {}): Promise<ResolvedSeo> {
  const cms = await fetchGlobal<SeoSettings>('seo-settings')

  return {
    siteName: cms?.siteName ?? '',
    titleTemplate: cms?.titleTemplate ?? '%s',
    description: override.description ?? cms?.defaultDescription ?? '',
    ogImage: override.ogImage ?? cms?.defaultOgImage?.url ?? '',
    ogImageWidth: override.ogImageWidth ?? cms?.defaultOgImage?.width ?? 1200,
    ogImageHeight: override.ogImageHeight ?? cms?.defaultOgImage?.height ?? 630,
    title: override.title ?? '',
  }
}
