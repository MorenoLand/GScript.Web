import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  FileCode2,
  ImageIcon,
  Pencil,
  Trash2,
  User as UserIcon,
  PackageOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CodeBlock } from '@/components/CodeBlock'
import { ImageGallery } from '@/components/ImageGallery'
import { EmptyState } from '@/components/EmptyState'
import { useDeleteShowcaseItem, useShowcaseItem } from '@/hooks/useShowcaseItems'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, imageDataUrl } from '@/lib/format'
import { SHOWCASE_CATEGORIES } from '@/lib/constants'
import { toast } from 'sonner'

export function ShowcaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const numId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: snippet, isLoading, isError, error } = useShowcaseItem(numId)
  const deleteMutation = useDeleteShowcaseItem()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (Number.isNaN(numId)) {
    return (
      <PageShell>
        <EmptyState title="Invalid item" description="That ID doesn't look right." />
      </PageShell>
    )
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </PageShell>
    )
  }

  if (isError || !snippet) {
    return (
      <PageShell>
        <EmptyState
          icon={<PackageOpen className="h-6 w-6" />}
          title="Showcase item not found"
          description={error instanceof Error ? error.message : undefined}
          action={
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" /> Back to gallery
              </Link>
            </Button>
          }
        />
      </PageShell>
    )
  }

  const canMutate =
    !!user && (user.username === snippet.uploaderId || user.role === 'admin' || user.canManageShowcase)
  const edited = snippet.editedAt && snippet.editedAt !== snippet.createdAt
  const category = SHOWCASE_CATEGORIES.find((c) => c.value === snippet.category)?.label

  async function doDelete() {
    try {
      await deleteMutation.mutateAsync(snippet!.id)
      toast.success('Showcase item deleted')
      navigate('/')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setConfirmOpen(false)
    }
  }

  function downloadLargeFile(filename: string, content: string) {
    const url = URL.createObjectURL(new Blob([content], { type: 'application/octet-stream' }))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-5 -ml-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8">
          {snippet.thumbnailData && (
            <div className="-mx-6 -mt-6 mb-6 aspect-[16/7] overflow-hidden rounded-t-xl border-b border-border bg-muted sm:-mx-8 sm:-mt-8">
              <img
                src={imageDataUrl(snippet.thumbnailMimeType, snippet.thumbnailData)}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                {snippet.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span className="font-medium text-foreground">{snippet.author}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(snippet.createdAt)}
                </span>
                {edited && (
                  <span>edited {formatDate(snippet.editedAt)}</span>
                )}
              </div>
            </div>

            {canMutate && (
              <div className="flex shrink-0 gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to={`/snippet/${snippet.id}/edit`}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setConfirmOpen(true)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            )}
          </div>

          {snippet.description && (
            <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {snippet.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {category && (
              <Badge variant="default">{category}</Badge>
            )}
            <Badge variant="default">
              <FileCode2 className="mr-1 h-3 w-3" />
              {snippet.files.length} {snippet.files.length === 1 ? 'file' : 'files'}
            </Badge>
            {snippet.images.length > 0 && (
              <Badge variant="secondary">
                <ImageIcon className="mr-1 h-3 w-3" />
                {snippet.images.length} {snippet.images.length === 1 ? 'image' : 'images'}
              </Badge>
            )}
          </div>
        </div>

        {/* Files */}
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Source</h2>
          <div className="space-y-4">
            {snippet.files.map((f, i) => (
              f.content.length > 120_000 ? (
                <div key={`${f.filename}-${i}`} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate font-mono text-sm text-muted-foreground">{f.filename}</span>
                    <Button size="sm" variant="outline" onClick={() => downloadLargeFile(f.filename, f.content)}>
                      Download
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Large file skipped in preview.</p>
                </div>
              ) : (
                <CodeBlock
                  key={`${f.filename}-${i}`}
                  code={f.content}
                  language={f.language ?? undefined}
                  filename={f.filename}
                />
              )
            ))}
          </div>
        </section>

        {/* Images */}
        {snippet.images.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Attachments</h2>
            <ImageGallery images={snippet.images} />
          </section>
        )}

        <Separator className="my-10" />
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogDescription>
              This permanently removes “{snippet.title}” and all its files and images. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={doDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}

function PageShell({ children }: { children: ReactNode }) {
  return <div className="container py-10">{children}</div>
}
