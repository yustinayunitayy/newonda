import type { CSSProperties } from 'react'
import type { ButtonVariant } from './data/button'
const C = {
  white: '#ffffff',
  black: '#000000',
  blue: 'var(--color-onda-blue)',
  yellow: 'var(--color-onda-yellow)',
  lightBlue: 'var(--color-light-blue-shade)',
  lightYellow: 'var(--color-light-yellow-shade)',
  darkBlue: 'var(--color-dark-blue-shade)',
} as const
export type TextColor = keyof typeof C
export const textColorMap: Record<string, string> = C
export function resolveColor(
  color: string | null | undefined,
  fallback: TextColor = 'blue'
): string {
  return C[color as TextColor] ?? C[fallback]
}
const lift = { transform: 'translateY(-1px)' } as const
type Position = 'center-left' | 'center-center' | 'center-right' | 'bottom-center'

type TextPosition = {
  justifyContent: string
  alignItems: string
  textAlign: string
  maxWidth: string
  gap: string
}

export const textPositionMap: Record<Position, TextPosition> = {
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
export type textPosition = keyof typeof textPositionMap
type ButtonStyle = { base: CSSProperties; hover: CSSProperties }

export const buttonVariants: Record<ButtonVariant, ButtonStyle> = {
  blue: {
    base: { background: C.blue, color: C.white, border: 'none' },
    hover: { ...lift, filter: 'brightness(1.15)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' },
  },
  'blue-outline': {
    base: { background: 'transparent', color: C.blue, border: `2px solid ${C.blue}` },
    hover: { ...lift, background: C.blue, color: C.white },
  },
  'blue-text': {
    base: { background: 'transparent', color: C.blue, border: 'none' },
    hover: { textDecoration: 'underline', opacity: 0.8 },
  },
  white: {
    base: { background: C.white, color: C.blue },
    hover: { ...lift, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' },
  },
  'white-outline': {
    base: {
      background: 'rgba(255,255,255,0.15)',
      color: C.white,
      border: '1px solid rgba(255,255,255,0.5)',
    },
    hover: { ...lift, background: 'rgba(255,255,255,0.28)' },
  },
  yellow: {
    base: { background: C.yellow, color: C.darkBlue, border: 'none' },
    hover: { ...lift, boxShadow: '0 4px 16px rgba(254,221,0,0.3)' },
  },
  'yellow-outline': {
    base: {
      background: 'rgba(254,221,0,0.1)',
      color: C.yellow,
      fontWeight: '700',
      border: `1px solid ${C.yellow}`,
    },
    hover: { ...lift, background: C.yellow, color: C.blue },
  },
  transparent: {
    base: { background: 'transparent', color: C.white, border: 'none' },
    hover: { ...lift, background: 'rgba(255,255,255,0.12)' },
  },
}
