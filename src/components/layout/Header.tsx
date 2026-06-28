import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Terminal, LogOut, Plus, User as UserIcon, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center border border-primary bg-primary/10 text-primary shadow-pixel-amber transition-transform group-hover:-translate-y-0.5">
            <Terminal className="h-5 w-5" />
          </span>
          <span className="font-mono text-lg font-extrabold tracking-tight">
            <span className="text-primary text-glow-amber">GS2</span>
            <span className="text-muted-foreground">//</span>
            <span>CODEBASE</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'hidden font-mono text-xs font-semibold uppercase tracking-wider sm:inline-flex',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            Browse
          </NavLink>

          {isAuthenticated ? (
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 border border-border px-2 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-primary hover:text-primary">
                    <UserIcon className="h-4 w-4 text-phosphor" />
                    <span className="hidden max-w-[120px] truncate sm:inline">
                      {user?.nickname || user?.username}
                    </span>
                    {user?.role === 'admin' && (
                      <Badge variant="secondary" className="hidden md:inline-flex">
                        admin
                      </Badge>
                    )}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/new')}>
                    <Plus className="h-4 w-4" /> New snippet
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
        </nav>
      </div>
    </header>
  )
}
