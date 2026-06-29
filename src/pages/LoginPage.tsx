import { Link, useLocation } from 'react-router-dom'
import { LogIn, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getDiscordLoginUrl } from '@/lib/api'

export function LoginPage() {
  const location = useLocation() as { state?: { from?: string } }
  const from = location.state?.from
  const returnUrl = new URL(from && from !== '/login' ? from : '/', window.location.origin).toString()

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <LogIn className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Required only to publish or edit showcase items
          </p>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-soft">
          <Button asChild className="w-full">
            <a href={getDiscordLoginUrl(returnUrl)}>Sign in with Discord</a>
          </Button>

          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />
            Browsing the gallery is public. Sign in only to publish or edit.
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            ← back to gallery
          </Link>
        </p>
      </div>
    </div>
  )
}
