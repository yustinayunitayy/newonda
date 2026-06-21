import type { ButtonField } from '../button'

export interface BrandTab {
  tabLabel: string
  image?: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  brandName?: string
  description?: string
  buttonEnabled?: boolean
  buttons?: ButtonField[]
}

export interface BrandTabsBlock {
  blockType: 'brand-tabs'
  heading?: string
  subheading?: string
  textAlign?: string
  tabs: BrandTab[]
}
