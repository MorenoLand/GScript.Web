import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LogOut, Plus, User as UserIcon, ChevronDown, Lightbulb, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const canPost = isAuthenticated && user?.canPostShowcase !== false && !user?.isShowcaseBlocked
  const [heroTop, setHeroTop] = useState(() => window.location.pathname === '/' && window.scrollY < 120)
  const [dark, setDark] = useState(() => localStorage.getItem('gscript-showcase-theme') !== 'light')
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('gscript-showcase-motion') === 'reduced')
  const hideHeroActions = location.pathname === '/' && heroTop

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('gscript-showcase-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion)
    localStorage.setItem('gscript-showcase-motion', reducedMotion ? 'reduced' : 'full')
  }, [reducedMotion])

  useEffect(() => {
    function syncHeroTop() {
      setHeroTop(location.pathname === '/' && window.scrollY < 120)
    }
    syncHeroTop()
    window.addEventListener('scroll', syncHeroTop, { passive: true })
    return () => window.removeEventListener('scroll', syncHeroTop)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 pt-4">
      <div className="container">
        <div className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/72 px-4 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-background/58">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center transition-transform group-hover:-translate-y-0.5">
            <img src="/graalicon_big.png" alt="" className="h-8 w-8 object-contain [image-rendering:pixelated]" />
          </span>
          <span className="brand-discord text-[15px] font-semibold tracking-tight">
            #gscript <span className="text-muted-foreground">showcase</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <span className={cn('flex items-center gap-2 transition-all duration-300 ease-out', hideHeroActions && 'pointer-events-none translate-y-2 opacity-0')}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'hidden rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:inline-flex',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              Browse
            </NavLink>
            {canPost && (
              <>
                <Button asChild size="sm" className="hidden sm:inline-flex">
                  <Link to="/new">
                    <Plus className="h-4 w-4" />
                    Publish
                  </Link>
                </Button>
                <Button asChild size="icon" variant="outline" className="sm:hidden">
                  <Link to="/new" aria-label="Publish">
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </span>
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="hidden max-w-[120px] truncate sm:inline">
                      {user?.nickname || user?.username}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {canPost && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/new')}>
                        <Plus className="h-4 w-4" /> New item
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      logout()
                      navigate('/')
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDark((v) => !v)}>
                <Lightbulb className={cn('h-4 w-4', dark && 'fill-primary text-primary')} />
                {dark ? 'Light mode' : 'Dark mode'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setReducedMotion((v) => !v)}>
                <Settings className="h-4 w-4" />
                {reducedMotion ? 'Full motion' : 'Reduce motion'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        </div>
      </div>
    </header>
  )
}
