import { useState } from 'react'
import { Download, Expand, ImageIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { imageDataUrl } from '@/lib/format'
import type { SnippetImage } from '@/lib/types'

export function ImageGallery({ images }: { images: SnippetImage[] }) {
  const [active, setActive] = useState<number | null>(null)
  if (!images.length) return null
  const current = active !== null ? images[active] : null

  function download(img: SnippetImage) {
    const a = document.createElement('a')
    a.href = imageDataUrl(img.mimeType, img.data)
    a.download = img.filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={`${img.filename}-${i}`}
            onClick={() => setActive(i)}
            className="group relative aspect-video overflow-hidden border border-border bg-background transition-colors hover:border-primary"
          >
            <img
              src={imageDataUrl(img.mimeType, img.data)}
              alt={img.filename}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex w-full items-center justify-between gap-1 font-mono text-[10px] text-foreground/90">
                <span className="truncate">{img.filename}</span>
                <Expand className="h-3 w-3 shrink-0 text-primary" />
              </span>
            </span>
          </button>
        ))}
      </div>

      <Dialog open={current !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-4xl border-border p-0">
          {current && (
            <>
              <DialogTitle className="sr-only">{current.filename}</DialogTitle>
              <DialogDescription className="sr-only">
                Image attachment {current.filename}
              </DialogDescription>
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Badge variant="secondary">
                      <ImageIcon className="mr-1 h-3 w-3" /> image
                    </Badge>
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {current.filename}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => download(current)}
                      className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-primary"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <img
                  src={imageDataUrl(current.mimeType, current.data)}
                  alt={current.filename}
                  className="max-h-[75vh] w-full object-contain bg-black/40"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
