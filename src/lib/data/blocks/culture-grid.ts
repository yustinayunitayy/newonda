import type { TextColor } from '../../colour'
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
  labelTextColor?: TextColor
  heading?: string
  headingTextColor?: TextColor
  items: CultureItem[]
}
