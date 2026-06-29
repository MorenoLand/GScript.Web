import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileCode2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShowcaseForm } from '@/components/ShowcaseForm'
import { EmptyState } from '@/components/EmptyState'
import { useCreateShowcaseItem } from '@/hooks/useShowcaseItems'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api'
import type { ShowcasePayload } from '@/lib/types'

export function NewShowcasePage() {
  const navigate = useNavigate()
  const create = useCreateShowcaseItem()
  const { user } = useAuth()
  const canPost = !!user && user.canPostShowcase !== false && !user.isShowcaseBlocked

  if (!canPost) {
    return (
      <div className="showcase-page showcase-page-under-header">
        <div className="container py-10">
          <EmptyState title="Posting disabled" description="This Discord account cannot publish showcase items." />
        </div>
      </div>
    )
  }

  async function onSubmit(payload: ShowcasePayload) {
    try {
      const res = await create.mutateAsync(payload)
      toast.success('Showcase item published')
      navigate(`/snippet/${res.id}`)
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Publish failed')
    }
  }

  return (
    <div className="showcase-page showcase-page-under-header">
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
            <h1 className="text-2xl font-semibold tracking-tight">Publish showcase item</h1>
            <p className="text-sm text-muted-foreground">Add to #gscript showcase</p>
          </div>
        </div>

        <ShowcaseForm
          submitLabel="Publish item"
          submitting={create.isPending}
          onSubmit={onSubmit}
        />
        </div>
      </div>
    </div>
  )
}
