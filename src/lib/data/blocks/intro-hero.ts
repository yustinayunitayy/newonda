export interface MediaFile {
  url: string
  alt?: string
  streamUid?: string
}

export type ButtonVariant =
  | 'blue'
  | 'blue-outline'
  | 'white'
  | 'white-outline'
  | 'yellow'
  | 'transparent'

export interface HeroButton {
  text: string
  type: 'link' | 'scroll'
  url?: string
  scrollTarget?: string
  variant: ButtonVariant
}

export interface HeroBlock {
  blockType: 'intro-hero'
  mediaType: 'video' | 'image'
  video?: { url: string; alt?: string }
  image?: { url: string; alt?: string }
  headingText: string
  headingTextColor: 'white' | 'black' | 'blue' | 'yellow'
  subheadingText?: string
  subheadingTextColor?: 'white' | 'black' | 'blue' | 'yellow'
  buttonEnabled: boolean
  buttons?: HeroButton[]
}
