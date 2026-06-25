import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { CatalogItem } from '../../lib/data/catalog'
import PdfFlipbook from './PdfFlipbook'

type Props = {
  miniLabel?: string
  heading?: string
  subheading?: string
  catalogs: CatalogItem[]
}

export default function CatalogueViewer({
  miniLabel = 'Katalog Produk',
  heading = 'Jelajahi Katalog Produk Onda',
  subheading = 'Pilih katalog yang ingin dibaca',
  catalogs = [],
}: Props) {
  const [active, setActive] = useState<number | null>(null)
  const current = active !== null ? catalogs[active] : null
  const previewRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (active !== null) {
      const t = setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => clearTimeout(t)
    }
  }, [active])

  return (
    <section className="section py-16 md:py-24">
      <div className="mb-8">
        {miniLabel && <p className="text-mini-label text-onda-blue">{miniLabel}</p>}
        {heading && <h1 className="text-h2 text-onda-blue mt-1 font-extrabold">{heading}</h1>}
        {subheading && <p className="text-body text-dark-blue-shade mt-1">{subheading}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
        {catalogs.map((c, i) => (
          <button
            key={i}
            onClick={() => {
              if (window.innerWidth < 768) {
                if (c.fileUrl) window.open(c.fileUrl, '_blank', 'noopener')
              } else {
                setActive(i)
              }
            }}
            className="group flex flex-col gap-3 text-left"
            aria-label={`Buka ${c.title}`}
          >
            <div
              className={`aspect-[3/4] overflow-hidden rounded-2xl border-2 shadow-md transition-all group-hover:-translate-y-1 group-hover:shadow-xl ${
                active === i ? 'border-onda-blue shadow-xl' : 'border-transparent'
              }`}
            >
              {c.coverUrl && (
                <img
                  src={c.coverUrl}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}
            </div>
            <span className="text-dark-blue-shade text-center text-sm font-semibold">
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
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="bg-dark-blue-shade flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-white">
                <span className="text-sm font-semibold">
                  Sedang dibaca: <span className="text-onda-yellow">{current.title}</span>
                </span>
                <div className="flex items-center gap-2">
                  {current.fileUrl && (
                    <>
                      <a
                        href={current.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-onda-yellow text-onda-blue rounded-md px-3 py-1.5 text-xs font-semibold hover:brightness-95"
                      >
                        Buka PDF
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => setActive(null)}
                    className="rounded-md border border-white/30 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Tutup ✕
                  </button>
                </div>
              </div>
              <div className="bg-gray-100">
                {current.fileUrl ? (
                  <PdfFlipbook url={current.fileUrl} />
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
