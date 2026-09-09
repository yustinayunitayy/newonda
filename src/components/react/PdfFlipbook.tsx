import { useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import HTMLFlipBook from 'react-pageflip'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

export default function PdfFlipbook({ url }: { url: string }) {
  const [numPages, setNumPages] = useState(0)
  const [progress, setProgress] = useState(0)
  const bookRef = useRef<any>(null)

  const WIDTH = 420
  const HEIGHT = 594

  const flipNext = () => bookRef.current?.pageFlip?.()?.flipNext?.()
  const flipPrev = () => bookRef.current?.pageFlip?.()?.flipPrev?.()

  const arrowClass =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-onda-blue/30 bg-white text-onda-blue text-2xl leading-none transition-colors hover:bg-onda-blue hover:text-white'

  return (
    <div className="flex w-full flex-col items-center gap-4 py-6">
      <Document
        className="w-full"
        file={url}
        onLoadProgress={({ loaded, total }) => {
          if (total) setProgress(Math.min(100, Math.round((loaded / total) * 100)))
        }}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="mx-auto flex w-72 flex-col items-center gap-3 p-10">
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
        {numPages > 0 && (
          <div className="flex w-full items-center justify-center gap-3 md:gap-5">
            <button
              type="button"
              onClick={flipPrev}
              aria-label="Halaman sebelumnya"
              className={arrowClass}
            >
              ‹
            </button>

            {/* @ts-ignore - props HTMLFlipBook */}
            <HTMLFlipBook
              ref={bookRef}
              width={WIDTH}
              height={HEIGHT}
              showCover={true}
              maxShadowOpacity={0.4}
              className="shrink-0"
            >
              {Array.from({ length: numPages }, (_, i) => (
                <div key={i} className="bg-white">
                  <Page
                    pageNumber={i + 1}
                    width={WIDTH}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
              ))}
            </HTMLFlipBook>

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
        <p className="text-dark-blue-shade/60 text-sm">
          Klik halaman untuk membuka, atau pakai panah <b>‹</b> dan <b>›</b>
        </p>
      )}
    </div>
  )
}
