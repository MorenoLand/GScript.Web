import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 font-mono text-xs text-muted-foreground sm:flex-row">
        <p>
          <span className="text-primary">GS2//CODEBASE</span> — powered by{' '}
          <span className="text-foreground">Moreno.API</span>
        </p>
        <p className="flex items-center gap-1.5">
          <span className="text-phosphor">▌</span>
          public snippet archive
          <span className="mx-1 text-border">|</span>
          <Link to="/" className="hover:text-primary">
            browse
          </Link>
        </p>
      </div>
    </footer>
  )
}
