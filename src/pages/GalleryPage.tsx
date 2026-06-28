import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PackageOpen, Plus, Terminal, Zap } from 'lucide-react'
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
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="scanlines absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-phosphor/5" />
        <div className="container relative py-14 sm:py-20">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-phosphor">
            <Terminal className="h-4 w-4" />
            <span>moreno.api &gt; gs2-codebase</span>
          </div>
          <h1 className="mt-4 max-w-3xl font-mono text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="text-primary text-glow-amber">GS2</span>{' '}
            <span className="text-foreground">codebase</span>
            <span className="ml-1 inline-block h-9 w-3 translate-y-1 animate-blink bg-primary sm:h-12" />
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A retro archive of Graal Script 2 snippets, projects and code. Browse what the
            community shipped, grab what you need, publish your own.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <Button asChild size="lg">
                <Link to="/new">
                  <Plus className="h-4 w-4" />
                  Publish a snippet
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline">
                <Link to="/login">
                  <Zap className="h-4 w-4" />
                  Sign in to publish
                </Link>
              </Button>
            )}
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {data ? `${snippets.length} on this page` : 'loading…'}
            </span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container py-10">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            <span className="text-primary">▌</span> latest snippets
          </h2>
          <div className="h-px flex-1 bg-border" />
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
              <Skeleton key={i} className="h-56 w-full" />
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
              ) : (
                <Button asChild variant="outline">
                  <Link to="/login">Sign in to publish</Link>
                </Button>
              )
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
