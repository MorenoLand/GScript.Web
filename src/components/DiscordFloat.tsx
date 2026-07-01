import { type CSSProperties, useEffect, useMemo, useState } from 'react'

export type DiscordMember = { username: string; nickname?: string | null; global_name?: string | null; display_name?: string | null; name?: string | null; avatar_url?: string | null }
type ParticleStyle = CSSProperties & Record<string, string>

export function getDiscordName(member: DiscordMember) {
  const username = member.username?.trim()
  return member.nickname?.trim() || member.global_name?.trim() || member.display_name?.trim() || member.name?.trim() || username || 'unknown'
}

export function DiscordFloat() {
  const [members, setMembers] = useState<DiscordMember[]>([])
  const [hidden, setHidden] = useState(false)
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  const lanes = useMemo(() => {
    const tightest = Math.min(viewport.width, viewport.height)
    const visibleCount = tightest < 640 ? 6 : viewport.height < 760 ? 8 : viewport.height < 900 ? 10 : 18
    const visibleMembers = members.slice(0, visibleCount)
    const half = Math.ceil(visibleMembers.length / 2)
    const leftMembers = visibleMembers.slice(0, half)
    const rightMembers = visibleMembers.slice(half)
    return {
      left: leftMembers.map((member, laneIndex) => ({ member, style: getParticleStyle(laneIndex, leftMembers.length, 'left') })),
      right: rightMembers.map((member, laneIndex) => ({ member, style: getParticleStyle(laneIndex, rightMembers.length, 'right') })),
    }
  }, [members, viewport])

  function getParticleStyle(laneIndex: number, laneCount: number, side: 'left' | 'right') {
    const drift = 8 + ((laneIndex * 31) % 64)
    const wobble = ((laneIndex * 13) % 24) - 12
    const x = side === 'left' ? drift + wobble : -(drift + wobble)
    const duration = 27
    const delay = -(laneIndex * (duration / Math.max(laneCount, 1)))
    const travel = viewport.height < 760 ? 29 : viewport.height < 900 ? 34 : 64
    return { '--float-top': '100%', '--float-x': `${x}px`, '--float-a': `${Math.round(travel * 0.34)}vh`, '--float-b': `${Math.round(travel * 0.75)}vh`, '--float-c': `${Math.round(travel * 0.95)}vh`, '--float-end': `${travel}vh`, '--float-duration': `${duration}s`, '--float-delay': `${delay}s` } as ParticleStyle
  }

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 5000)
    fetch('https://api.moreno.land/api/discord/users', { signal: controller.signal })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((nextMembers) => {
        const list = Array.isArray(nextMembers) ? nextMembers : nextMembers?.members ?? []
        if (!list.length) throw new Error('Discord user list unavailable')
        setMembers(list)
      })
      .catch(() => setHidden(true))
      .finally(() => window.clearTimeout(timeout))
    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  if (hidden || members.length === 0) return null

  return (
    <div
      className="discord-float-overlay"
      style={{ position: 'absolute', top: 0, right: 0, bottom: '7rem', left: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <DiscordLane side="left" members={lanes.left} top={viewport.height < 900 ? '12.75rem' : '9.75rem'} />
      <DiscordLane side="right" members={lanes.right} top={viewport.height < 900 ? '12.75rem' : '9.75rem'} />
    </div>
  )
}

function DiscordLane({ side, members, top }: { side: 'left' | 'right'; top: string; members: { member: DiscordMember; style: ParticleStyle }[] }) {
  const sideStyle = side === 'left'
    ? { left: 0 }
    : { right: 0 }

  return (
    <aside
      className={`discord-float discord-float-${side}`}
      aria-label={`#gscript Discord ${side}`}
      style={{ position: 'absolute' as const, top, bottom: '11.25rem', width: '18rem', pointerEvents: 'none', overflow: 'visible', ...sideStyle }}
    >
      {members.map(({ member, style }, index) => {
        const displayName = getDiscordName(member)
        const label = member.nickname && member.username ? `${member.nickname} (${member.username})` : displayName
        return (
          <div key={`${member.username || displayName}-${index}`} className="discord-member" aria-label={label} style={style}>
            <img src={member.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt={displayName} className="discord-avatar" />
            <span>{displayName}</span>
          </div>
        )
      })}
    </aside>
  )
}
