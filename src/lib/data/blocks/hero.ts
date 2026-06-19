export interface MediaFile {
  url: string
  alt?: string
  streamUid?: string
}

export type ButtonVariant =
  | 'blue'
  | 'blue-outline'
  | 'blue-text'
  | 'white'
  | 'white-outline'
  | 'yellow'
  | 'yellow-outline'
  | 'transparent'

export interface HeroButton {
  text: string
  buttonType: 'link' | 'scroll'
  url?: string
  scrollTarget?: string
  openInNewTab?: boolean
  variant: ButtonVariant
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
  buttons?: HeroButton[]
}
