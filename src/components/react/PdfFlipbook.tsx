import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import HTMLFlipBook from 'react-pageflip'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

export type SearchResult = { page: number; snippet: string }
export type FlipbookApi = {
  search: (query: string) => Promise<SearchResult[]>
  goToPage: (page: number) => void
}

type Props = {
  url: string
  onReady?: (api: FlipbookApi | null) => void
}

const SINGLE_PAGE_BELOW = 1024 // lebar layar di bawah ini selalu 1 halaman
const MAX_PAGE_WIDTH = 520 // batas lebar 1 halaman di layar besar
const MIN_SPREAD_PAGE = 340 // kalau 1 halaman < ini saat mode 2 halaman, pindah ke 1 halaman
const ARROWS_SPACE = 130 // ruang untuk 2 tombol panah + jarak
const VERTICAL_SPACE = 230 // navbar + toolbar + teks petunjuk

type Layout = { pageWidth: number; single: boolean }

function calcLayout(containerWidth: number, ratio: number): Layout {
  const available = Math.max(0, containerWidth - ARROWS_SPACE)
  const maxByHeight = (window.innerHeight - VERTICAL_SPACE) / ratio
  const single = window.innerWidth < SINGLE_PAGE_BELOW || available / 2 < MIN_SPREAD_PAGE
  const byWidth = single ? available : available / 2
  const w = Math.min(MAX_PAGE_WIDTH, byWidth, Math.max(280, maxByHeight))
  return { pageWidth: Math.floor(w / 10) * 10, single }
}

export default function PdfFlipbook({ url, onReady }: Props) {
  const [numPages, setNumPages] = useState(0)
  const [progress, setProgress] = useState(0)
  const [ratio, setRatio] = useState(594 / 420) // default A4, diganti rasio asli PDF
  const [layout, setLayout] = useState<Layout | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<any>(null)
  const pdfRef = useRef<PDFDocumentProxy | null>(null)
  const textsRef = useRef<string[] | null>(null)
  const currentPageRef = useRef(0)

  useEffect(() => () => onReady?.(null), [])

  // hitung ulang ukuran saat lebar area / tinggi layar berubah
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    let t: ReturnType<typeof setTimeout>
    const update = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        const next = calcLayout(el.clientWidth, ratio)
        setLayout((prev) =>
          prev && prev.pageWidth === next.pageWidth && prev.single === next.single ? prev : next
        )
      }, 150)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      clearTimeout(t)
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [ratio])

  const flipNext = () => bookRef.current?.pageFlip?.()?.flipNext?.()
  const flipPrev = () => bookRef.current?.pageFlip?.()?.flipPrev?.()
  const goToPage = (page: number) => {
    currentPageRef.current = page - 1
    bookRef.current?.pageFlip?.()?.turnToPage?.(page - 1)
  }

  // ambil teks semua halaman sekali saja, lalu disimpan
  const loadTexts = async () => {
    if (textsRef.current) return textsRef.current
    const pdf = pdfRef.current
    if (!pdf) return []
    const texts = await Promise.all(
      Array.from({ length: pdf.numPages }, async (_, i) => {
        const page = await pdf.getPage(i + 1)
        const content = await page.getTextContent()
        return content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s+/g, ' ')
      })
    )
    textsRef.current = texts
    return texts
  }

  const search = async (query: string) => {
    const q = query.toLowerCase().replace(/\s+/g, ' ').trim()
    if (!q) return []
    const texts = await loadTexts()
    const found: SearchResult[] = []
    texts.forEach((text, i) => {
      const idx = text.toLowerCase().indexOf(q)
      if (idx < 0) return
      const start = Math.max(0, idx - 30)
      const end = Math.min(text.length, idx + q.length + 30)
      found.push({
        page: i + 1,
        snippet: `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`,
      })
    })
    return found
  }

  const pageWidth = layout?.pageWidth ?? 0
  const pageHeight = Math.round(pageWidth * ratio)

  const arrowClass =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-onda-blue/30 bg-white text-onda-blue text-2xl leading-none transition-colors hover:bg-onda-blue hover:text-white lg:h-11 lg:w-11'

  return (
    <div ref={wrapperRef} className="flex w-full flex-col items-center gap-4 px-2 py-6">
      <Document
        className="w-full"
        file={url}
        onLoadProgress={({ loaded, total }) => {
          if (total) setProgress(Math.min(100, Math.round((loaded / total) * 100)))
        }}
        onLoadSuccess={async (pdf) => {
          pdfRef.current = pdf
          const first = await pdf.getPage(1)
          const vp = first.getViewport({ scale: 1 })
          setRatio(vp.height / vp.width)
          setNumPages(pdf.numPages)
          onReady?.({ search, goToPage })
        }}
        loading={
          <div className="mx-auto flex w-72 max-w-full flex-col items-center gap-3 p-10">
            <p className="text-sm text-gray-500">Memuat katalog… {progress}%</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="bg-onda-blue h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        }
        error={<p className="p-10 text-center text-sm text-red-500">Gagal memuat PDF.</p>}
      >
        {numPages > 0 && layout && (
          <div className="flex w-full items-center justify-center gap-2 md:gap-4">
            <button
              type="button"
              onClick={flipPrev}
              aria-label="Halaman sebelumnya"
              className={arrowClass}
            >
              ‹
            </button>

            {/* lebar dikunci di sini karena page-flip memaksa width: 100% */}
            <div className="shrink-0" style={{ width: layout.single ? pageWidth : pageWidth * 2 }}>
              {/* @ts-ignore - props HTMLFlipBook */}
              <HTMLFlipBook
                key={`${pageWidth}-${layout.single}`}
                ref={bookRef}
                width={pageWidth}
                height={pageHeight}
                size="fixed"
                usePortrait={layout.single}
                startPage={currentPageRef.current}
                showCover={true}
                maxShadowOpacity={0.4}
                renderOnlyPageLengthChange={true}
                onFlip={(e: { data: number }) => (currentPageRef.current = e.data)}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <div key={i} className="bg-white">
                    <Page
                      pageNumber={i + 1}
                      width={pageWidth}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>

            <button
              type="button"
              onClick={flipNext}
              aria-label="Halaman berikutnya"
              className={arrowClass}
            >
              ›
            </button>
          </div>
        )}
      </Document>

      {numPages > 0 && (
        <p className="text-dark-blue-shade/60 text-center text-sm">
          Klik halaman untuk membuka, atau pakai panah <b>‹</b> dan <b>›</b>
        </p>
      )}
    </div>
  )
}
