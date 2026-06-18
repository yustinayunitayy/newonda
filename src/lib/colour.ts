import type { ButtonVariant } from './data/blocks'

export const textColorMap = {
  white: '#ffffff',
  black: '#000000',
  blue: 'var(--color-onda-blue)',
  yellow: 'var(--color-onda-yellow)',
} as const

export const textPositionMap: Record<
  string,
  { justifyContent: string; alignItems: string; textAlign: string }
> = {
  'center-left': { justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' },
  'center-center': { justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
  'center-right': { justifyContent: 'center', alignItems: 'flex-end', textAlign: 'right' },
  'bottom-center': { justifyContent: 'flex-end', alignItems: 'center', textAlign: 'center' },
}

export const buttonStyleMap: Record<ButtonVariant, React.CSSProperties> = {
  blue: {
    background: 'var(--color-onda-blue)',
    color: '#ffffff',
    border: 'none',
  },
  'blue-outline': {
    background: 'transparent',
    color: 'var(--color-onda-blue)',
    border: '2px solid var(--color-onda-blue)',
  },
  'blue-text': {
    background: 'transparent',
    color: 'var(--color-onda-blue)',
    border: 'none',
  },
  white: {
    background: '#ffffff',
    color: 'var(--color-onda-blue)',
    border: 'none',
  },
  'white-outline': {
    background: 'rgba(255,255,255,0.15)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.5)',
  },
  yellow: {
    background: 'var(--color-onda-yellow)',
    color: 'var(--color-onda-blue)',
    border: 'none',
  },
  'yellow-outline': {
    background: 'transparent',
    color: 'var(--color-onda-yellow)',
    border: '1px solid var(--color-onda-yellow)',
  },
  transparent: {
    background: 'transparent',
    color: '#ffffff',
    border: 'none',
  },
}
