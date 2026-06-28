/** Read a File as base64 (no data-url prefix). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') return reject(new Error('Could not read file'))
      // strip "data:<mime>;base64,"
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Read error'))
    reader.readAsDataURL(file)
  })
}

export function imageDataUrl(mime: string | null | undefined, base64: string): string {
  return `data:${mime || 'image/png'};base64,${base64}`
}

const RELATIVE_FMT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return RELATIVE_FMT.format(d)
}

export function formatRelative(iso: string): string {
  const d = new Date(iso).getTime()
  if (Number.isNaN(d)) return iso
  const diff = Date.now() - d
  const sec = Math.round(diff / 1000)
  const min = Math.round(sec / 60)
  const hr = Math.round(min / 60)
  const day = Math.round(hr / 24)
  if (sec < 45) return 'just now'
  if (min < 60) return `${min}m ago`
  if (hr < 24) return `${hr}h ago`
  if (day < 30) return `${day}d ago`
  return formatDate(iso)
}

export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Derive a display language label, defaulting GS2-ish unknowns to GS2. */
export function displayLanguage(lang?: string | null): string {
  if (!lang) return 'gs2'
  const l = lang.toLowerCase()
  if (l === 'gs2' || l === 'gscript2' || l === 'graal') return 'gs2'
  return l
}
