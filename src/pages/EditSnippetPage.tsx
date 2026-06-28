import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { SnippetForm } from '@/components/SnippetForm'
import { EmptyState } from '@/components/EmptyState'
import { useSnippet, useUpdateSnippet } from '@/hooks/useSnippets'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api'
import type { SnippetPayload } from '@/lib/types'

export function EditSnippetPage() {
  const { id } = useParams<{ id: string }>()
  const numId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: snippet, isLoading, isError } = useSnippet(numId)
  const update = useUpdateSnippet(numId)

  if (isLoading) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center py-10">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (isError || !snippet) {
    return (
      <div className="container py-10">
        <EmptyState
          title="Snippet not found"
          description="It may have been deleted."
          action={
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" /> Back to gallery
              </Link>
            </Button>
          }
        />
      </div>
    )
  }

  const canMutate =
    !!user && (user.username === snippet.uploaderId || user.role === 'admin')
  if (!canMutate) {
    return (
      <div className="container py-10">
        <EmptyState
          icon={<ShieldAlert className="h-6 w-6" />}
          title="Not allowed"
          description="Only the uploader or an admin can edit this snippet."
          action={
            <Button asChild>
              <Link to={`/snippet/${snippet.id}`}>View snippet</Link>
            </Button>
          }
        />
      </div>
    )
  }

  async function onSubmit(payload: SnippetPayload) {
    try {
      await update.mutateAsync(payload)
      toast.success('Snippet updated')
      navigate(`/snippet/${numId}`)
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Update failed')
    }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-5 -ml-2">
          <Link to={`/snippet/${numId}`}>
            <ArrowLeft className="h-4 w-4" /> Back to snippet
          </Link>
        </Button>

        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
            <Pencil className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit snippet</h1>
            <p className="truncate text-sm text-muted-foreground">{snippet.title}</p>
          </div>
        </div>

        <SnippetForm
          initial={snippet}
          submitLabel="Save changes"
          submitting={update.isPending}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}
