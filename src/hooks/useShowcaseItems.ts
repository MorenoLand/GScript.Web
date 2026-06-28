import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import {
  createSnippet,
  deleteSnippet,
  getSnippet,
  listSnippets,
  updateSnippet,
} from '@/lib/api'
import { PAGE_SIZE, qk } from '@/lib/constants'
import type { ShowcasePayload } from '@/lib/types'

export function useShowcaseItemList(page: number) {
  const offset = Math.max(0, (page - 1) * PAGE_SIZE)
  return useQuery({
    queryKey: qk.snippets(page),
    queryFn: ({ signal }) => listSnippets(PAGE_SIZE, offset, signal),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function useShowcaseItem(id: number) {
  return useQuery({
    queryKey: qk.snippet(id),
    queryFn: ({ signal }) => getSnippet(id, signal),
    enabled: !!id,
  })
}

export function useCreateShowcaseItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ShowcasePayload) => createSnippet(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gs2-snippets'] })
    },
  })
}

export function useUpdateShowcaseItem(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ShowcasePayload) => updateSnippet(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gs2-snippets'] })
      qc.invalidateQueries({ queryKey: qk.snippet(id) })
    },
  })
}

export function useDeleteShowcaseItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSnippet(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gs2-snippets'] })
    },
  })
}

export { PAGE_SIZE }
