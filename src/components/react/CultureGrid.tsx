import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { textColorMap } from '../../lib/colour'
import { img } from '../../lib/image'
import { RichTextRenderer } from './RichTextRenderer'
import type { CultureGridBlock, CultureItem } from '../../lib/data/blocks/culture-grid'

const imagesOf = (item: CultureItem): string[] =>
  [item.coverImage?.url, ...(item.gallery ?? []).map((g) => g.image?.url)].filter(
    (u): u is string => Boolean(u)
  )

export default function CultureGrid({
  miniLabel,
  labelTextColor,
  heading,
  headingTextColor,
  items = [],
}: CultureGridBlock) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const labelColor = textColorMap[labelTextColor ?? ''] ?? 'var(--color-onda-blue)'
  const headingColor = textColorMap[headingTextColor ?? ''] ?? 'var(--color-onda-blue)'

  return (
    <section className="section w-full">
      {(miniLabel || heading) && (
        <div className="mb-8">
          {miniLabel && (
            <p
              className="text-mini-label mb-2 font-bold tracking-[0.2em]"
              style={{ color: labelColor }}
            >
              {miniLabel}
            </p>
          )}
          {heading && (
            <h2 className="text-h2 font-extrabold" style={{ color: headingColor }}>
              {heading}
            </h2>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {items.map((item, i) => (
          <CultureCard key={i} item={item} images={imagesOf(item)} onOpen={() => setOpenIndex(i)} />
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <CultureModal
            item={items[openIndex]}
            images={imagesOf(items[openIndex])}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function CultureCard({
  item,
  images,
  onOpen,
}: {
  item: CultureItem
  images: string[]
  onOpen: () => void
}) {
  const [idx, setIdx] = useState(0)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (!hover || images.length < 2) return
    const t = setInterval(() => setIdx((p) => (p + 1) % images.length), 1000)
    return () => clearInterval(t)
  }, [hover, images.length])

  useEffect(() => {
    if (!hover) setIdx(0)
  }, [hover])

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group border-onda-blue/10 flex flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="bg-light-blue-shade relative aspect-video w-full shrink-0 overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={img(src, 800)}
            alt={item.title}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === idx ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-onda-blue text-h4 font-bold">{item.title}</h3>
        {item.preview && (
          <p className="text-dark-blue-shade/70 text-body mt-2 leading-relaxed">{item.preview}</p>
        )}
        <span className="text-onda-blue text-body mt-auto inline-flex items-center gap-1 pt-3 font-semibold">
          Klik untuk tahu lebih lanjut
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </button>
  )
}

function CultureModal({
  item,
  images,
  onClose,
}: {
  item: CultureItem
  images: string[]
  onClose: () => void
}) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const go = (d: number) => setIdx((p) => (p + d + images.length) % images.length)

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl sm:p-6"
        initial={{ y: 48 }}
        animate={{ y: 0 }}
        exit={{ y: 48 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="text-dark-blue-shade absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl leading-none shadow-md transition-colors hover:bg-white"
        >
          ✕
        </button>

        {/* Kotak gambar — lebih kecil, rounded, kepisah dari pinggir */}
        {images.length > 0 && (
          <div className="bg-light-blue-shade aspect-video w-full overflow-hidden rounded-xl">
            <img
              src={img(images[idx], 1400)}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Kontrol slide: ‹ • • • › */}
        {images.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Sebelumnya"
              className="border-onda-blue/30 text-onda-blue hover:bg-onda-blue flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none transition-colors hover:text-white"
            >
              ‹
            </button>
            <div className="flex items-center gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? 'bg-onda-blue w-5' : 'bg-onda-blue/30 w-1.5'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Berikutnya"
              className="border-onda-blue/30 text-onda-blue hover:bg-onda-blue flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none transition-colors hover:text-white"
            >
              ›
            </button>
          </div>
        )}

        {/* Teks */}
        <div className="mt-5">
          <h3 className="text-onda-blue text-h3 font-bold">{item.title}</h3>
          {item.content ? (
            <RichTextRenderer content={item.content} className="text-dark-blue-shade/80 mt-3" />
          ) : (
            item.preview && (
              <p className="text-dark-blue-shade/80 text-body mt-3 leading-relaxed">
                {item.preview}
              </p>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
