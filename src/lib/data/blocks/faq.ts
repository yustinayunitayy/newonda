import type { ButtonField } from '../button'

export interface FaqItem {
  question: string
  answer: any
}

export interface FaqBlock {
  blockType: 'faq-accordion'
  miniLabel: string
  heading: string
  description: string
  buttonEnabled?: boolean
  buttons?: ButtonField[]
  items: FaqItem[]
}
