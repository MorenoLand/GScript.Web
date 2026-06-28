import { useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php'
import { Check, Copy, Download } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { graalscript } from '@/lib/graalscriptGrammar'

// Register only the grammars we ship. GS2 (Graal Script 2) uses its own
// grammar (see graalscriptGrammar.ts) instead of borrowing JavaScript.
SyntaxHighlighter.registerLanguage('graalscript', graalscript)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('markup', markup)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('sql', sql)
SyntaxHighlighter.registerLanguage('c', c)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('csharp', csharp)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('php', php)

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  maxHeight?: number | string
  className?: string
  /** Hide the header bar (filename + actions). */
  bare?: boolean
}

const ALIASES: Record<string, string> = {
  gs2: 'graalscript',
  gscript2: 'graalscript',
  graal: 'graalscript',
  graalscript2: 'graalscript',
  graalscript: 'graalscript',
  gs1: 'graalscript',
  gscript: 'graalscript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  html: 'markup',
  htm: 'markup',
  xml: 'markup',
  sv: 'markup',
  sh: 'bash',
  shell: 'bash',
  py: 'python',
  cs: 'csharp',
}

function toPrismLanguage(lang?: string): string {
  if (!lang) return 'graalscript'
  const l = lang.toLowerCase()
  return ALIASES[l] ?? 'graalscript'
}

export function CodeBlock({
  code,
  language,
  filename,
  maxHeight = 480,
  className,
  bare = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const prismLang = toPrismLanguage(language)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Copy failed')
    }
  }

  function download() {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'snippet.txt'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-black/5 bg-code shadow-soft',
        className,
      )}
    >
      {!bare && (
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3.5 py-2">
          <span className="truncate font-mono text-xs text-stone-400">
            {filename || prismLang}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={copy}
              className="flex h-7 w-7 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-white/10 hover:text-stone-200"
              title="Copy"
              type="button"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            {filename && (
              <button
                onClick={download}
                className="flex h-7 w-7 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-white/10 hover:text-stone-200"
                title="Download"
                type="button"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="overflow-auto" style={{ maxHeight }}>
        <SyntaxHighlighter
          language={prismLang}
          style={oneDark}
          showLineNumbers
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '1rem 1.1rem',
            fontSize: '13px',
            lineHeight: '1.6',
            fontFamily: '"Geist Mono", ui-monospace, monospace',
          }}
          lineNumberStyle={{ color: 'rgba(231,229,228,0.18)', minWidth: '2.5em' }}
          codeTagProps={{
            style: { fontFamily: '"Geist Mono", ui-monospace, monospace' },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
