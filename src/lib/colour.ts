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
    background: 'rgba(254,221,0,0.1)',
    color: 'var(--color-onda-yellow)',
    fontWeight: '700',
    border: '1px solid var(--color-onda-yellow)',
  },
  transparent: {
    background: 'transparent',
    color: '#ffffff',
    border: 'none',
  },
}

export const buttonHoverStyleMap: Record<ButtonVariant, React.CSSProperties> = {
  blue: {
    filter: 'brightness(1.15)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
  },
  'blue-outline': {
    background: 'var(--color-onda-blue)',
    color: '#ffffff',
    transform: 'translateY(-1px)',
  },
  'blue-text': {
    textDecoration: 'underline',
    opacity: 0.8,
  },
  white: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
  'white-outline': {
    background: 'rgba(255,255,255,0.28)',
    transform: 'translateY(-1px)',
  },
  yellow: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 16px rgba(254,221,0,0.3)',
  },
  'yellow-outline': {
    background: 'var(--color-onda-yellow)',
    color: 'var(--color-onda-blue)',
    transform: 'translateY(-1px)',
  },
  transparent: {
    background: 'rgba(255,255,255,0.12)',
    transform: 'translateY(-1px)',
  },
}
