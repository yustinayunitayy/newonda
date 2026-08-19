import { fetchGlobal } from '../payload'

export interface PopupData {
  active?: boolean
  type?: 'promo' | 'newsletter'
  image?: {
    url: string
    alt?: string
  }
  heading?: string
  body?: string
  linkUrl?: string
  ctaLabel?: string
  source?: string
  hideForAds?: boolean
  startDate?: string
  endDate?: string
}

export async function fetchPopup(): Promise<PopupData | null> {
  return fetchGlobal<PopupData>('popup', 1)
}
