import { useEffect, useRef, useState } from 'react'
import { img } from '../../lib/image'

type Award = {
  image?: { url?: string; alt?: string }
  label?: string
  year?: string
}

function Card({ a }: { a: Award }) {
  return (
    <div className="shadow-onda-blue/30 flex h-full flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm">
      <div className="bg-light-blue-shade mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full">
        {a.image?.url ? (
          <img
            src={img(a.image.url, 400)}
            alt={a.label ?? ''}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-onda-blue/40 text-2xl">★</span>
        )}
      </div>
      {a.year && <p className="text-dark-blue-shade text-sm font-bold">{a.year}</p>}
      {a.label && <p className="text-dark-blue-shade/70 text-xs">{a.label}</p>}
    </div>
  )
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

const DESKTOP_PER = 4
const MOBILE_PER = 2
const AUTOPLAY_MS = 4500

export default function AwardsCarousel({ awards = [] }: { awards: Award[] }) {
  const [isMobile, setIsMobile] = useState(false)
  const [page, setPage] = useState(0)
  const [mPage, setMPage] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const mPageRef = useRef(0)

  useEffect(() => {
    const calc = () => setIsMobile(window.innerWidth < 768)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  useEffect(() => {
    mPageRef.current = mPage
  }, [mPage])

  const perPage = isMobile ? MOBILE_PER : DESKTOP_PER
  const isCarousel = awards.length > perPage
  const groups = chunk(awards, perPage)
  const pages = Math.max(1, groups.length)

  useEffect(() => {
    if (page > pages - 1) setPage(0)
  }, [pages, page])

  // autoplay — desktop & mobile
  useEffect(() => {
    if (!isCarousel) return
    const t = setInterval(() => {
      if (isMobile) {
        const el = trackRef.current
        if (!el) return
        const nextP = (mPageRef.current + 1) % pages
        el.scrollTo({ left: nextP * el.clientWidth, behavior: 'smooth' })
      } else {
        setPage((p) => (p + 1) % pages)
      }
    }, AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [isMobile, isCarousel, pages])

  // ── item ≤ per-halaman → grid statis, ketengah ──
  if (!isCarousel) {
    return (
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {awards.map((a, i) => (
          <div key={i} className="w-[calc(50%-0.5rem)] md:w-56">
            <Card a={a} />
          </div>
        ))}
      </div>
    )
  }

  // MOBILE
  if (isMobile) {
    const onScroll = () => {
      const el = trackRef.current
      if (!el) return
      setMPage(Math.round(el.scrollLeft / el.clientWidth))
    }
    return (
      <div>
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto py-5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {groups.map((g, gi) => (
            <div key={gi} className="flex w-full flex-none snap-start justify-center">
              {g.map((a, i) => (
                <div key={i} className="w-1/2 shrink-0 grow-0 px-2">
                  <Card a={a} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <Dots
          count={pages}
          active={mPage}
          onSelect={(i) => {
            const el = trackRef.current
            if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
          }}
        />
      </div>
    )
  }

  // DESKTOP
  const prev = () => setPage((p) => (p - 1 + pages) % pages)
  const next = () => setPage((p) => (p + 1) % pages)

  return (
    <div className="relative px-12">
      <Arrow dir="left" onClick={prev} />
      <Arrow dir="right" onClick={next} />

      <div className="overflow-hidden py-5">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {groups.map((g, gi) => (
            <div key={gi} className="flex w-full flex-none justify-center">
              {g.map((a, i) => (
                <div key={i} className="w-1/4 shrink-0 grow-0 px-3">
                  <Card a={a} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Dots count={pages} active={page} onSelect={setPage} />
    </div>
  )
}

function Dots({
  count,
  active,
  onSelect,
}: {
  count: number
  active: number
  onSelect: (i: number) => void
}) {
  return (
    <div className="mt-2 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Halaman ${i + 1}`}
          className="bg-onda-blue h-2 rounded-full transition-all duration-300"
          style={{ width: i === active ? '1.5rem' : '0.5rem', opacity: i === active ? 1 : 0.3 }}
        />
      ))}
    </div>
  )
}

function Arrow({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'left' ? 'Sebelumnya' : 'Selanjutnya'}
      className={`text-onda-blue hover:bg-onda-blue absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_rgba(0,93,166,0.18)] transition hover:scale-105 hover:text-white ${
        dir === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
      </svg>
    </button>
  )
}
