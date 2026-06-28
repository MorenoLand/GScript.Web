import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl font-semibold tracking-tight text-primary sm:text-8xl">404</p>
      <p className="mt-5 text-lg font-medium">Page not found</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        That route doesn't exist in the codebase.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Return to gallery</Link>
      </Button>
    </div>
  )
}
