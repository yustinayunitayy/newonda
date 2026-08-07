import type { TextColor } from '../../colour'

export interface TestimonialItem {
  quote: string
  name: string
  position?: string
  avatar?: { url?: string }
}

export interface TestimonialsBlock {
  blockType: 'testimonials'
  miniLabel?: string
  labelTextColor?: TextColor
  heading?: string
  headingTextColor?: TextColor
  items: TestimonialItem[]
}
