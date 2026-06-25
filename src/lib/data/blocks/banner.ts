import type { ButtonField } from '../button'
import type { TextColor, textPosition } from '../../colour'

export interface BannerBlock {
  blockType: 'banner'
  miniLabel?: string
  labelTextColor?: TextColor
  heading: string
  headingTextColor: TextColor
  subheading?: string
  subheadingTextColor?: TextColor
  textAlign: textPosition
  backgroundImage: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  overlayColor?: 'none' | 'black' | 'blue'
  overlayOpacity?: number
  buttons?: ButtonField[]
}
