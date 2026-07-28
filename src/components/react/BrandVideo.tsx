import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { textColorMap, type TextColor } from '../../lib/colour'

const EASE = [0.16, 1, 0.3, 1] as const

type Video = {
  videoId: string
  title?: string
  thumbnail?: string
}

type Props = {
  heading?: string
  headingColor?: TextColor
  videos: Video[]
  streamBase: string
}

export default function BrandVideoGrid({
  heading = 'Jelajahi Produk Kami',
  headingColor = 'blue',
  videos = [],
  streamBase,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const thumb = (v: Video) =>
    v.thumbnail || `${streamBase}/${v.videoId}/thumbnails/thumbnail.jpg?time=2s&height=600`
  const iframe = (id: string) => `${streamBase}/${id}/iframe`

  return (
    <section className="section">
      {heading && (
        <motion.h2
          className="text-h2 mb-8"
          style={{ color: textColorMap[headingColor] }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {heading}
        </motion.h2>
      )}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {videos.map((v, i) => (
          <motion.button
            key={v.videoId}
            onClick={() => setActiveId(v.videoId)}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100"
            aria-label={`Putar ${v.title ?? 'video'}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
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
        ))}
      </div>

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
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
