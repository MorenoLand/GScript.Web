import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  page: number
  hasNext: boolean
  onChange: (page: number) => void
  loading?: boolean
}

export function Pagination({ page, hasNext, onChange, loading }: PaginationProps) {
  const canPrev = page > 1 && !loading
  const canNext = hasNext && !loading

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        disabled={!canPrev}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </Button>

      <span className="min-w-[80px] text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        page <span className="text-primary">{page}</span>
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={!canNext}
        onClick={() => onChange(page + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
