import type { ListResponse, SnippetDetail, SnippetPayload } from '@/lib/types'

const BASE = import.meta.env.VITE_API_URL ?? 'https://api.moreno.land'

export const TOKEN_KEY = 'gs2cb.token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  body: unknown
  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  signal?: AbortSignal
  /** When true, send as application/json (default). */
  json?: boolean
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = opts
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res: Response
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    throw new ApiError('Network error — is the API reachable?', 0, e)
  }

  const text = await res.text()
  const data = text ? safeParse(text) : null

  if (!res.ok) {
    const message = extractMessage(data) ?? res.statusText ?? 'Request failed'
    throw new ApiError(message, res.status, data)
  }
  return data as T
}

function extractMessage(data: unknown): string | null {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (typeof obj.error === 'string') return obj.error
    if (typeof obj.detail === 'string') return obj.detail
    if (typeof obj.title === 'string') return obj.title
  }
  if (typeof data === 'string' && data.length) return data
  return null
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

// ---- Auth ----------------------------------------------------------------

export function getDiscordLoginUrl(returnUrl = window.location.href) {
  return `${BASE}/api/auth/discord/login?returnUrl=${encodeURIComponent(returnUrl)}`
}

export function getMe() {
  return request<{ username: string; nickname?: string | null; avatarUrl?: string | null; avatar_url?: string | null; role?: string; canManageShowcase?: boolean; canPostShowcase?: boolean; isShowcaseBlocked?: boolean }>(
    '/api/auth/user',
  )
}

// ---- GScript Showcase ----------------------------------------------------

export function listSnippets(limit: number, offset: number, signal?: AbortSignal) {
  return request<ListResponse>(
    `/api/gscript-showcase?limit=${limit}&offset=${offset}`,
    { signal },
  )
}

export function getSnippet(id: number, signal?: AbortSignal) {
  return request<SnippetDetail>(`/api/gscript-showcase/${id}`, { signal })
}

export function createSnippet(payload: SnippetPayload) {
  return request<{ success: boolean; id: number }>('/api/gscript-showcase', {
    method: 'POST',
    body: payload,
  })
}

export function updateSnippet(id: number, payload: SnippetPayload) {
  return request<{ success: boolean }>(`/api/gscript-showcase/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export function deleteSnippet(id: number) {
  return request<{ success: boolean }>(`/api/gscript-showcase/${id}`, {
    method: 'DELETE',
  })
}
