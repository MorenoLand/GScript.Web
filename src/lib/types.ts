// Types mirror the Moreno.API GS2 Codebase contract (Endpoints/GS2CodebaseEndpoints.cs).

export interface SnippetListItem {
  id: number
  title: string
  description: string | null
  category?: string | null
  thumbnailMimeType?: string | null
  thumbnailData?: string | null
  author: string
  uploaderId: string
  createdAt: string
  editedAt: string
  fileCount: number
  imageCount: number
}

export interface ListResponse {
  snippets: SnippetListItem[]
}

export interface SnippetFile {
  filename: string
  language: string | null
  content: string
  position: number
}

/** Image attachment — `data` is base64 (no data-url prefix). */
export interface SnippetImage {
  filename: string
  mimeType: string | null
  data: string
  position: number
}

export interface SnippetDetail {
  id: number
  title: string
  description: string | null
  category?: string | null
  thumbnailMimeType?: string | null
  thumbnailData?: string | null
  author: string
  uploaderId: string
  createdAt: string
  editedAt: string
  files: SnippetFile[]
  images: SnippetImage[]
}

export interface SnippetFileInput {
  filename: string
  language?: string | null
  content: string
}

export interface SnippetImageInput {
  filename: string
  mimeType?: string | null
  data: string // base64
}

export interface SnippetPayload {
  title: string
  description?: string | null
  category?: string | null
  thumbnailMimeType?: string | null
  thumbnailData?: string | null
  author: string
  files: SnippetFileInput[]
  images?: SnippetImageInput[]
}

export type ShowcaseListItem = SnippetListItem
export type ShowcaseDetail = SnippetDetail
export type ShowcaseFileInput = SnippetFileInput
export type ShowcaseImageInput = SnippetImageInput
export type ShowcasePayload = SnippetPayload

export interface AuthUser {
  username: string
  nickname?: string | null
  avatarUrl?: string | null
  avatar_url?: string | null
  role: string
  canManageShowcase?: boolean
  canPostShowcase?: boolean
  isShowcaseBlocked?: boolean
}

export interface LoginResponse {
  token: string
  username: string
  nickname: string | null
  role: string
}
