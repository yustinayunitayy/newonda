import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import HTMLFlipBook from 'react-pageflip'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

export default function PdfFlipbook({ url }: { url: string }) {
  const [numPages, setNumPages] = useState(0)
  const [progress, setProgress] = useState(0)

  const WIDTH = 420
  const HEIGHT = 594

  return (
    <div className="flex justify-center py-6">
      <Document
        file={url}
        onLoadProgress={({ loaded, total }) => {
          if (total) setProgress(Math.min(100, Math.round((loaded / total) * 100)))
        }}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="flex w-72 flex-col items-center gap-3 p-10">
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
