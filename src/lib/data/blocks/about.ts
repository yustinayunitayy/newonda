import type { TextColor } from '../../colour'

export interface TimelineBlock {
  blockType: 'timeline'
  heading?: string
  headingTextColor?: TextColor
  subheading?: string
  subheadingTextColor?: TextColor
  events: {
    year: string
    title: string
    description?: string
    icon: string
    side?: 'left' | 'right'
  }[]
}
export interface CertificationsBlock {
  blockType: 'certifications'
  heading?: string
  headingTextColor?: TextColor
  subheading?: string
  subheadingTextColor?: TextColor
  awardsHeading?: string
  awards?: { image?: { url: string; alt?: string }; label?: string; year?: string }[]
  certsHeading?: string
  certs?: { image?: { url: string; alt?: string }; title: string; description?: string }[]
  warrantyBadge?: { years?: number; heading?: string; caption?: string }
}
