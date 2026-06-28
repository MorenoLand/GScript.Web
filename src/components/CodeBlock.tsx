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

// Register only the grammars we ship. GS2 (Graal Script 2) reuses the JS
// grammar — it's the closest match and what the gallery highlights it as.
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
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  gs2: 'javascript',
  gscript2: 'javascript',
  graal: 'javascript',
  graalscript2: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  gs1: 'javascript',
  gscript: 'javascript',
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
  if (!lang) return 'javascript'
  const l = lang.toLowerCase()
  return ALIASES[l] ?? 'javascript'
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
    <div className={cn('group/code border border-border bg-[#0b0b0e]', className)}>
      {!bare && (
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
          <span className="truncate font-mono text-xs text-muted-foreground">
            <span className="text-primary">›</span> {filename || prismLang}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={copy}
              className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
              title="Copy"
              type="button"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-phosphor" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            {filename && (
              <button
                onClick={download}
                className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                title="Download"
                type="button"
              >
                <Download className="h-3.5 w-3.5" />
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
            padding: '1rem',
            fontSize: '13px',
            fontFamily: '"JetBrains Mono", monospace',
          }}
          lineNumberStyle={{ color: '#3a3a44', minWidth: '2.5em' }}
          codeTagProps={{ style: { fontFamily: '"JetBrains Mono", monospace' } }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
