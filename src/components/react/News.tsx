'use client'
import { useMemo, useState } from 'react'
import type { NewsCategory, NewsItem } from '../../lib/data/onda-news'
import { formatNewsDate } from '../../lib/data/onda-news'
import { img } from '../../lib/image'

type Props = {
  news: NewsItem[]
  categories: NewsCategory[]
}

function Badge({ name }: { name: string }) {
  return (
    <span className="bg-light-blue-shade text-onda-blue text-mini-label inline-block rounded-md px-2.5 py-0.5 font-semibold">
      {name}
    </span>
  )
}

export default function News({ news, categories }: Props) {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return news.filter((n) => {
      const matchCat = cat === 'all' || n.categories.some((c) => c.slug === cat)
      const matchQ =
        !q ||
        n.title.toLowerCase().includes(q) ||
        (n.preview ?? '').toLowerCase().includes(q) ||
        (n.subtitle ?? '').toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [news, query, cat])

  const [latest, ...older] = filtered

  return (
    <section className="section py-12">
      <h1 className="text-h2 text-onda-blue font-extrabold">Dunia Onda</h1>
      <p className="text-body text-dark-blue-shade mt-1">
        Temukan Inspirasi & Kabar Terbaru dari Dunia Onda
      </p>

      {/* Search */}
      <div className="relative mt-6">
        <span className="text-onda-blue/50 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari Artikel"
          className="border-onda-blue/30 text-dark-blue-shade focus:border-onda-blue w-full rounded-lg border bg-white py-3 pr-4 pl-12 text-sm outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[{ name: 'Semua Artikel', slug: 'all' }, ...categories].map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
              cat === c.slug
                ? 'bg-onda-blue text-white'
                : 'border-onda-blue/30 text-onda-blue hover:bg-light-blue-shade border'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-dark-blue-shade/60 mt-12 text-center text-sm">
          Artikel tidak ditemukan{query ? ` untuk "${query}"` : ''}.
        </p>
      )}

      {latest && (
        <>
          <h2 className="text-h2 text-onda-blue mt-12 text-center font-bold md:text-left">
            Latest News
          </h2>
          <a
            href={`/news/${latest.slug}`}
            className="mt-4 grid items-center gap-0 overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl md:grid-cols-2 md:gap-6 md:overflow-visible md:border md:border-gray-100 md:p-6"
          >
            {latest.coverUrl && (
              <img
                src={img(latest.coverUrl, 1200)}
                alt={latest.title}
                className="order-1 h-56 w-full object-cover md:order-2 md:h-72 md:rounded-xl lg:h-80"
                loading="lazy"
              />
            )}
            <div className="order-2 flex flex-col gap-2 px-4 py-6 md:order-1 md:p-0">
              <h3 className="text-onda-blue text-h4 font-bold">{latest.title}</h3>
              {latest.subtitle && (
                <p className="text-dark-blue-shade text-body font-semibold">{latest.subtitle}</p>
              )}
              {latest.preview && (
                <p className="text-dark-blue-shade/80 text-button leading-relaxed">
                  {latest.preview}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                {latest.categories.map((c) => (
                  <Badge key={c.slug} name={c.name} />
                ))}
              </div>
              <p className="text-dark-blue-shade/70 text-button">{formatNewsDate(latest.date)}</p>
              <span className="text-onda-blue text-button font-semibold">Baca Selengkapnya →</span>
            </div>
          </a>
        </>
      )}

      {older.length > 0 && (
        <>
          <h2 className="text-h2 text-onda-blue mt-12 text-center font-bold md:text-left">
            Older News
          </h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {older.map((n) => (
              <a
                key={n.id}
                href={`/news/${n.slug}`}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                {n.coverUrl && (
                  <img
                    src={img(n.coverUrl, 1200)}
                    alt={n.title}
                    className="h-48 w-full object-cover sm:h-52 md:h-56"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-1 flex-col gap-2 px-4 py-6">
                  <h3 className="text-onda-blue text-h4 font-bold">{n.title}</h3>
                  {n.subtitle && (
                    <p className="text-dark-blue-shade text-body font-semibold">{n.subtitle}</p>
                  )}
                  {n.preview && (
                    <p className="text-dark-blue-shade/80 text-button leading-relaxed">
                      {n.preview}
                    </p>
                  )}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {n.categories.map((c) => (
                      <Badge key={c.slug} name={c.name} />
                    ))}
                  </div>
                  <div className="border-light-blue-shade flex items-center justify-between border-t pt-3">
                    <span className="text-dark-blue-shade/70 text-button">
                      {formatNewsDate(n.date)}
                    </span>
                    <span className="text-onda-blue text-button font-semibold">Baca →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
