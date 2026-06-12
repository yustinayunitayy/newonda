import type { ButtonVariant } from './data/pages'

export const textColorMap = {
  white: '#ffffff',
  black: '#000000',
  blue: 'var(--color-onda-blue)',
  yellow: 'var(--color-onda-yellow)',
} as const

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
    background: 'rgba(254,221,0,0.1)',
    color: 'var(--color-onda-yellow)',
    border: '1px solid #fedd00',
  },
  transparent: {
    background: 'transparent',
    color: '#ffffff',
    border: 'none',
  },
}
