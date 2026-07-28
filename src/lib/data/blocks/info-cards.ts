import type { TextColor, textPosition } from '../../colour'

export interface InfoCard {
  background?: 'white' | 'light' | 'transparent'
  icon: string
  title: string
  content?: any
}

export interface InfoCardsBlock {
  blockType: 'info-cards'
  miniLabel?: string
  labelTextColor?: TextColor
  heading?: string
  headingTextColor?: TextColor
  subheading?: string
  subheadingTextColor?: TextColor
  style?: 'icon-top' | 'icon-left'
  columns?: '2' | '3' | '4'
  textAlign?: textPosition
  iconColor?: TextColor
  anchorId?: string
  cards: InfoCard[]
}
