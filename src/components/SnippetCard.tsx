import { Link } from 'react-router-dom'
import { FileCode2, ImageIcon, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatRelative } from '@/lib/format'
import type { SnippetListItem } from '@/lib/types'

export function SnippetCard({ snippet }: { snippet: SnippetListItem }) {
  return (
    <Link
      to={`/snippet/${snippet.id}`}
      className={cn(
        'group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-200',
        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-card',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
          {snippet.title}
        </h3>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary" />
      </div>

      {snippet.description ? (
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {snippet.description}
        </p>
      ) : (
        <p className="mb-4 text-sm italic text-muted-foreground/50">No description</p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2">
        {snippet.fileCount > 0 && (
          <Badge variant="muted">
            <FileCode2 className="h-3 w-3" />
            {snippet.fileCount} {snippet.fileCount === 1 ? 'file' : 'files'}
          </Badge>
        )}
        {snippet.imageCount > 0 && (
          <Badge variant="muted">
            <ImageIcon className="h-3 w-3" />
            {snippet.imageCount} {snippet.imageCount === 1 ? 'image' : 'images'}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="text-primary/70">@</span>
          <span className="truncate font-medium text-foreground/80">{snippet.author}</span>
        </span>
        <span>{formatRelative(snippet.createdAt)}</span>
      </div>
    </Link>
  )
}
