import { useRef, useState, type FormEvent } from 'react'
import { Plus, Trash2, FileUp, ImageIcon, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { LANGUAGES, SHOWCASE_CATEGORIES } from '@/lib/constants'
import { fileToBase64, imageDataUrl, humanSize } from '@/lib/format'
import type {
  SnippetDetail,
  SnippetFileInput,
  SnippetImageInput,
  ShowcasePayload,
} from '@/lib/types'

const MAX_IMAGES = 8
const MAX_IMAGE_BYTES = 3_000_000
const TEXT_FILE_EXTENSIONS = new Set(['gs2', 'gscript', 'gs1', 'js', 'jsx', 'ts', 'tsx', 'json', 'html', 'htm', 'css', 'sql', 'txt', 'md', 'nw', 'gmap', 'zelda', 'graal', 'gani', 'c', 'cpp', 'h', 'hpp', 'cs', 'py', 'php', 'xml'])

interface ShowcaseFormProps {
  initial?: SnippetDetail
  submitting?: boolean
  submitLabel: string
  onSubmit: (payload: ShowcasePayload) => void | Promise<void>
}

interface FileRow extends SnippetFileInput {
  uid: string
}

let uidCounter = 0
function nextUid() {
  uidCounter += 1
  return `f${uidCounter}`
}

function defaultAuthor() {
  // SSR-safe placeholder; real default applied in component from useAuth.
  return ''
}

export function ShowcaseForm({ initial, submitting, submitLabel, onSubmit }: ShowcaseFormProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'script')
  const [thumbnail, setThumbnail] = useState<SnippetImageInput | null>(
    initial?.thumbnailData
      ? {
          filename: 'thumbnail',
          mimeType: initial.thumbnailMimeType ?? 'image/png',
          data: initial.thumbnailData,
        }
      : null,
  )
  const [author, setAuthor] = useState(
    initial?.author ?? user?.nickname ?? user?.username ?? defaultAuthor(),
  )

  const [files, setFiles] = useState<FileRow[]>(
    initial
      ? initial.files
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((f) => ({
            uid: nextUid(),
            filename: f.filename,
            language: f.language ?? 'gs2',
            content: f.content,
          }))
      : [
          {
            uid: nextUid(),
            filename: 'main.gs2',
            language: 'gs2',
            content: '// your GS2 code here\n',
          },
        ],
  )

  const [images, setImages] = useState<SnippetImageInput[]>(
    initial
      ? initial.images
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((img) => ({
            filename: img.filename,
            mimeType: img.mimeType,
            data: img.data,
          }))
      : [],
  )

  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  // ---- file rows ----
  function addFile() {
    setFiles((prev) => [
      ...prev,
      {
        uid: nextUid(),
        filename: `untitled-${prev.length + 1}.gs2`,
        language: 'gs2',
        content: '',
      },
    ])
  }

  function removeFile(uid: string) {
    setFiles((prev) => prev.filter((f) => f.uid !== uid))
  }

  function patchFile(uid: string, patch: Partial<FileRow>) {
    setFiles((prev) => prev.map((f) => (f.uid === uid ? { ...f, ...patch } : f)))
  }

  function moveFile(uid: string, dir: -1 | 1) {
    setFiles((prev) => {
      const i = prev.findIndex((f) => f.uid === uid)
      const j = i + dir
      if (i < 0 || j < 0 || j >= prev.length) return prev
      const copy = [...prev]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })
  }

  async function importFiles(list: FileList | null) {
    if (!list || !list.length) return
    setError(null)
    const rows: FileRow[] = []
    for (const file of Array.from(list)) {
      if (!isTextFile(file)) {
        setError(`${file.name} is not a text/code file.`)
        continue
      }
      const text = await file.text()
      rows.push({
        uid: nextUid(),
        filename: file.name,
        language: guessLanguage(file.name),
        content: text,
      })
    }
    if (rows.length) setFiles((prev) => [...prev, ...rows])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ---- images ----
  async function addImages(list: FileList | null) {
    if (!list || !list.length) return
    setError(null)
    const incoming = Array.from(list)
    const accepted: SnippetImageInput[] = []
    for (const file of incoming) {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image.`)
        continue
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(`${file.name} is too large (max ${humanSize(MAX_IMAGE_BYTES)}).`)
        continue
      }
      const data = await fileToBase64(file)
      accepted.push({ filename: file.name, mimeType: file.type, data })
    }
    if (accepted.length) {
      setImages((prev) => {
        const merged = [...prev, ...accepted]
        if (merged.length > MAX_IMAGES) {
          setError(`Max ${MAX_IMAGES} images — kept the first ${MAX_IMAGES}.`)
          return merged.slice(0, MAX_IMAGES)
        }
        return merged
      })
    }
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function setThumbnailFile(list: FileList | null) {
    const file = list?.[0]
    if (!file) return
    setError(null)
    if (!file.type.startsWith('image/')) return setError(`${file.name} is not an image.`)
    if (file.size > MAX_IMAGE_BYTES) return setError(`${file.name} is too large (max ${humanSize(MAX_IMAGE_BYTES)}).`)
    const data = await fileToBase64(file)
    setThumbnail({ filename: file.name, mimeType: file.type, data })
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
  }

  // ---- submit ----
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) return setError('Title is required.')
    if (title.length > 200) return setError('Title is too long (max 200).')
    if (!author.trim()) return setError('Author is required.')
    if (author.length > 100) return setError('Author is too long (max 100).')
    if (description && description.length > 5000)
      return setError('Description is too long (max 5000).')
    if (files.length === 0) return setError('At least one file is required.')

    const seen = new Set<string>()
    for (const f of files) {
      if (!f.filename.trim()) return setError('Every file needs a filename.')
      if (!f.content) return setError(`File "${f.filename}" has no content.`)
      const key = f.filename.toLowerCase()
      if (seen.has(key)) return setError(`Duplicate filename: ${f.filename}`)
      seen.add(key)
    }

    const payload: ShowcasePayload = {
      title: title.trim(),
      description: description.trim() || null,
      category: category || null,
      thumbnailMimeType: thumbnail?.mimeType ?? null,
      thumbnailData: thumbnail?.data ?? null,
      author: author.trim(),
      files: files.map(({ filename, language, content }) => ({
        filename,
        language: language || null,
        content,
      })),
      images: images.map(({ filename, mimeType, data }) => ({ filename, mimeType, data })),
    }
    void onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Meta */}
      <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Inventory drag-and-drop system"
            maxLength={200}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this? How do you use it?"
            maxLength={5000}
            rows={4}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SHOWCASE_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void setThumbnailFile(e.target.files)}
            />
            <button
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
              className="group flex h-[118px] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-background text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {thumbnail ? (
                <img src={imageDataUrl(thumbnail.mimeType, thumbnail.data)} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Add thumbnail
                </span>
              )}
            </button>
            {thumbnail && (
              <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground" onClick={() => setThumbnail(null)}>
                Remove thumbnail
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="your name / handle"
            maxLength={100}
            required
          />
        </div>
      </div>

      {/* Files */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Files ({files.length})
          </h2>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => void importFiles(e.target.files)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp className="h-4 w-4" /> Import file
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={addFile}>
              <Plus className="h-4 w-4" /> Add file
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {files.map((f, i) => (
            <div key={f.uid} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted p-2">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => moveFile(f.uid, -1)}
                    disabled={i === 0}
                    className="text-muted-foreground hover:text-primary disabled:opacity-30"
                    title="Move up"
                  >
                    <GripVertical className="h-4 w-4 rotate-180" />
                  </button>
                </div>
                <Input
                  value={f.filename}
                  onChange={(e) => patchFile(f.uid, { filename: e.target.value })}
                  placeholder="filename.gs2"
                  className="h-8 max-w-[220px]"
                />
                <Select
                  value={f.language ?? 'gs2'}
                  onValueChange={(v) => patchFile(f.uid, { language: v })}
                >
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(f.uid)}
                  title="Remove file"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={f.content}
                onChange={(e) => patchFile(f.uid, { content: e.target.value })}
                placeholder="// paste or write code…"
                rows={10}
                className="border-0 focus-visible:ring-0"
              />
            </div>
          ))}
          {files.length === 0 && (
            <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No files. Add or import one to publish.
            </p>
          )}
        </div>
      </section>

      {/* Images */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Images ({images.length}/{MAX_IMAGES}){' '}
            <span className="text-muted-foreground/60">(optional)</span>
          </h2>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void addImages(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES}
          >
            <ImageIcon className="h-4 w-4" /> Add images
          </Button>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img, i) => (
              <div
                key={`${img.filename}-${i}`}
                className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-background"
              >
                <img
                  src={imageDataUrl(img.mimeType, img.data)}
                  alt={img.filename}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-1.5 py-0.5 text-[10px] text-white/90">
                  {img.filename}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            Attach screenshots or diagrams (png/jpg, up to {humanSize(MAX_IMAGE_BYTES)} each).
          </p>
        )}
      </section>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
        <span className="text-sm text-muted-foreground">
          {files.length} {files.length === 1 ? 'file' : 'files'} · {images.length} images
        </span>
      </div>
    </form>
  )
}

function guessLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    gs2: 'gs2',
    gs: 'gs1',
    gani: 'gs2',
    nw: 'gs2',
    zelda: 'gs2',
    graal: 'gs2',
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    html: 'html',
    htm: 'html',
    css: 'css',
    sql: 'sql',
    sh: 'bash',
    bash: 'bash',
    c: 'c',
    h: 'c',
    cpp: 'cpp',
    cc: 'cpp',
    cs: 'csharp',
    py: 'python',
    php: 'php',
  }
  return map[ext] ?? 'gs2'
}

function isTextFile(file: File): boolean {
  if (file.type.startsWith('text/')) return true
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  return TEXT_FILE_EXTENSIONS.has(ext)
}
