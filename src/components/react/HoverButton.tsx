import { useState } from 'react'
import type { ButtonVariant, ButtonField } from '../../lib/data/button'
import { buttonVariants } from '../../lib/colour'

export default function HoverButton({
  variant,
  onClick,
  href,
  target,
  children,
  className,
}: {
  variant: ButtonVariant
  onClick?: () => void
  href?: string
  target?: string
  children: React.ReactNode
  className: string
}) {
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

export function ButtonGroup({
  buttons,
  className,
}: {
  buttons?: ButtonField[]
  className: string
}) {
  if (!buttons?.length) return null
  return (
    <>
      {buttons.map((btn, i) => {
        const isScroll = btn.buttonType === 'scroll'
        return (
          <HoverButton
            key={i}
            className={className}
            variant={btn.variant}
            {...(isScroll
              ? {
                  onClick: () =>
                    document
                      .getElementById(btn.scrollTarget ?? '')
                      ?.scrollIntoView({ behavior: 'smooth' }),
                }
              : { href: btn.url, target: btn.openInNewTab ? '_blank' : undefined })}
          >
            {btn.text}
          </HoverButton>
        )
      })}
    </>
  )
}
