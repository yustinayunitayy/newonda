import type { ButtonVariant } from '../button'

export interface FaqButton {
  text: string
  variant: ButtonVariant
  url?: string
  openInNewTab?: boolean
}

export interface FaqItem {
  question: string
  answer: any
}

export interface FaqBlock {
  blockType: 'faq-accordion'
  miniLabel?: string
  heading?: string
  description?: string
  buttonEnabled?: boolean
  buttons?: FaqButton[]
  items: FaqItem[]
}
