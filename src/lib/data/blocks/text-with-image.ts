import type { ButtonVariant } from './hero'

export type ButtonType = 'link' | 'scroll'

export interface ButtonField {
  text: string
  buttonType: ButtonType
  url?: string
  scrollTarget?: string
  openInNewTab?: boolean
  variant: ButtonVariant
}

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
