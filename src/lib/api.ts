import type {
  ListResponse,
  LoginResponse,
  SnippetDetail,
  SnippetPayload,
} from '@/lib/types'

// Empty base => relative requests (works in dev via the Vite proxy and in prod
// when served from the same origin as the API). Override with VITE_API_URL.
const BASE = import.meta.env.VITE_API_URL ?? ''

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

export function login(username: string, password: string) {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: { username, password },
  })
}

export function getMe() {
  return request<{ username: string; nickname?: string | null; role?: string }>(
    '/api/auth/user',
  )
}

// ---- GS2 Codebase --------------------------------------------------------

export function listSnippets(limit: number, offset: number, signal?: AbortSignal) {
  return request<ListResponse>(
    `/api/gs2-codebase/?limit=${limit}&offset=${offset}`,
    { signal },
  )
}

export function getSnippet(id: number, signal?: AbortSignal) {
  return request<SnippetDetail>(`/api/gs2-codebase/${id}`, { signal })
}

export function createSnippet(payload: SnippetPayload) {
  return request<{ success: boolean; id: number }>('/api/gs2-codebase/', {
    method: 'POST',
    body: payload,
  })
}

export function updateSnippet(id: number, payload: SnippetPayload) {
  return request<{ success: boolean }>(`/api/gs2-codebase/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export function deleteSnippet(id: number) {
  return request<{ success: boolean }>(`/api/gs2-codebase/${id}`, {
    method: 'DELETE',
  })
}
