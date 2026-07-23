import { useEffect, useState } from 'react'
import { motion, type Variants } from 'motion/react'
import type { HeroCarouselBlock } from '../../lib/data/blocks/hero-carousel'
import { textColorMap } from '../../lib/colour'
import HoverButton from './HoverButton'
import { img as cdnimg } from '../../lib/image'

const EASE = [0.16, 1, 0.3, 1] as const
const CYCLE_MS = 3000

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export default function HeroCarouselSection({
  heading,
  headingColor = 'blue',
  subheading,
  subheadingColor = 'darkBlue',
  buttons,
  images = [],
}: HeroCarouselBlock) {
  const [active, setActive] = useState(0)
  const n = images.length

  useEffect(() => {
    if (n <= 1) return
    const t = setInterval(() => setActive((a) => (a + 1) % n), CYCLE_MS)
    return () => clearInterval(t)
  }, [n])

  const rel = (i: number) => {
    let d = (i - active + n) % n
    if (d > n / 2) d -= n
    return d
  }

  const btnClass =
    'rounded-xl px-5 py-2.5 text-xs font-semibold md:text-sm transition-all duration-200 cursor-pointer'

  return (
    <section className="via-light-blue-shade/40 bg-gradient-to-b from-white from-5% via-45% to-white to-100% ...">
      <div className="section grid items-center gap-8 py-16 pb-0 lg:grid-cols-2 lg:gap-12">
        <motion.div
          className="order-2 flex flex-col gap-4 lg:order-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h2
            variants={item}
            className="text-h2 leading-tight whitespace-pre-line"
            style={{ color: textColorMap[headingColor] }}
          >
            {heading}
          </motion.h2>

          {subheading && (
            <motion.p
              variants={item}
              className="text-body max-w-md whitespace-pre-line"
              style={{ color: textColorMap[subheadingColor] }}
            >
              {subheading}
            </motion.p>
          )}

          {buttons && buttons.length > 0 && (
            <motion.div variants={item} className="mt-2 flex flex-wrap gap-3">
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
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="order-1 flex flex-col items-center gap-6 lg:order-2"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
        >
          <div className="relative flex h-80 w-full items-center justify-center md:h-[30rem]">
            <div className="bg-onda-blue/15 pointer-events-none absolute h-64 w-64 rounded-full blur-3xl md:h-80 md:w-80" />
            {images.map((img, i) => {
              if (!img.image?.url) return null
              const d = rel(i)
              const isCenter = d === 0
              const isSide = Math.abs(d) === 1
              const visible = isCenter || isSide

              return (
                <motion.div
                  key={i}
                  className="absolute flex h-full items-center justify-center"
                  style={{ width: '23rem', zIndex: isCenter ? 20 : 10 }}
                  animate={{
                    x: `${d * 17}rem`,
                    scale: isCenter ? 1 : 0.6,
                    opacity: visible ? (isCenter ? 1 : 0.45) : 0,
                  }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <img
                    src={cdnimg(img.image.url, 1200)}
                    alt={img.image.alt ?? heading}
                    className="max-h-full max-w-full object-contain drop-shadow-xl"
                    loading="lazy"
                  />
                </motion.div>
              )
            })}
          </div>

          {n > 1 && (
            <div className="flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Produk ${i + 1}`}
                  className="bg-onda-blue h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? '1.5rem' : '0.5rem',
                    opacity: i === active ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
