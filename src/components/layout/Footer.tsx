import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-2 py-7 text-sm text-muted-foreground sm:flex-row">
        <p>
          GS2 Codebase, powered by{' '}
          <span className="font-medium text-foreground">Moreno.API</span>
        </p>
        <p className="flex items-center gap-3">
          <span>public snippet archive</span>
          <span className="text-border">|</span>
          <Link to="/" className="hover:text-primary">
            browse
          </Link>
        </p>
      </div>
    </footer>
  )
}
