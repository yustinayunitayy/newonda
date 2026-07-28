import type { ButtonField } from '../button'
import type { TextColor } from '../../colour'

export interface HeroCarouselBlock {
  blockType: 'brand-slider'
  backgroundImage?: { url: string; alt?: string }
  overlayColor?: 'none' | 'black' | 'white' | 'blue'
  overlayOpacity?: number
  backgroundBlur?: 'none' | 'sm' | 'md' | 'lg'
  heading: string
  headingColor?: TextColor
  subheading?: string
  subheadingColor?: TextColor
  buttons?: ButtonField[]
  images?: { image: { url: string; alt?: string } }[]
}
