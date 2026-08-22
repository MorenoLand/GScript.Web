import { Link } from 'react-router-dom'

export function Footer() {
  const scrollHomeTop = () => window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))

  return (
    <footer className="mt-20 border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-2 py-7 text-sm text-muted-foreground sm:flex-row">
        <p>
          powered by{' '}
          <span className="font-medium text-foreground">Moreno.API</span>
        </p>
        <div className="text-center text-xs text-muted-foreground">
          <p>Graal Online is Copyright/trademarked to Toonslab and is in no way affiliated with this site.</p>
          <p>
            Want to support #gscript?{' '}
            <a href="https://ko-fi.com/denveous" target="_blank" rel="noreferrer" className="hover:text-primary">
              Toss Denveous a kombucha on Ko-fi.
            </a>
          </p>
        </div>
        <p className="flex items-center gap-3">
          <Link to="/resources" className="footer-resources-disabled hover:text-primary">
            resources
          </Link>
          <span className="footer-resources-disabled text-border">|</span>
          <Link to="/" onClick={scrollHomeTop} className="hover:text-primary">
            home
          </Link>
        </p>
      </div>
    </footer>
  )
}
