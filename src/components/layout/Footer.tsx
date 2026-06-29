import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-2 py-7 text-sm text-muted-foreground sm:flex-row">
        <p>
          #gscript, powered by{' '}
          <span className="font-medium text-foreground">Moreno.API</span>
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Graal Online is Copyright/trademarked to Toonslab and is in no way affiliated with this site.
        </p>
        <p className="flex items-center gap-3">
          <Link to="/resources" className="hover:text-primary">
            resources
          </Link>
          <span className="text-border">|</span>
          <Link to="/" className="hover:text-primary">
            home
          </Link>
        </p>
      </div>
    </footer>
  )
}
