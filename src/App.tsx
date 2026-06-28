import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/useAuth'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { GalleryPage } from '@/pages/GalleryPage'
import { SnippetDetailPage } from '@/pages/SnippetDetailPage'
import { NewSnippetPage } from '@/pages/NewSnippetPage'
import { EditSnippetPage } from '@/pages/EditSnippetPage'
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
                <Route path="snippet/:id" element={<SnippetDetailPage />} />
                <Route
                  path="new"
                  element={
                    <ProtectedRoute>
                      <NewSnippetPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="snippet/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditSnippetPage />
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
