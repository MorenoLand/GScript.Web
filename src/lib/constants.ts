export const PAGE_SIZE = 12

export const qk = {
  snippets: (page: number) => ['gs2-snippets', { page }] as const,
  snippet: (id: number) => ['gs2-snippet', id] as const,
}

/** Common languages offered in the editor dropdown. GS2 maps to JS highlighting. */
export const LANGUAGES: { value: string; label: string }[] = [
  { value: 'gs2', label: 'GS2 (Graal Script 2)' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'gs1', label: 'GS1 (GraalScript)' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Shell' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'python', label: 'Python' },
  { value: 'php', label: 'PHP' },
]
