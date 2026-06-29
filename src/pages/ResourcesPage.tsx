import { ExternalLink, BookOpen, Wrench, Palette, Download, Video, FileCode, Monitor, Terminal, Edit, Hammer, Plug, Code2, Apple } from 'lucide-react'
import { RESOURCE_GROUPS } from '@/lib/resources'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const icons = {
  docs: BookOpen,
  tools: Wrench,
  assets: Palette,
  downloads: Download,
  videos: Video,
}

function ResourceLinks({ group }: { group: typeof RESOURCE_GROUPS[number] }) {
  const actionIcon = (label: string) => label.includes('Mac') ? Apple : label.includes('Linux') || label === 'AppImage' ? Terminal : label.includes('Source') || ['RC Patcher', '2FA Fix', 'GCLib', 'GRClib'].includes(label) ? Code2 : label.includes('Sublime') ? Plug : label.includes('VSCode') || label.includes('GRC') ? Monitor : label.includes('HxD') ? Wrench : label.includes('VSIX') ? Download : Monitor
  const downloadRows = group.id === 'downloads' ? [
    { title: 'Suite', Icon: Monitor, actions: [{ label: 'Portable', href: '/?dl=exe' }, { label: 'Setup', href: '/?dl=setup' }, { label: 'AppImage', href: '/?dl=appimage' }, { label: 'Mac', href: '/?dl=dmg' }] },
    { title: 'RC3', Icon: Terminal, actions: [{ label: 'Win Light', href: '/rc3_win_light.zip' }, { label: 'Win Dark', href: '/rc3_win_dark.zip' }, { label: 'Mac Light', href: '/rc3_mac_light.zip' }, { label: 'Mac Dark', href: '/rc3_mac_dark.zip' }] },
    { title: 'RC2', Icon: Terminal, actions: [{ label: 'Win Light', href: '/rc2_light_win.zip' }, { label: 'Win Dark', href: '/rc2_dark_win.zip' }, { label: 'Linux Light', href: '/rc2_light.AppImage' }, { label: 'Linux Dark', href: '/rc2_dark.AppImage' }] },
    { title: 'Level/Gani Editor (39ster)', Icon: Edit, actions: [{ label: 'Win x64', href: '/TilesEditorRelease_win_x64.zip' }, { label: 'Linux x64', href: '/TilesEditorRelease_linux_x64.zip' }, { label: 'Source', href: 'https://github.com/lukegrahamSydney/TilesEditor' }] },
    { title: 'Gonstruct', Icon: Hammer, actions: [{ label: 'Win x64', href: '/gonstruct-win.zip' }, { label: 'Linux x64', href: '/gonstruct-linux-x64.zip' }, { label: 'Source', href: 'https://github.com/fry/graal-gonstruct' }] },
    { title: 'Utilities', Icon: Wrench, actions: [{ label: 'RC Patcher', href: 'https://github.com/MorenoLand/Preagonal.RCPatcher' }, { label: '2FA Fix', href: 'https://github.com/Denveous/graal-2fa-fix' }, { label: 'GCLib', href: 'https://github.com/MorenoLand/GScript.GCLib' }, { label: 'GRClib', href: 'https://github.com/MorenoLand/GScript.GRClib' }] },
    { title: 'Extensions', Icon: Code2, actions: [{ label: 'Sublime LSP', href: 'https://github.com/MorenoLand/GScript.SublimeLSP' }, { label: 'SublimeRC', href: 'https://github.com/MorenoLand/GScript.SublimeRC' }, { label: 'Sublime Syntax', href: 'https://github.com/MorenoLand/GScript.SublimeHightlighting' }, { label: 'VSCode LSP', href: 'https://marketplace.visualstudio.com/items?itemName=ruanfernandes.graalscript-lsp' }, { label: 'GRC VSCode', href: 'https://github.com/xtjoeytx/grc-vscode-ext' }, { label: 'HxD Plugin', href: 'https://github.com/Preagonal/HxDGraal' }, { label: 'VSIX Syntax', href: '/graal-language-0.0.1.vsix' }] },
  ] : []
  if (group.id === 'downloads') return (
    <div className="download-list">
      {downloadRows.map((row) => (
        <div key={`${group.title}-${row.title}`} className="download-row">
          <span className="download-title"><strong><row.Icon className="download-row-icon h-5 w-5" />{row.title}</strong></span>
          <span className="download-actions">
            {row.actions.map((action) => {
              const Icon = actionIcon(action.label)
              return <a key={`${row.title}-${action.label}`} href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"><Icon className="h-3.5 w-3.5" />{action.label}</a>
            })}
          </span>
        </div>
      ))}
    </div>
  )
  if (group.id === 'videos') return (
    <div className="video-link-grid">
      {group.links.map((link) => (
        <a key={`${group.title}-${link.title}`} href={link.href} target="_blank" rel="noreferrer">
          <Video className="video-link-icon h-4 w-4" />
          <span>{link.title}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ))}
    </div>
  )
  return (
    <div className="resource-link-grid">
      {group.links.map((link) => {
        const content = <>
          <span>
            <strong>{link.title}</strong>
            {link.description && <small>{link.description}</small>}
            {link.kind && <em>{link.kind}</em>}
            {link.subLinks && <em className="resource-sublinks">{link.subLinks.map((subLink, index) => <span key={`${link.title}-${subLink.label}`}>{index > 0 && ' / '}<a href={subLink.href} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{subLink.label}</a></span>)}</em>}
          </span>
          <ExternalLink className="h-4 w-4" />
        </>
        if (link.subLinks) return <div key={`${group.title}-${link.title}`} role="link" tabIndex={0} className="resource-link" onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')} onKeyDown={(event) => { if (event.key === 'Enter') window.open(link.href, '_blank', 'noopener,noreferrer') }}>{content}</div>
        return <a key={`${group.title}-${link.title}`} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="resource-link">{content}</a>
      })}
    </div>
  )
}

export function ResourcesPage() {
  const location = useLocation()
  const resourceGroups = [...RESOURCE_GROUPS].sort((a, b) => {
    const order = ['docs', 'tools', 'assets', 'videos', 'downloads']
    return order.indexOf(a.id) - order.indexOf(b.id)
  })

  useEffect(() => {
    if (!location.hash) return
    window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }, [location.hash])

  return (
    <div className="resources-page">
      <section className="resources-shell py-20">
        <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-sm text-primary">
              <FileCode className="h-4 w-4" />
              #gscript links
            </div>
            <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">Resources</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Docs, tools, downloads, art references, and tutorial links gathered into one place.
            </p>
          </div>
          <nav className="resource-jump-nav" aria-label="Resource sections">
            {resourceGroups.map((group) => <a key={group.id} href={`#${group.id}`}>{group.title.replace(' / ', ' ')}</a>)}
          </nav>
        </div>
        <div className="resource-board">
          {resourceGroups.map((group) => {
            const Icon = icons[group.icon as keyof typeof icons] ?? BookOpen
            return (
              <section key={group.title} id={group.id} className={`resource-card resource-card-${group.id} ${(group.id === 'downloads' || group.id === 'videos') ? 'resource-card-wide' : ''}`}>
                <header className="resource-card-header">
                  <span className="resource-card-icon"><Icon className="h-5 w-5" /></span>
                  <span>
                    <h2>{group.title}</h2>
                    <p>{group.description}</p>
                  </span>
                </header>
                <ResourceLinks group={group} />
              </section>
            )
          })}
        </div>
      </section>
    </div>
  )
}
