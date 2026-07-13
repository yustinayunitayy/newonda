import type { ButtonField } from '../button'
import type { TextColor } from '../../colour'

export interface HeroCarouselBlock {
  blockType: 'brand-slider'
  heading: string
  headingColor?: TextColor
  subheading?: string
  subheadingColor?: TextColor
  buttons?: ButtonField[]
  images?: { image: { url: string; alt?: string } }[]
}
