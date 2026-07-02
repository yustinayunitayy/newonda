import type { TextColor } from '../../colour'

export interface ProductGridItem {
  image?: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  label?: string
  description?: string
  link?: string
}

export interface ProductGridBlock {
  blockType: 'product-grid'
  miniLabel?: string
  labelTextColor?: TextColor
  heading: string
  headingTextColor?: TextColor
  subheading?: string
  subheadingTextColor?: TextColor
  items: ProductGridItem[]
}
