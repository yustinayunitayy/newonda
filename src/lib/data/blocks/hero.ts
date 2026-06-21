import type { ButtonField, ButtonType } from '../button'

export interface MediaFile {
  url: string
  alt?: string
  streamUid?: string
}

export interface HeroBlock {
  blockType: 'hero'
  mediaType: 'video' | 'image'
  video?: { url: string; alt?: string }
  image?: { url: string; alt?: string }
  headingText: string
  headingTextColor: 'white' | 'black' | 'blue' | 'yellow'
  subheadingText?: string
  subheadingTextColor?: 'white' | 'black' | 'blue' | 'yellow'
  textAlign?: 'center-left' | 'center-center' | 'center-right' | 'bottom-center'
  buttonEnabled: boolean
  buttons?: ButtonField[]
}
