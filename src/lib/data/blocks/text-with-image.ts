import type { ButtonField } from '../button'
import type { TextColor } from '../../colour'

export interface TextWithImageBlock {
  blockType: 'text-with-image'
  enableSectionId?: boolean
  sectionId?: string
  layout: 'text-left' | 'text-right'
  miniLabel?: string
  labelTextColor?: TextColor
  heading: string
  headingTextColor?: TextColor
  body: string
  bodyTextColor?: TextColor
  buttonEnabled?: boolean
  buttons?: ButtonField[]
  image: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
}
