import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { CatalogItem } from '../../lib/data/catalog'
import type { FlipbookApi, SearchResult } from './PdfFlipbook'
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

  const [flipbook, setFlipbook] = useState<FlipbookApi | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // shortcut cari di tab baru: ⌘F untuk Mac, Ctrl+F untuk lainnya
  const [findKey, setFindKey] = useState('Ctrl+F')
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setFindKey('⌘F')
  }, [])

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace('#', ''))
    if (!hash) return
    const idx = catalogs.findIndex((c) => c.anchor === hash)
    if (idx < 0) return
    if (window.innerWidth >= 768) setActive(idx)
    else setHighlighted(idx)
  }, [catalogs])

  useEffect(() => {
    setQuery('')
    setResults(null)
    setOpen(false)
    if (active !== null) {
      const t = setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => clearTimeout(t)
    }
  }, [active])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!flipbook || !query.trim()) return setResults(null)
    setSearching(true)
    setResults(await flipbook.search(query))
    setSearching(false)
    setOpen(true)
  }

  const toolBtn = 'whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition'

  return (
    <section className="section pt-0 pb-16 md:pb-24">
      {/* Panduan cari produk, khusus HP (di HP katalog langsung dibuka sebagai PDF) */}
      <div className="border-onda-blue/15 bg-onda-blue/5 mb-6 flex items-start gap-3 rounded-xl border p-4 md:hidden">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-onda-blue mt-0.5 h-5 w-5 shrink-0"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <div className="text-dark-blue-shade text-sm">
          <p className="font-semibold">Cari produk di katalog</p>
          <p className="text-dark-blue-shade/70 mt-1">
            Setelah katalog terbuka, ketuk menu <b>⋮</b> lalu pilih <b>Cari di halaman</b> /{' '}
            <b>Find in page</b>, atau gunakan ikon 🔍 di aplikasi PDF.
          </p>
        </div>
      </div>

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
              <div className="bg-dark-blue-shade flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 text-white lg:px-5">
                <span className="order-1 min-w-0 flex-1 truncate text-sm font-semibold lg:flex-none">
                  Sedang dibaca: <span className="text-onda-yellow">{current.title}</span>
                </span>

                <div className="order-2 flex shrink-0 items-center gap-2 lg:order-3">
                  {storeUrl && (
                    <a
                      href={storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${toolBtn} text-onda-blue bg-white hover:brightness-95`}
                    >
                      <span className="hidden xl:inline">Lihat Produknya di </span>E-Store
                    </a>
                  )}
                  {current.fileUrl && (
                    <div className="group/tab relative">
                      <a
                        href={current.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-describedby="tab-baru-tip"
                        className={`${toolBtn} bg-onda-yellow text-onda-blue inline-block hover:brightness-95`}
                      >
                        <span className="hidden xl:inline">Buka PDF di </span>Tab Baru
                      </a>
                      <div
                        id="tab-baru-tip"
                        role="tooltip"
                        className="text-dark-blue-shade pointer-events-none absolute top-full right-0 z-30 mt-2 w-56 translate-y-1 rounded-lg bg-white p-3 text-xs opacity-0 shadow-xl transition group-focus-within/tab:translate-y-0 group-focus-within/tab:opacity-100 group-hover/tab:translate-y-0 group-hover/tab:opacity-100"
                      >
                        Di tab baru, tekan{' '}
                        <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-sans font-semibold">
                          {findKey}
                        </kbd>{' '}
                        untuk mencari produk di katalog.
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setActive(null)}
                    aria-label="Tutup katalog"
                    className={`${toolBtn} border border-white/30 text-white hover:bg-red-500/90`}
                  >
                    ✕
                  </button>
                </div>

                {current.fileUrl && (
                  <div
                    ref={searchRef}
                    className="relative order-3 w-full lg:order-2 lg:ml-auto lg:w-auto lg:max-w-sm lg:flex-1"
                  >
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => results && setOpen(true)}
                        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
                        disabled={!flipbook}
                        placeholder={flipbook ? 'Cari produk di katalog…' : 'Memuat katalog…'}
                        className="focus:border-onda-yellow min-w-0 flex-1 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-xs text-white outline-none placeholder:text-white/50 disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={!flipbook || searching}
                        className={`${toolBtn} bg-onda-yellow text-onda-blue hover:brightness-95 disabled:opacity-50`}
                      >
                        {searching ? 'Mencari…' : 'Cari'}
                      </button>
                    </form>

                    {open && results && (
                      <div className="absolute top-full right-0 left-0 z-30 mt-2 max-h-[min(18rem,50vh)] overflow-y-auto rounded-xl border border-gray-200 bg-white text-sm shadow-2xl">
                        {results.length === 0 ? (
                          <p className="p-4 text-center text-gray-500">
                            Tidak ditemukan “{query}” di katalog ini.
                          </p>
                        ) : (
                          <>
                            <p className="text-dark-blue-shade/60 sticky top-0 border-b border-gray-100 bg-white px-4 py-2 text-xs">
                              Ditemukan di {results.length} halaman
                            </p>
                            {results.map((r) => (
                              <button
                                key={r.page}
                                type="button"
                                onClick={() => {
                                  flipbook?.goToPage(r.page)
                                  setOpen(false)
                                }}
                                className="hover:bg-onda-blue/5 flex w-full flex-col gap-0.5 border-b border-gray-100 px-4 py-2.5 text-left last:border-0"
                              >
                                <span className="text-onda-blue text-xs font-semibold">
                                  Halaman {r.page}
                                </span>
                                <span className="line-clamp-2 text-xs text-gray-600">
                                  {r.snippet}
                                </span>
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1">
                {current.fileUrl ? (
                  <Suspense
                    fallback={
                      <p className="p-10 text-center text-sm text-gray-500">Menyiapkan viewer…</p>
                    }
                  >
                    <PdfFlipbook
                      key={current.fileUrl}
                      url={current.fileUrl}
                      onReady={setFlipbook}
                    />
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
