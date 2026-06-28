import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, ShieldCheck, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { ApiError } from '@/lib/api'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const from = location.state?.from

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate(from && from !== '/login' ? from : '/new', { replace: true })
    } catch (e2) {
      setError(
        e2 instanceof ApiError
          ? e2.status === 0
            ? e2.message
            : 'Invalid username or password.'
          : 'Sign in failed.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center border border-primary bg-primary/10 text-primary shadow-pixel-amber">
            <Terminal className="h-6 w-6" />
          </span>
          <h1 className="font-mono text-2xl font-extrabold tracking-tight">
            <span className="text-primary">authenticate</span>
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            panel access required to publish
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your handle"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="border border-destructive/50 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              'Authenticating…'
            ) : (
              <>
                <LogIn className="h-4 w-4" /> Sign in
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-phosphor" />
            Browsing is public — sign in only to publish or edit your snippets.
          </div>
        </form>

        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            ← back to gallery
          </Link>
        </p>
      </div>
    </div>
  )
}
