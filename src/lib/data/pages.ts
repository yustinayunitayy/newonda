import { fetchFromCMS } from '../payload'

export interface MediaFile {
  url: string
  alt?: string
  streamUid?: string
}

type TextColor = 'white' | 'black' | 'blue' | 'yellow'
export type ButtonVariant =
  | 'blue'
  | 'blue-outline'
  | 'white'
  | 'white-outline'
  | 'yellow'
  | 'transparent'
type ButtonType = 'link' | 'scroll'

export interface HeroButton {
  text: string
  type: ButtonType
  url?: string
  scrollTarget?: string
  variant: ButtonVariant
}

export interface HeroBlock {
  blockType: 'hero'
  mediaType: 'video' | 'image'
  video?: MediaFile
  image?: MediaFile
  headingText: string
  headingTextColor: TextColor
  subheadingText?: string
  subheadingTextColor?: TextColor
  buttonEnabled: boolean
  buttons?: HeroButton[]
}

export type PageBlock = HeroBlock

export interface Page {
  id: number
  title: string
  slug: string
  blocks: PageBlock[]
}

interface PayloadResponse<T> {
  docs: T[]
}

export async function getPage(slug: string) {
  const data = await fetchFromCMS<PayloadResponse<Page>>({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return data?.docs[0] ?? null
}
