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
        'group relative flex flex-col border border-border bg-card p-5 transition-all duration-150',
        'hover:-translate-y-1 hover:border-primary hover:shadow-pixel-amber',
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 font-mono text-base font-bold leading-snug text-foreground group-hover:text-primary">
          {snippet.title}
        </h3>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      {snippet.description ? (
        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
          {snippet.description}
        </p>
      ) : (
        <p className="mb-4 text-sm italic text-muted-foreground/50">No description</p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2">
        {snippet.fileCount > 0 && (
          <Badge variant="default">
            <FileCode2 className="mr-1 h-3 w-3" />
            {snippet.fileCount} {snippet.fileCount === 1 ? 'file' : 'files'}
          </Badge>
        )}
        {snippet.imageCount > 0 && (
          <Badge variant="secondary">
            <ImageIcon className="mr-1 h-3 w-3" />
            {snippet.imageCount} {snippet.imageCount === 1 ? 'img' : 'imgs'}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="text-phosphor">@</span>
          <span className="truncate text-foreground">{snippet.author}</span>
        </span>
        <span>{formatRelative(snippet.createdAt)}</span>
      </div>
    </Link>
  )
}
