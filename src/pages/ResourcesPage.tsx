import { RESOURCE_GROUPS } from '@/lib/resources'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const icons = {
  docs: 'fas fa-book-open',
  tools: 'fas fa-screwdriver-wrench',
  assets: 'fas fa-palette',
  downloads: 'fas fa-download',
  videos: 'fas fa-video',
}

function ResourceLinks({ group }: { group: typeof RESOURCE_GROUPS[number] }) {
  const linkIcon = (title: string) => title === 'Wiki' ? 'fas fa-book-open' : title.includes('File Formats') ? 'fas fa-file-lines' : title.includes('Documentation') ? 'fas fa-file-code' : title.includes('Docs') ? 'fas fa-folder-open' : title.includes('Protocol') ? 'fas fa-network-wired' : title.includes('Statistics') ? 'fas fa-chart-line' : title.includes('Archive') ? 'fas fa-box-archive' : title.includes('Templates') ? 'fas fa-file-zipper' : title.includes('Assets') ? 'fab fa-github' : title.includes('LSP') ? 'fas fa-database' : title.includes('Resource List') ? 'fas fa-box-open' : title.includes('GraalServer') ? 'fas fa-globe' : title.includes('Indexing') ? 'fas fa-list-check' : title.includes('Suite') ? 'fas fa-pen-to-square' : title.includes('Gmap') ? 'fas fa-map' : title.includes('Editor') ? 'fas fa-image' : title.includes('Emulator') ? 'fas fa-server' : title.includes('Beautifier') ? 'fas fa-pencil' : title.includes('Pastebin') ? 'fas fa-paste' : title.includes('setshape') ? 'fas fa-shapes' : 'fas fa-file'
  const actionIcon = (label: string) => label.includes('Mac') ? 'fab fa-apple' : label.includes('Linux') || label === 'AppImage' ? 'fab fa-linux' : label.includes('Source') || ['RC Patcher', '2FA Fix', 'GCLib', 'GRClib'].includes(label) ? 'fas fa-code' : label.includes('Sublime') ? 'fas fa-plug' : label.includes('VSCode') || label.includes('GRC') ? 'fas fa-display' : label.includes('HxD') ? 'fas fa-screwdriver-wrench' : label.includes('VSIX') ? 'fas fa-download' : 'fas fa-display'
  const downloadRows = group.id === 'downloads' ? [
    { title: 'Suite', icon: 'fas fa-display', actions: [{ label: 'Portable', href: '/?dl=exe' }, { label: 'Setup', href: '/?dl=setup' }, { label: 'AppImage', href: '/?dl=appimage' }, { label: 'Mac', href: '/?dl=dmg' }] },
    { title: 'RC3', icon: 'fas fa-terminal', actions: [{ label: 'Win Light', href: '/rc3_win_light.zip' }, { label: 'Win Dark', href: '/rc3_win_dark.zip' }, { label: 'Mac Light', href: '/rc3_mac_light.zip' }, { label: 'Mac Dark', href: '/rc3_mac_dark.zip' }] },
    { title: 'RC2', icon: 'fas fa-terminal', actions: [{ label: 'Win Light', href: '/rc2_light_win.zip' }, { label: 'Win Dark', href: '/rc2_dark_win.zip' }, { label: 'Linux Light', href: '/rc2_light.AppImage' }, { label: 'Linux Dark', href: '/rc2_dark.AppImage' }] },
    { title: 'Level/Gani Editor (39ster)', icon: 'fas fa-pen-to-square', actions: [{ label: 'Win x64', href: '/TilesEditorRelease_win_x64.zip' }, { label: 'Linux x64', href: '/TilesEditorRelease_linux_x64.zip' }, { label: 'Source', href: 'https://github.com/lukegrahamSydney/TilesEditor' }] },
    { title: 'Gonstruct', icon: 'fas fa-hammer', actions: [{ label: 'Win x64', href: '/gonstruct-win.zip' }, { label: 'Linux x64', href: '/gonstruct-linux-x64.zip' }, { label: 'Source', href: 'https://github.com/fry/graal-gonstruct' }] },
    { title: 'Utilities', icon: 'fas fa-screwdriver-wrench', actions: [{ label: 'RC Patcher', href: 'https://github.com/MorenoLand/Preagonal.RCPatcher' }, { label: '2FA Fix', href: 'https://github.com/Denveous/graal-2fa-fix' }, { label: 'GCLib', href: 'https://github.com/MorenoLand/GScript.GCLib' }, { label: 'GRClib', href: 'https://github.com/MorenoLand/GScript.GRClib' }] },
    { title: 'Extensions', icon: 'fas fa-code', actions: [{ label: 'Sublime LSP', href: 'https://github.com/MorenoLand/GScript.SublimeLSP' }, { label: 'SublimeRC', href: 'https://github.com/MorenoLand/GScript.SublimeRC' }, { label: 'Sublime Syntax', href: 'https://github.com/MorenoLand/GScript.SublimeHightlighting' }, { label: 'VSCode LSP', href: 'https://marketplace.visualstudio.com/items?itemName=ruanfernandes.graalscript-lsp' }, { label: 'GRC VSCode', href: 'https://github.com/xtjoeytx/grc-vscode-ext' }, { label: 'HxD Plugin', href: 'https://github.com/Preagonal/HxDGraal' }, { label: 'VSIX Syntax', href: '/graal-language-0.0.1.vsix' }] },
  ] : []
  if (group.id === 'downloads') return (
    <div className="download-list">
      {downloadRows.map((row) => (
        <div key={`${group.title}-${row.title}`} className="download-row">
          <span className="download-title"><strong><i className={row.icon}></i>{row.title}</strong></span>
          <span className="download-actions">
            {row.actions.map((action) => {
              const icon = actionIcon(action.label)
              return <a key={`${row.title}-${action.label}`} href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"><i className={icon}></i>{action.label}</a>
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
          <i className="fas fa-video video-link-icon"></i>
          <span>{link.title}</span>
        </a>
      ))}
    </div>
  )
  return (
    <div className="resource-link-grid">
      {group.links.map((link) => {
        const content = <>
          <span>
            <strong><i className={linkIcon(link.title)}></i>{link.title}</strong>
            {link.description && <small>{link.description}</small>}
            {link.kind && <em>{link.kind}</em>}
            {link.subLinks && <em className="resource-sublinks">{link.subLinks.map((subLink, index) => <span key={`${link.title}-${subLink.label}`}>{index > 0 && ' / '}<a href={subLink.href} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{subLink.label}</a></span>)}</em>}
          </span>
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
              <i className="fas fa-file-code"></i>
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
            const icon = icons[group.icon as keyof typeof icons] ?? 'fas fa-book-open'
            return (
              <section key={group.title} id={group.id} className={`resource-card resource-card-${group.id} ${(group.id === 'downloads' || group.id === 'videos') ? 'resource-card-wide' : ''}`}>
                <header className="resource-card-header">
                  <span className="resource-card-icon"><i className={icon}></i></span>
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
