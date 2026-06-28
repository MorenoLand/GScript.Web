import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearToken, getMe, getToken, login as apiLogin, setToken } from '@/lib/api'
import type { AuthUser, LoginResponse } from '@/lib/types'

const USER_KEY = 'gs2cb.user'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<AuthUser>
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => (getToken() ? readStoredUser() : null))
  const [isLoading, setIsLoading] = useState<boolean>(() => !!getToken())

  // On first load, validate the persisted token against /auth/user.
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
            role: me.role ?? 'user',
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

  const login = useCallback(async (username: string, password: string) => {
    const res: LoginResponse = await apiLogin(username, password)
    setToken(res.token)
    const next: AuthUser = {
      username: res.username,
      nickname: res.nickname ?? null,
      role: res.role ?? 'user',
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
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
