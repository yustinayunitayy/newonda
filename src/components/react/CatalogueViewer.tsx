import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { CatalogItem } from '../../lib/data/catalog'
import { img } from '../../lib/image'

const PdfFlipbook = lazy(() => import('./PdfFlipbook'))

type Props = {
  catalogs: CatalogItem[]
  storeUrl?: string
}

export default function CatalogueViewer({ catalogs = [], storeUrl }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const [highlighted, setHighlighted] = useState<number | null>(null)
  const current = active !== null ? catalogs[active] : null
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace('#', ''))
    if (!hash) return
    const idx = catalogs.findIndex((c) => c.anchor === hash)
    if (idx < 0) return
    if (window.innerWidth >= 768) setActive(idx)
    else setHighlighted(idx)
  }, [catalogs])

  useEffect(() => {
    if (active !== null) {
      const t = setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => clearTimeout(t)
    }
  }, [active])

  const toolBtn = 'rounded-md px-3 py-1.5 text-xs font-semibold transition'

  return (
    <section className="section pt-0 pb-16 md:pb-24">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {catalogs.map((c, i) => (
          <button
            key={i}
            id={c.anchor}
            onClick={() => {
              if (window.innerWidth < 768) {
                if (c.fileUrl) window.open(c.fileUrl, '_blank', 'noopener')
              } else {
                setActive(i)
              }
            }}
            className="group flex scroll-mt-28 flex-col gap-3 text-left focus:outline-none"
            aria-label={`Buka ${c.title}`}
          >
            <div
              className={`aspect-[3/4] overflow-hidden rounded-2xl shadow-md transition-all group-hover:-translate-y-1 group-hover:shadow-xl ${
                active === i || highlighted === i
                  ? 'ring-onda-blue shadow-xl ring-4 ring-offset-4'
                  : ''
              }`}
            >
              {c.coverUrl && (
                <img
                  src={img(c.coverUrl, 800)}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}
            </div>
            <span className="text-dark-blue-shade text-button text-center font-semibold">
              {c.title}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            ref={previewRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 scroll-mt-24 overflow-hidden"
          >
            <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <div className="bg-dark-blue-shade flex shrink-0 flex-wrap items-center justify-between gap-3 px-5 py-3 text-white">
                <span className="text-sm font-semibold">
                  Sedang dibaca: <span className="text-onda-yellow">{current.title}</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {storeUrl && (
                    <a
                      href={storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${toolBtn} text-onda-blue bg-white hover:brightness-95`}
                    >
                      Lihat Produknya di E-Store
                    </a>
                  )}
                  {current.fileUrl && (
                    <a
                      href={current.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${toolBtn} bg-onda-yellow text-onda-blue hover:brightness-95`}
                    >
                      Buka PDF di Tab Baru
                    </a>
                  )}
                  <button
                    onClick={() => setActive(null)}
                    className={`${toolBtn} border border-white/30 text-white hover:bg-red-500/90`}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1">
                {current.fileUrl ? (
                  <Suspense
                    fallback={
                      <p className="p-10 text-center text-sm text-gray-500">Menyiapkan viewer…</p>
                    }
                  >
                    <PdfFlipbook url={current.fileUrl} />
                  </Suspense>
                ) : (
                  <p className="p-8 text-center text-sm text-gray-500">PDF tidak tersedia.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
