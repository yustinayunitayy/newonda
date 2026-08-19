import type { TextColor } from '../../colour'

export interface JobsPreviewBlock {
  blockType: 'jobs-preview'
  miniLabel?: string
  labelTextColor?: TextColor
  heading: string
  headingTextColor?: TextColor
  subheading?: string
  subheadingTextColor?: TextColor
  linkText?: string
  linkUrl?: string
}
