type Props = {
  page: number
  totalPages: number
  onChange: (p: number) => void
  variant?: 'light' | 'dark'
  className?: string
}

function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out: (number | 'gap')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) out.push('gap')
  for (let p = start; p <= end; p++) out.push(p)
  if (end < total - 1) out.push('gap')
  out.push(total)
  return out
}

const STYLE = {
  light: {
    base: 'border-onda-blue/30 text-onda-blue hover:bg-light-blue-shade',
    active: 'bg-onda-blue border-onda-blue text-white',
    gap: 'text-onda-blue/50',
  },
  dark: {
    base: 'border-white/20 text-white hover:bg-white/10',
    active: 'bg-onda-yellow border-onda-yellow text-dark-blue-shade',
    gap: 'text-white/40',
  },
}

export default function Pagination({
  page,
  totalPages,
  onChange,
  variant = 'light',
  className = '',
}: Props) {
  if (totalPages <= 1) return null
  const s = STYLE[variant]
  const cell =
    'flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <nav
      className={`mt-8 flex flex-wrap items-center justify-center gap-1.5 ${className}`}
      aria-label="Navigasi halaman"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${cell} ${s.base}`}
        aria-label="Sebelumnya"
      >
        ‹
      </button>
      {pageWindow(page, totalPages).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className={`px-1 text-sm ${s.gap}`}>
            …
          </span>
        ) : (
          <button
            type="button"
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${cell} ${p === page ? s.active : s.base}`}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${cell} ${s.base}`}
        aria-label="Berikutnya"
      >
        ›
      </button>
    </nav>
  )
}
