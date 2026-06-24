import type { ButtonField } from '../button'
import type { TextColor, textPosition } from '../../colour'

export interface HeroBlock {
  blockType: 'hero'
  mediaType: 'video' | 'image'
  video?: { url: string; alt?: string }
  image?: { url: string; alt?: string }
  headingText: string
  headingTextColor?: TextColor
  subheadingText?: string
  subheadingTextColor?: TextColor
  textAlign: textPosition
  buttonEnabled: boolean
  buttons?: ButtonField[]
}
