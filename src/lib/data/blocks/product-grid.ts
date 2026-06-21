export interface ProductGridItem {
  image?: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  label?: string
  description?: string
}

export interface ProductGridBlock {
  blockType: 'product-grid'
  miniLabel?: string
  heading?: string
  subheading?: string
  items: ProductGridItem[]
}
