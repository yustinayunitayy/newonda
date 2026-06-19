import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { BrandTabsBlock } from '../../lib/data/blocks/brand-tab'
import { buttonStyleMap, buttonHoverStyleMap } from '../../lib/colour'

function HoverButton({
  style,
  hoverStyle,
  onClick,
  href,
  target,
  children,
  className,
}: {
  style: React.CSSProperties
  hoverStyle: React.CSSProperties
  onClick?: () => void
  href?: string
  target?: string
  children: React.ReactNode
  className: string
}) {
  const [hovered, setHovered] = useState(false)
  const merged = { ...style, ...(hovered ? hoverStyle : {}) }

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={className}
        style={merged}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      className={className}
      style={merged}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  )
}

export default function BrandTabs({ heading, subheading, tabs }: BrandTabsBlock) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = tabs[activeIndex]

  const btnClass =
    'rounded-xl px-5 py-2.5 text-xs font-semibold md:text-sm transition-all duration-200 cursor-pointer'

  return (
    <section className="w-full px-10 py-2 md:px-24 md:py-16">
      {/* Heading */}
      {(heading || subheading) && (
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          {heading && (
            <h2 className="text-onda-blue text-justify text-xl leading-tight font-bold md:text-center md:text-4xl">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-justify text-base text-gray-500 md:text-center">{subheading}</p>
          )}
        </div>
      )}

      {/* Tab bar — unified segmented control */}
      <div
        className="mb-0 grid overflow-hidden rounded-2xl border border-b-0 border-gray-200 bg-white"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="relative cursor-pointer py-4 text-sm font-semibold transition-all duration-200"
            style={{
              background: activeIndex === i ? 'var(--color-onda-blue)' : '#ffffff',
              color: activeIndex === i ? '#ffffff' : 'var(--color-onda-blue)',
              borderRight: i < tabs.length - 1 ? '1px solid #e5e7eb' : 'none',
            }}
          >
            {tab.tabLabel}
          </button>
        ))}
      </div>

      {/* Content card */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row"
          >
            {/* Image — nempel ke card */}
            {active.image && (
              <div className="w-full shrink-0 md:w-[50%]">
                <img
                  src={`${active.image.url}?quality=85&width=800`}
                  alt={active.image.alt ?? active.brandName ?? active.tabLabel}
                  className="h-full w-full object-cover object-center"
                  style={{ height: '420px' }}
                  loading="lazy"
                />
              </div>
            )}

            {/* Text */}
            <div className="flex flex-1 flex-col justify-center gap-4 p-8 md:p-12">
              {active.brandName && (
                <h3 className="text-onda-blue text-xl font-bold md:text-2xl">{active.brandName}</h3>
              )}
              {active.description && (
                <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                  {active.description}
                </p>
              )}

              {active.buttonEnabled && active.buttons && active.buttons.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {active.buttons.map((btn, i) =>
                    btn.buttonType === 'scroll' ? (
                      <HoverButton
                        key={i}
                        className={btnClass}
                        style={buttonStyleMap[btn.variant]}
                        hoverStyle={buttonHoverStyleMap[btn.variant]}
                        onClick={() =>
                          document
                            .getElementById(btn.scrollTarget ?? '')
                            ?.scrollIntoView({ behavior: 'smooth' })
                        }
                      >
                        {btn.text}
                      </HoverButton>
                    ) : (
                      <HoverButton
                        key={i}
                        className={btnClass}
                        style={buttonStyleMap[btn.variant]}
                        hoverStyle={buttonHoverStyleMap[btn.variant]}
                        href={btn.url}
                        target={btn.openInNewTab ? '_blank' : undefined}
                      >
                        {btn.text}
                      </HoverButton>
                    )
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
