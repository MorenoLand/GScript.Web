import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Code2, ImageIcon, PackageOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ShowcaseCard } from '@/components/ShowcaseCard'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/EmptyState'
import { useShowcaseItemList, PAGE_SIZE } from '@/hooks/useShowcaseItems'
import { useAuth } from '@/hooks/useAuth'
import { SHOWCASE_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { DiscordFloat } from '@/components/DiscordFloat'

const heroWords = ['scripts', 'levels', 'ganis', 'graphics', 'tools', 'weird finds']

export function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [heroWordIndex, setHeroWordIndex] = useState(0)
  const pageParam = Number(searchParams.get('page')) || 1
  const page = Math.max(1, pageParam)
  const categoryParam = searchParams.get('category') ?? 'all'
  const { isAuthenticated } = useAuth()

  const { data, isLoading, isError, error, isFetching } = useShowcaseItemList(page)
  const snippets = data?.snippets ?? []
  const visibleSnippets = useMemo(
    () => categoryParam === 'all' ? snippets : snippets.filter((s) => s.category === categoryParam),
    [categoryParam, snippets],
  )
  const hasNext = snippets.length === PAGE_SIZE
  const movingSnippets = visibleSnippets.length > 0 ? Array.from({ length: 4 }, () => visibleSnippets).flat() : []
  const reversedSnippets = [...visibleSnippets].reverse()
  const movingRows = visibleSnippets.length >= 6 ? [movingSnippets, Array.from({ length: 4 }, () => reversedSnippets).flat()] : [movingSnippets]
  const heroWord = heroWords[heroWordIndex]

  useEffect(() => {
    if (document.documentElement.classList.contains('reduce-motion')) return
    const timer = window.setInterval(() => setHeroWordIndex((i) => (i + 1) % heroWords.length), 2200)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (page !== pageParam) {
      const nextParams: Record<string, string> = {}
      if (page !== 1) nextParams.page = String(page)
      if (categoryParam !== 'all') nextParams.category = categoryParam
      setSearchParams(nextParams, { replace: true })
    }
  }, [categoryParam, page, pageParam, setSearchParams])

  function setPage(next: number) {
    const nextParams: Record<string, string> = {}
    if (next !== 1) nextParams.page = String(next)
    if (categoryParam !== 'all') nextParams.category = categoryParam
    setSearchParams(nextParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function setCategory(next: string) {
    setSearchParams(next === 'all' ? {} : { category: next })
  }

  return (
    <div>
      <section className="showcase-hero border-b border-border">
        <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-16 text-center sm:py-20">
          <DiscordFloat />
          <div className="showcase-mark" aria-hidden="true">
            <img src="/zelda-character.png" alt="" />
          </div>
          <h1 className="mx-auto max-w-5xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Built for <span key={heroWord} className="showcase-hero-word">{heroWord}</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-xl">
            Scripts, levels, ganis, graphics, tools, and odd little discoveries from the #gscript crew.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <a href="#browse">
                Browse
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to={isAuthenticated ? '/new' : '/login'}>
                Publish
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {movingSnippets.length > 0 && (
            <div className="showcase-rail" aria-label="Recent showcase items">
              {movingRows.map((row, rowIndex) => (
                <div key={rowIndex} className={cn('showcase-rail-track', rowIndex === 1 && 'showcase-rail-track-alt')}>
                  {row.map((snippet, index) => (
                    <Link
                      key={`${rowIndex}-${snippet.id}-${index}`}
                      to={`/snippet/${snippet.id}`}
                      className="showcase-rail-card"
                    >
                      <span className="showcase-rail-icon">
                        {snippet.thumbnailData ? (
                          <img src={`data:${snippet.thumbnailMimeType || 'image/png'};base64,${snippet.thumbnailData}`} alt="" className="h-full w-full rounded-[inherit] object-cover" />
                        ) : snippet.imageCount > 0 ? <ImageIcon className="h-5 w-5" /> : <Code2 className="h-5 w-5" />}
                      </span>
                      <span className="min-w-0 text-left">
                        <span className="block truncate font-semibold text-foreground">{snippet.title}</span>
                        <span className="block truncate text-sm text-muted-foreground">
                          {snippet.author}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="browse" className="container scroll-mt-20 py-10">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">Latest additions</h2>
          <div className="h-px flex-1 bg-border" />
          {data && (
            <span className="text-sm text-muted-foreground">{visibleSnippets.length}</span>
          )}
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {[{ value: 'all', label: 'All' }, ...SHOWCASE_CATEGORIES].map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm transition-colors',
                categoryParam === c.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {isError ? (
          <EmptyState
            icon={<PackageOpen className="h-6 w-6" />}
            title="Couldn't load showcase items"
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
        ) : visibleSnippets.length === 0 ? (
          <EmptyState
            icon={<PackageOpen className="h-6 w-6" />}
            title={snippets.length === 0 ? 'No showcase items yet' : 'No items in this category'}
            description={snippets.length === 0 ? 'Be the first to publish something.' : 'Try another category.'}
            action={
              isAuthenticated && snippets.length === 0 ? (
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
              {visibleSnippets.map((s) => (
                <ShowcaseCard key={s.id} snippet={s} />
              ))}
            </div>
            <Pagination page={page} hasNext={hasNext} onChange={setPage} loading={isFetching} />
          </>
        )}
      </section>
    </div>
  )
}
