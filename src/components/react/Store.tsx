import { useMemo, useState } from 'react'
import type { StoreItem } from '../../lib/data/oe-store'

type Props = {
  miniLabel?: string
  heading?: string
  subheading?: string
  stores: StoreItem[]
}

export default function StoreLocator({
  miniLabel = 'Temukan Produk Kami',
  heading = 'Jelajahi Onda Exclusive di Department Store terdekat Anda.',
  subheading = 'Klik untuk buka lokasi di Google Maps.',
  stores = [],
}: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return stores
    return stores.filter(
      (s) => s.storeName.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
    )
  }, [query, stores])

  const mapsUrl = (s: StoreItem) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${s.storeName} ${s.address}`
    )}`

  return (
    <section className="section bg-black py-16 text-white md:py-16">
      <div>
        {miniLabel && <p className="text-mini-label text-white">{miniLabel}</p>}
        {heading && <h1 className="text-h2 text-onda-yellow mt-2 font-extrabold">{heading}</h1>}
        {subheading && <p className="text-body mt-2 text-white">{subheading}</p>}

        {/* Search */}
        <div className="relative mt-6">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/50">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama kota atau toko"
            className="w-full rounded-lg border border-white/15 bg-white/5 py-3 pr-4 pl-12 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/40"
          />
        </div>

        {/* List */}
        <div className="mt-6 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/50">
              Toko tidak ditemukan untuk "{query}".
            </p>
          ) : (
            filtered.map((s, i) => (
              <a
                key={i}
                href={mapsUrl(s)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:border-white/30 hover:bg-white/10"
              >
                <h3 className="group-hover:text-onda-yellow text-sm font-bold text-white">
                  {s.storeName}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-white/70">{s.address}</p>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
