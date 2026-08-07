import type { TextColor } from '../../colour'

export type CategoryAnchor = 'kran' | 'shower' | 'valve' | 'water-meter' | 'plumbing' | 'aksesoris'

export interface CategoryTile {
  anchorId: CategoryAnchor
  title: string
  subtypes?: string
  size?: 'normal' | 'wide'
  tone?: 'light' | 'navy' | 'yellow'
  linkText?: string
  linkUrl?: string
}

export interface CategoryExplorerBlock {
  blockType: 'category-explorer'
  miniLabel?: string
  labelTextColor?: TextColor
  heading: string
  headingTextColor?: TextColor
  subheading?: string
  subheadingTextColor?: TextColor
  groups: CategoryTile[]
}
