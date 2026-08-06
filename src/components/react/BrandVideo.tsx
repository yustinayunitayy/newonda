import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { resolveColor, type TextColor } from '../../lib/colour'
import type { BrandVideoItem } from '../../lib/data/brand-video'

const EASE = [0.16, 1, 0.3, 1] as const

type Props = {
  heading?: string
  headingColor?: TextColor
  videos: BrandVideoItem[]
  streamBase: string
}

export default function BrandVideoGrid({
  heading = 'Jelajahi Produk Kami',
  headingColor = 'blue',
  videos = [],
  streamBase,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const sorted = [...videos].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  )
  const [paused, setPaused] = useState(false)
  const isSlider = sorted.length > 4
  const scroll = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({
      left: dir * trackRef.current.clientWidth * 0.9,
      behavior: 'smooth',
    })
  useEffect(() => {
    if (!isSlider || activeId || paused) return
    const t = setInterval(() => {
      const el = trackRef.current
      if (!el) return
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
      else el.scrollBy({ left: el.clientWidth * 0.9, behavior: 'smooth' })
    }, 3000)
    return () => clearInterval(t)
  }, [isSlider, activeId, paused])
  const thumb = (v: BrandVideoItem) => {
    const time = v.brand === 'onda-exclusive' ? 'time=2s&' : ''
    return `${streamBase}/${v.videoId}/thumbnails/thumbnail.jpg?${time}height=600`
  }
  const iframe = (id: string) => `${streamBase}/${id}/iframe`

  const card = (v: BrandVideoItem, i: number, extra = '') => (
    <motion.button
      key={v.videoId}
      onClick={() => setActiveId(v.videoId)}
      className={`group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 ${extra}`}
      aria-label={`Putar ${v.title ?? 'video'}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.1, ease: EASE }}
    >
      <img
        src={thumb(v)}
        alt={v.title ?? ''}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="fill-onda-blue h-6 w-6">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      {v.title && (
        <span className="absolute inset-x-0 bottom-0 p-3 text-left text-sm font-semibold text-white drop-shadow">
          {v.title}
        </span>
      )}
    </motion.button>
  )

  return (
    <section className="section">
      <div className="mb-8 flex items-end justify-between gap-4">
        {heading && (
          <motion.h2
            className="text-h2"
            style={{ color: resolveColor(headingColor, 'blue') }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {heading}
          </motion.h2>
        )}
        {isSlider && (
          <div className="hidden flex-none gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Sebelumnya"
              className="border-onda-blue/30 text-onda-blue hover:bg-onda-blue flex h-10 w-10 items-center justify-center rounded-full border text-xl leading-none transition-colors hover:text-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Berikutnya"
              className="border-onda-blue/30 text-onda-blue hover:bg-onda-blue flex h-10 w-10 items-center justify-center rounded-full border text-xl leading-none transition-colors hover:text-white"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {isSlider ? (
        <div
          ref={trackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] lg:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {sorted.map((v, i) =>
            card(v, i, 'shrink-0 snap-start basis-[calc(50%-8px)] lg:basis-[calc(25%-18px)]')
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {sorted.map((v, i) => card(v, i))}
        </div>
      )}

      <AnimatePresence>
        {activeId && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveId(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveId(null)}
                aria-label="Tutup"
                className="text-onda-blue absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
              >
                ✕
              </button>
              <div className="aspect-video w-full">
                <iframe
                  src={iframe(activeId)}
                  className="h-full w-full"
                  allow="accelerated-2d-canvas; autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Video player"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
