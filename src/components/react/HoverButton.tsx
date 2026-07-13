import { useState } from 'react'
import type { ButtonVariant } from '../../lib/data/button'
import { buttonVariants } from '../../lib/colour'

type Props = {
  variant: ButtonVariant
  onClick?: () => void
  href?: string
  target?: string
  children: React.ReactNode
  className: string
}

export default function HoverButton({
  variant,
  onClick,
  href,
  target,
  children,
  className,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const { base, hover } = buttonVariants[variant]
  const style = { ...base, ...(hovered ? hover : {}) }

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={className}
        style={style}
        {...handlers}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={className} style={style} onClick={onClick} {...handlers}>
      {children}
    </button>
  )
}
