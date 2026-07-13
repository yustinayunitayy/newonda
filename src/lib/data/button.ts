export type ButtonVariant =
  | 'blue'
  | 'blue-outline'
  | 'blue-text'
  | 'white'
  | 'white-outline'
  | 'yellow'
  | 'yellow-outline'
  | 'transparent'

export type ButtonType = 'link' | 'scroll'

export interface ButtonField {
  text: string
  buttonType: ButtonType
  url?: string
  scrollTarget?: string
  openInNewTab?: boolean
  variant: ButtonVariant
}
