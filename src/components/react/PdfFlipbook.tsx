import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
// @ts-ignore - react-pageflip nggak punya types bawaan
import HTMLFlipBook from 'react-pageflip'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// worker pdfjs dari CDN (versi ngikut react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function PdfFlipbook({ url }: { url: string }) {
  const [numPages, setNumPages] = useState(0)

  // ukuran halaman flipbook (portrait A-ish)
  const WIDTH = 420
  const HEIGHT = 594

  return (
    <div className="flex justify-center py-6">
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<p className="p-10 text-center text-sm text-gray-500">Memuat katalog…</p>}
        error={<p className="p-10 text-center text-sm text-red-500">Gagal memuat PDF.</p>}
      >
        {numPages > 0 && (
          // @ts-ignore - props HTMLFlipBook
          <HTMLFlipBook
            width={WIDTH}
            height={HEIGHT}
            showCover={true}
            maxShadowOpacity={0.4}
            className="mx-auto"
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
        )}
      </Document>
    </div>
  )
}
