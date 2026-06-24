import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { HeroCarouselBlock } from '../../lib/data/blocks/hero-carousel'
import { textColorMap } from '../../lib/colour'
import HoverButton from './HoverButton'

const AUTOPLAY_MS = 4000

export default function BrandSlider({
  miniLabel,
  miniLabelColor = 'blue',
  heading,
  headingColor = 'blue',
  subheading,
  subheadingColor = 'darkBlue',
  buttons,
  images = [],
}: HeroCarouselBlock) {
  const [index, setIndex] = useState(0)
  const count = images.length

  const go = useCallback((n: number) => setIndex((n + count) % count), [count])
  const next = useCallback(() => go(index + 1), [go, index])

  // autoplay (cuma gambarnya yang gerak)
  useEffect(() => {
    if (count <= 1) return
    const t = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [next, count])

  const btnClass =
    'rounded-xl px-5 py-2.5 text-xs font-semibold md:text-sm transition-all duration-200 cursor-pointer'

  return (
    <section className="from-light-blue-shade w-full overflow-x-clip bg-gradient-to-b to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-2 lg:gap-12">
        {/* ── Teks: TETAP, nggak ikut animasi ── */}
        <div className="flex flex-col gap-4">
          {miniLabel && (
            <p
              className="text-mini-label flex items-center gap-2"
              style={{ color: textColorMap[miniLabelColor] }}
            >
              <span className="bg-onda-blue inline-block h-px w-6" />
              {miniLabel}
            </p>
          )}

          <h2
            className="text-h2 leading-tight whitespace-pre-line"
            style={{ color: textColorMap[headingColor] }}
          >
            {heading}
          </h2>

          {subheading && (
            <p
              className="text-body max-w-md whitespace-pre-line"
              style={{ color: textColorMap[subheadingColor] }}
            >
              {subheading}
            </p>
          )}

          {buttons && buttons.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {buttons.map((btn, i) => {
                const isScroll = btn.buttonType === 'scroll'
                return (
                  <HoverButton
                    key={i}
                    className={btnClass}
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
            </div>
          )}
        </div>

        {/* ── Gambar: HANYA ini yang animasi/muter ── */}
        <div className="flex flex-col items-center gap-5 lg:items-end">
          <div className="relative flex h-64 w-full items-center justify-center md:h-80">
            <AnimatePresence mode="wait">
              {images[index]?.image?.url && (
                <motion.img
                  key={index}
                  src={images[index].image.url}
                  alt={images[index].image.alt ?? heading}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="max-h-full w-auto object-contain"
                  loading="lazy"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Dots + panah */}
          {count > 1 && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => go(index - 1)}
                aria-label="Sebelumnya"
                className="text-onda-blue/60 hover:text-onda-blue cursor-pointer transition-colors"
              >
                ‹
              </button>

              <div className="flex items-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Gambar ${i + 1}`}
                    className="bg-onda-blue h-2 rounded-full transition-all duration-300"
                    style={{
                      width: i === index ? '1.5rem' : '0.5rem',
                      opacity: i === index ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Berikutnya"
                className="text-onda-blue/60 hover:text-onda-blue cursor-pointer transition-colors"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
