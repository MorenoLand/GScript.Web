import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { LogOut, Plus, User as UserIcon, ChevronDown, Lightbulb, Settings, MessageCircle } from 'lucide-react'
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
  const [openDropdown, setOpenDropdown] = useState<'account' | 'settings' | null>(null)
  const closeDropdownTimer = useRef<number | null>(null)
  const hideHeroActions = location.pathname === '/' && heroTop
  const openMenu = (menu: 'account' | 'settings') => {
    if (closeDropdownTimer.current) window.clearTimeout(closeDropdownTimer.current)
    setOpenDropdown(menu)
  }
  const closeMenu = (menu: 'account' | 'settings') => {
    if (closeDropdownTimer.current) window.clearTimeout(closeDropdownTimer.current)
    closeDropdownTimer.current = window.setTimeout(() => setOpenDropdown((open) => open === menu ? null : open), 180)
  }

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

  useEffect(() => () => {
    if (closeDropdownTimer.current) window.clearTimeout(closeDropdownTimer.current)
  }, [])

  return (
    <header className="sticky top-0 z-40 pt-4">
      <div className="container">
        <div className="relative flex h-14 items-center justify-between gap-4 px-4">
        <a href="https://gscript.dev" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center transition-transform group-hover:-translate-y-0.5">
            <img src="/gfx/graalserver_icon.png" alt="" className="h-8 w-8 object-contain [image-rendering:pixelated]" />
          </span>
          <span className="brand-discord text-[15px] font-semibold tracking-tight">
            #gscript
          </span>
        </a>

        <div aria-hidden="true" className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex showcase-top-links-disabled">
            <Link to="/resources" className={cn("rounded-md px-3 py-1.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", location.pathname === '/resources' && !location.hash && "bg-accent text-foreground")}>Resources</Link>
            <Link to="/resources#tools" className={cn("rounded-md px-3 py-1.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", location.pathname === '/resources' && location.hash === '#tools' && "bg-accent text-foreground")}>Tools</Link>
            <a href="https://suite.gscript.dev" className="rounded-md px-3 py-1.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Suite</a>
            <a href="https://docs.gscript.dev" className="rounded-md px-3 py-1.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Docs</a>
            <a href="https://wiki.gscript.dev/Creation/Dev/GScript" className="rounded-md px-3 py-1.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Wiki</a>
            <a href="https://forums.gscript.dev/" className="rounded-md px-3 py-1.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Forums</a>
            <a href="https://discord.gscript.dev" className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <MessageCircle className="h-4 w-4" />
              Discord
            </a>
        </div>
        <nav className="ml-auto flex shrink-0 items-center gap-2">
          <span className={cn('showcase-header-actions flex items-center gap-2 transition-all duration-300 ease-out', hideHeroActions && 'pointer-events-none translate-y-2 opacity-0')}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'hidden rounded-md px-3 py-1.5 text-[15px] font-medium transition-colors sm:inline-flex',
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
              <DropdownMenu modal={false} open={openDropdown === 'account'} onOpenChange={(open) => setOpenDropdown(open ? 'account' : null)}>
                <DropdownMenuTrigger asChild>
                  <button onPointerEnter={() => openMenu('account')} onPointerLeave={() => closeMenu('account')} className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground transition-colors hover:bg-accent focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="hidden max-w-[120px] truncate text-[15px] sm:inline">
                      {user?.nickname || user?.username}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={0} onPointerEnter={() => openMenu('account')} onPointerLeave={() => closeMenu('account')}>
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
            <span className={cn('showcase-header-actions transition-all duration-300 ease-out', hideHeroActions && 'pointer-events-none translate-y-2 opacity-0')}>
              <Button asChild size="sm" variant="outline">
                <Link to="/login" state={{ from: `${location.pathname}${location.search}${location.hash}` }}>Sign in</Link>
              </Button>
            </span>
          )}
          <DropdownMenu modal={false} open={openDropdown === 'settings'} onOpenChange={(open) => setOpenDropdown(open ? 'settings' : null)}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onPointerEnter={() => openMenu('settings')}
                onPointerLeave={() => closeMenu('settings')}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={0} onPointerEnter={() => openMenu('settings')} onPointerLeave={() => closeMenu('settings')}>
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="theme-mode-option-disabled" onClick={() => setDark((v) => !v)}>
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
