import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { resolveColor } from '../../lib/colour'
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
  const labelColor = resolveColor(labelTextColor, 'blue')
  const headingColor = resolveColor(headingTextColor, 'blue')

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
    if (images.length < 2) return
    const t = setInterval(() => setIdx((p) => (p + 1) % images.length), hover ? 1000 : 3000)
    return () => clearInterval(t)
  }, [hover, images.length])

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

  useEffect(() => {
    if (images.length < 2) return
    const t = setInterval(() => setIdx((p) => (p + 1) % images.length), 3500)
    return () => clearInterval(t)
  }, [images.length])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex max-h-[85dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white"
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
          className="text-dark-blue-shade absolute right-3 bottom-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl leading-none shadow-md transition-colors hover:bg-white"
        >
          ✕
        </button>

        {images.length > 0 && (
          <div className="bg-light-blue-shade relative aspect-video w-full shrink-0 overflow-hidden">
            {images.map((src, i) => (
              <img
                key={i}
                src={img(src, 1400)}
                alt={item.title}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  i === idx ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}

            {images.length > 1 && (
              <div className="absolute inset-x-3 bottom-3 z-10 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`Foto ${i + 1}`}
                    className={`h-1 flex-1 cursor-pointer rounded-full transition-all duration-300 ${
                      i === idx ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="shrink-0 px-5 pt-5 sm:px-7">
          <h3 className="text-onda-blue text-h3 pb-3 font-bold">{item.title}</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 sm:px-7 sm:pb-7">
          {item.content ? (
            <RichTextRenderer
              content={item.content}
              className="text-dark-blue-shade/80 leading-relaxed"
            />
          ) : (
            item.preview && (
              <p className="text-dark-blue-shade/80 text-body leading-relaxed">{item.preview}</p>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
