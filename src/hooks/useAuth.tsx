import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearToken, getMe, getToken, setToken } from '@/lib/api'
import type { AuthUser } from '@/lib/types'

const USER_KEY = 'gs2cb.user'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  loginWithDiscordToken: (token: string, username: string, nickname?: string | null, avatarUrl?: string | null) => AuthUser
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function readDiscordOAuthUser(): AuthUser | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const token = hash.get('token')
  const username = hash.get('username')
  if (!token || !username) return null
  const next: AuthUser = {
    username,
    nickname: hash.get('nickname'),
    avatarUrl: hash.get('avatar_url'),
    role: hash.get('bot_admin') === 'true' ? 'admin' : hash.get('bot_editor') === 'true' ? 'editor' : 'user',
    canManageShowcase: hash.get('can_manage_showcase') === 'true',
    canPostShowcase: hash.get('can_post_showcase') !== 'false',
    isShowcaseBlocked: hash.get('showcase_blocked') === 'true',
  }
  setToken(token)
  localStorage.setItem(USER_KEY, JSON.stringify(next))
  return next
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readDiscordOAuthUser() ?? (getToken() ? readStoredUser() : null))
  const [isLoading, setIsLoading] = useState<boolean>(() => !!getToken())

  useEffect(() => {
    if (window.location.hash.includes('token=')) window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }
    let cancelled = false
    getMe()
      .then((me) => {
        if (cancelled) return
        if (!me || me.username === 'Guest' || !me.username) {
          clearToken()
          localStorage.removeItem(USER_KEY)
          setUser(null)
        } else {
          const next: AuthUser = {
            username: me.username,
            nickname: me.nickname ?? null,
            avatarUrl: me.avatarUrl ?? me.avatar_url ?? null,
            role: me.role ?? 'user',
            canManageShowcase: !!me.canManageShowcase,
            canPostShowcase: me.canPostShowcase !== false,
            isShowcaseBlocked: !!me.isShowcaseBlocked,
          }
          localStorage.setItem(USER_KEY, JSON.stringify(next))
          setUser(next)
        }
      })
      .catch(() => {
        if (cancelled) return
        clearToken()
        localStorage.removeItem(USER_KEY)
        setUser(null)
      })
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const loginWithDiscordToken = useCallback((token: string, username: string, nickname?: string | null, avatarUrl?: string | null) => {
    setToken(token)
    const next: AuthUser = {
      username,
      nickname: nickname ?? null,
      avatarUrl: avatarUrl ?? null,
      role: 'user',
    }
    localStorage.setItem(USER_KEY, JSON.stringify(next))
    setUser(next)
    return next
  }, [])

  const logout = useCallback(() => {
    clearToken()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      loginWithDiscordToken,
      logout,
    }),
    [user, isLoading, loginWithDiscordToken, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
