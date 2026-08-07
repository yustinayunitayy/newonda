import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { BrandTabsBlock } from '../../lib/data/blocks/brand-tab'
import { textPositionMap } from '../../lib/colour'
import { ButtonGroup } from './HoverButton'
import { img } from '../../lib/image'

export default function BrandTabs({
  heading,
  subheading,
  textAlign = 'center-center',
  tabs,
}: BrandTabsBlock) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = tabs[activeIndex]
  const position = textPositionMap[textAlign] ?? textPositionMap['center-center']

  const btnClass =
    'rounded-xl px-5 py-2.5 text-button font-semibold transition-all duration-200 cursor-pointer active:scale-[0.98]'

  const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.2 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }

  const textAlignStyle = position.textAlign as React.CSSProperties['textAlign']

  return (
    <section className="section w-full">
      {(heading || subheading) && (
        <motion.div
          {...reveal}
          className="mb-10 flex flex-col gap-3"
          style={{ alignItems: position.alignItems }}
        >
          {heading && (
            <h2
              className="text-h2 text-onda-blue"
              style={{ textAlign: textAlignStyle, maxWidth: position.maxWidth }}
            >
              {heading}
            </h2>
          )}
          {subheading && (
            <p
              className="text-body text-dark-blue-shade max-w-5xl"
              style={{ textAlign: textAlignStyle }}
            >
              {subheading}
            </p>
          )}
        </motion.div>
      )}

      <motion.div
        {...reveal}
        className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="text-button relative cursor-pointer px-2 py-4 font-semibold transition-all duration-200"
            style={{
              background: activeIndex === i ? 'var(--color-onda-blue)' : '#ffffff',
              color: activeIndex === i ? '#ffffff' : 'var(--color-onda-blue)',
              borderRight: i < tabs.length - 1 ? '1px solid #e5e7eb' : 'none',
            }}
          >
            {tab.tabLabel}
          </button>
        ))}
      </motion.div>

      {/* Content card */}
      <motion.div
        {...reveal}
        className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row">
          {active.image && (
            <div className="w-full shrink-0 md:w-[50%]">
              <img
                src={img(active.image.url, 800)}
                alt={active.image.alt ?? active.brandName ?? active.tabLabel}
                className="h-56 w-full object-cover object-center md:h-105"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
              >
                {active.brandName && <h3 className="text-h3 text-onda-blue">{active.brandName}</h3>}
                {active.description && (
                  <p className="text-body text-dark-blue-shade">{active.description}</p>
                )}

                {active.buttonEnabled && active.buttons && active.buttons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-3">
                    {active.buttonEnabled && active.buttons && active.buttons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-3">
                        <ButtonGroup buttons={active.buttons} className={btnClass} />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
