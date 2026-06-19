import type { ButtonVariant } from './data/blocks'

export const textColorMap = {
  white: '#ffffff',
  black: '#000000',
  blue: 'var(--color-onda-blue)',
  yellow: 'var(--color-onda-yellow)',
} as const

export const textPositionMap: Record<
  string,
  { justifyContent: string; alignItems: string; textAlign: string; maxWidth: string; gap: string }
> = {
  'center-left': {
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
    maxWidth: '26rem',
    gap: '0.75rem',
  },
  'center-center': {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 'none',
    gap: '0.5rem',
  },
  'center-right': {
    justifyContent: 'center',
    alignItems: 'flex-end',
    textAlign: 'right',
    maxWidth: '26rem',
    gap: '0.75rem',
  },
  'bottom-center': {
    justifyContent: 'flex-end',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 'none',
    gap: '0.5rem',
  },
}

export const buttonClassMap: Record<ButtonVariant, string> = {
  blue: 'bg-onda-blue text-white border-none hover:brightness-110 hover:-translate-y-px hover:shadow-lg',
  'blue-outline':
    'bg-transparent text-onda-blue border-2 border-onda-blue hover:bg-onda-blue hover:text-white hover:-translate-y-px',
  'blue-text': 'bg-transparent text-onda-blue border-none hover:underline hover:opacity-80',
  white: 'bg-white text-onda-blue border-none hover:-translate-y-px hover:shadow-lg',
  'white-outline':
    'bg-white/15 text-white border border-white/50 hover:bg-white/[0.28] hover:-translate-y-px',
  yellow:
    'bg-onda-yellow text-onda-blue border-none hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(254,221,0,0.3)]',
  'yellow-outline':
    'bg-onda-yellow/10 text-onda-yellow font-bold border border-onda-yellow hover:bg-onda-yellow hover:text-onda-blue hover:-translate-y-px',
  transparent: 'bg-transparent text-white border-none hover:bg-white/12 hover:-translate-y-px',
}
