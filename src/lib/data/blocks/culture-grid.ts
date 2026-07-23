export interface CultureItem {
  coverImage?: { url?: string }
  title: string
  preview?: string
  content?: unknown
  gallery?: { image?: { url?: string } }[]
}

export interface CultureGridBlock {
  blockType: 'culture-grid'
  miniLabel?: string
  labelTextColor?: string
  heading?: string
  headingTextColor?: string
  items: CultureItem[]
}
