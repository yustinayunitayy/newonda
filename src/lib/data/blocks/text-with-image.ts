import type { ButtonField } from '../button'

export interface TextWithImageBlock {
  blockType: 'text-with-image'
  enableSectionId?: boolean
  sectionId?: string
  layout: 'text-left' | 'text-right'
  miniLabel?: string
  heading: string
  body?: any
  buttonEnabled?: boolean
  buttons?: ButtonField[]
  image?: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
}
