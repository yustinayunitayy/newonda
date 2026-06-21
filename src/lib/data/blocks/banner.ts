import type { ButtonField } from '../button'

export interface BannerBlock {
  blockType: 'banner'
  miniLabel?: string
  heading: string
  subheading?: string
  textAlign?: 'center-left' | 'center-center' | 'center-right' | 'bottom-center'
  backgroundImage?: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  overlayColor?: 'none' | 'black' | 'blue'
  overlayOpacity?: number
  buttons?: ButtonField[]
}
