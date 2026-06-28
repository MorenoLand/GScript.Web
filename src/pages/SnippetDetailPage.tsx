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
import { useDeleteSnippet, useSnippet } from '@/hooks/useSnippets'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/format'
import { toast } from 'sonner'

export function SnippetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const numId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: snippet, isLoading, isError, error } = useSnippet(numId)
  const deleteMutation = useDeleteSnippet()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (Number.isNaN(numId)) {
    return (
      <PageShell>
        <EmptyState title="Invalid snippet" description="That ID doesn't look right." />
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
          title="Snippet not found"
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
    !!user && (user.username === snippet.uploaderId || user.role === 'admin')
  const edited = snippet.editedAt && snippet.editedAt !== snippet.createdAt

  async function doDelete() {
    try {
      await deleteMutation.mutateAsync(snippet!.id)
      toast.success('Snippet deleted')
      navigate('/')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setConfirmOpen(false)
    }
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
              <CodeBlock
                key={`${f.filename}-${i}`}
                code={f.content}
                language={f.language ?? undefined}
                filename={f.filename}
              />
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
            <DialogTitle>Delete this snippet?</DialogTitle>
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
