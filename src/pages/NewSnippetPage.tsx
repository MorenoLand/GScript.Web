import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileCode2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SnippetForm } from '@/components/SnippetForm'
import { useCreateSnippet } from '@/hooks/useSnippets'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api'
import type { SnippetPayload } from '@/lib/types'

export function NewSnippetPage() {
  const navigate = useNavigate()
  const create = useCreateSnippet()

  async function onSubmit(payload: SnippetPayload) {
    try {
      const res = await create.mutateAsync(payload)
      toast.success('Snippet published')
      navigate(`/snippet/${res.id}`)
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Publish failed')
    }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-5 -ml-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Gallery
          </Link>
        </Button>

        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
            <FileCode2 className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Publish snippet</h1>
            <p className="text-sm text-muted-foreground">Add to the GS2 codebase</p>
          </div>
        </div>

        <SnippetForm
          submitLabel="Publish snippet"
          submitting={create.isPending}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}
