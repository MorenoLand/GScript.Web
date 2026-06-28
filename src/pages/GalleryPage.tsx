import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PackageOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SnippetCard } from '@/components/SnippetCard'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/EmptyState'
import { useSnippetList, PAGE_SIZE } from '@/hooks/useSnippets'
import { useAuth } from '@/hooks/useAuth'

export function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageParam = Number(searchParams.get('page')) || 1
  const page = Math.max(1, pageParam)
  const { isAuthenticated } = useAuth()

  const { data, isLoading, isError, error, isFetching } = useSnippetList(page)
  const snippets = data?.snippets ?? []
  const hasNext = snippets.length === PAGE_SIZE

  useEffect(() => {
    if (page !== pageParam) {
      setSearchParams(page === 1 ? {} : { page: String(page) }, { replace: true })
    }
  }, [page, pageParam, setSearchParams])

  function setPage(next: number) {
    setSearchParams(next === 1 ? {} : { page: String(next) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Intro */}
      <section className="border-b border-border">
        <div className="container py-12 sm:py-16">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            GS2 Codebase
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A community archive of Graal Script 2 snippets, projects and code.
            Browse what others shipped, read it, reuse it.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="container py-10">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">Latest snippets</h2>
          <div className="h-px flex-1 bg-border" />
          {data && (
            <span className="text-sm text-muted-foreground">{snippets.length}</span>
          )}
        </div>

        {isError ? (
          <EmptyState
            icon={<PackageOpen className="h-6 w-6" />}
            title="Couldn't load snippets"
            description={
              error instanceof Error ? error.message : 'The API may be offline.'
            }
            action={
              <Button variant="outline" onClick={() => location.reload()}>
                Retry
              </Button>
            }
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-xl" />
            ))}
          </div>
        ) : snippets.length === 0 ? (
          <EmptyState
            icon={<PackageOpen className="h-6 w-6" />}
            title="No snippets yet"
            description="Be the first to publish a GS2 snippet to the codebase."
            action={
              isAuthenticated ? (
                <Button asChild>
                  <Link to="/new">
                    <Plus className="h-4 w-4" />
                    Publish the first one
                  </Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {snippets.map((s) => (
                <SnippetCard key={s.id} snippet={s} />
              ))}
            </div>
            <Pagination page={page} hasNext={hasNext} onChange={setPage} loading={isFetching} />
          </>
        )}
      </section>
    </div>
  )
}
