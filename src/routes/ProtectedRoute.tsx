import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/spinner'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated) {
    const to = location.pathname + location.search + location.hash
    return <Navigate to="/login" state={{ from: to }} replace />
  }

  return <>{children}</>
}
