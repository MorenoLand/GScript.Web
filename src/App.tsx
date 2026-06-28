import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/useAuth'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { GalleryPage } from '@/pages/GalleryPage'
import { ShowcaseDetailPage } from '@/pages/ShowcaseDetailPage'
import { NewShowcasePage } from '@/pages/NewShowcasePage'
import { EditShowcasePage } from '@/pages/EditShowcasePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider delayDuration={150}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<GalleryPage />} />
                <Route path="snippet/:id" element={<ShowcaseDetailPage />} />
                <Route
                  path="new"
                  element={
                    <ProtectedRoute>
                      <NewShowcasePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="snippet/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditShowcasePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="login" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
