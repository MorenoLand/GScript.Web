import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/useAuth'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { GalleryPage } from '@/pages/GalleryPage'
import { ResourcesPage } from '@/pages/ResourcesPage'
import { ShowcaseDetailPage } from '@/pages/ShowcaseDetailPage'
import { NewShowcasePage } from '@/pages/NewShowcasePage'
import { EditShowcasePage } from '@/pages/EditShowcasePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { setToken } from '@/lib/api'
import legacyHtmlSource from './legacy/legacy.html?raw'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const legacyQueries = new Set(['beautify', 'byte', 'changes', 'docs', 'formats', 'graph', 'gsdoc', 'indexing', 'list', 'logo'])
const legacyDocsHost = 'docs.gscript.dev'
const legacyBotAdminRole = '1441076653852725420'
const legacyBotEditorRole = '1440497287427129414'

function getLegacySrc() {
  const search = window.location.search
  const hash = decodeURIComponent(window.location.hash.slice(1)).trim()
  if (window.location.hostname === legacyDocsHost) return 'docs'
  if (!search.startsWith('?')) return window.location.pathname === '/' && hash && hash.toLowerCase() !== 'browse' ? 'docs' : ''
  const key = search.slice(1).split('&')[0].split('=')[0].toLowerCase()
  return legacyQueries.has(key) ? key : ''
}

function LegacyPage({ route }: { route: string }) {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const token = hash.get('token')
  if (token) {
    setToken(token)
    const roles = (hash.get('roles') || '').split(',').filter(Boolean)
    const botAdmin = hash.get('bot_admin') === 'true' || roles.includes(legacyBotAdminRole)
    const botEditor = hash.get('bot_editor') === 'true' || roles.includes(legacyBotEditorRole)
    const authUser = {
      token,
      username: hash.get('username') || '',
      nickname: hash.get('nickname') || '',
      avatarUrl: hash.get('avatar_url') || '',
      discordId: hash.get('discord_id') || '',
      roles,
      botAdmin,
      botEditor,
      canManageShowcase: hash.get('can_manage_showcase') === 'true' || botAdmin,
      canPostShowcase: hash.get('can_post_showcase') !== 'false',
      isShowcaseBlocked: hash.get('showcase_blocked') === 'true',
    }
    const reactUser = {
      username: authUser.username,
      nickname: authUser.nickname || null,
      avatarUrl: authUser.avatarUrl || null,
      role: botAdmin ? 'admin' : (botEditor ? 'editor' : 'user'),
      canManageShowcase: authUser.canManageShowcase,
      canPostShowcase: authUser.canPostShowcase,
      isShowcaseBlocked: authUser.isShowcaseBlocked,
    }
    localStorage.setItem('gscript_discord_auth', JSON.stringify(authUser))
    localStorage.setItem('gs2cb.user', JSON.stringify(reactUser))
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search || (route === 'docs' && window.location.hostname !== legacyDocsHost ? '?docs' : '')}`)
  }
  if (route === 'docs' && !window.location.search && window.location.hostname !== legacyDocsHost) window.history.replaceState(null, '', `?docs${window.location.hash}`)
  const html = legacyHtmlSource.replace('<head>', '<head><base href="/">')
  document.open()
  document.write(html)
  document.close()
  return null
}

export default function App() {
  const legacySrc = getLegacySrc()
  if (legacySrc) return <LegacyPage route={legacySrc} />
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider delayDuration={150}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<GalleryPage />} />
                <Route path="resources" element={<ResourcesPage />} />
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
