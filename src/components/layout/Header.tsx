import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Code2, LogOut, Plus, User as UserIcon, ChevronDown } from 'lucide-react'
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

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft transition-transform group-hover:-translate-y-0.5">
            <Code2 className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            GS2 <span className="text-muted-foreground">Codebase</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'hidden rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:inline-flex',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
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
                  <button className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="hidden max-w-[120px] truncate sm:inline">
                      {user?.nickname || user?.username}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
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
