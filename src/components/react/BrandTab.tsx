import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { BrandTabsBlock } from '../../lib/data/blocks/brand-tab'
import { buttonClassMap } from '../../lib/colour'

const btnBase =
  'rounded-xl px-5 py-2.5 text-xs font-semibold md:text-sm transition-all duration-200 cursor-pointer'

export default function BrandTabs({ heading, subheading, tabs }: BrandTabsBlock) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = tabs[activeIndex]

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
            <p className="text-dark-blue-shade text-justify text-sm md:text-center md:text-base">
              {subheading}
            </p>
          )}
        </div>
      )}

      <div
        role="tablist"
        aria-label="Brand tabs"
        className="mb-5 grid overflow-hidden rounded-2xl bg-white"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={activeIndex === i}
            aria-controls={`brand-panel-${i}`}
            id={`brand-tab-${i}`}
            onClick={() => setActiveIndex(i)}
            className={[
              'relative cursor-pointer py-2.5 text-xs font-semibold transition-all duration-200 md:py-4 md:text-sm',
              i < tabs.length - 1 ? 'border-onda-blue/20 border-r' : '',
              activeIndex === i
                ? 'bg-onda-blue text-white'
                : 'text-onda-blue hover:bg-onda-blue/5 bg-white',
            ].join(' ')}
          >
            {tab.tabLabel}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`brand-panel-${activeIndex}`}
        aria-labelledby={`brand-tab-${activeIndex}`}
        className="overflow-hidden rounded-2xl bg-white shadow-lg"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row"
          >
            {/* Image */}
            {active.image && (
              <div className="w-full shrink-0 md:w-[50%]">
                <img
                  src={`${active.image.url}?quality=85&width=800`}
                  alt={active.image.alt ?? active.brandName ?? active.tabLabel}
                  className="h-30 w-full object-cover object-center md:h-80"
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
                <p className="text-dark-blue-shade text-sm leading-relaxed md:text-base">
                  {active.description}
                </p>
              )}

              {active.buttonEnabled && active.buttons && active.buttons.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {active.buttons.map((btn, i) =>
                    btn.buttonType === 'scroll' ? (
                      <button
                        key={i}
                        className={`${btnBase} ${buttonClassMap[btn.variant]}`}
                        onClick={() =>
                          document
                            .getElementById(btn.scrollTarget ?? '')
                            ?.scrollIntoView({ behavior: 'smooth' })
                        }
                      >
                        {btn.text}
                      </button>
                    ) : (
                      <a
                        key={i}
                        href={btn.url}
                        target={btn.openInNewTab ? '_blank' : undefined}
                        rel={btn.openInNewTab ? 'noopener noreferrer' : undefined}
                        className={`${btnBase} ${buttonClassMap[btn.variant]}`}
                      >
                        {btn.text}
                      </a>
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
