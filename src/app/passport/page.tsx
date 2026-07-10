// /src/app/passport/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import shopsData from '@/data/shops.json'
import badgesData from '@/data/badges.json'
import { getStamps, getLastStampDate, type StampRecord } from '@/lib/stamps'
import { usePhone } from '@/lib/usePhone'
import { getProgress } from '@/lib/passportApi'

const shops = shopsData as any[]
const badges = badgesData as any[]

const coreStops = shops
  .filter(s => s.passportType === 'core')
  .sort((a, b) => a.passportStop - b.passportStop)

const COMPLETE_DATE_KEY = 'asbury-park-postmarks:complete-date'

const fifthStops = coreStops.filter(s => s.zone === 'design' || s.zone === 'fifth' || s.zone === 'downtown')
const thirdStops = coreStops.filter(s => s.zone === 'third' || s.zone === 'bay')

export default function PassportPage() {
  const { phone, loaded: phoneLoaded } = usePhone()
  const [stamps, setStamps] = useState<StampRecord>({})
  const [mounted, setMounted] = useState(false)
  const [lastStampDate, setLastStampDate] = useState<string | null>(null)
  const [completeDate, setCompleteDate] = useState<string | null>(null)

  useEffect(() => {
    if (!phoneLoaded) return
    const localStamps = getStamps()

    if (phone) {
      getProgress(phone).then(slugs => {
        const merged: StampRecord = { ...localStamps }
        for (const s of slugs) {
          if (!merged[s]) merged[s] = new Date().toISOString()
        }
        setStamps(merged)
        setMounted(true)
      })
    } else {
      setStamps(localStamps)
      setMounted(true)
    }
  }, [phone, phoneLoaded])

  useEffect(() => {
    if (!phoneLoaded) return
    const sync = () => {
      const localStamps = getStamps()
      if (phone) {
        getProgress(phone).then(slugs => {
          const merged: StampRecord = { ...localStamps }
          for (const s of slugs) {
            if (!merged[s]) merged[s] = new Date().toISOString()
          }
          setStamps(merged)
        })
      } else {
        setStamps(localStamps)
      }
    }
    window.addEventListener('focus', sync)
    return () => window.removeEventListener('focus', sync)
  }, [phone, phoneLoaded])

  useEffect(() => {
    if (!mounted) return
    setLastStampDate(getLastStampDate())
    const coreCount = coreStops.filter(s => stamps[s.id]).length
    if (coreCount === 10) {
      if (!localStorage.getItem(COMPLETE_DATE_KEY)) {
        const date = new Date().toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric',
        })
        localStorage.setItem(COMPLETE_DATE_KEY, date)
      }
      setCompleteDate(localStorage.getItem(COMPLETE_DATE_KEY))
    }
  }, [stamps, mounted])

  const coreStamped = coreStops.filter(s => stamps[s.id]).length
  const progress = Math.round((coreStamped / 10) * 100)

  const earnedBadges = badges.filter(
    b => b.type === 'core' && coreStamped >= b.threshold
  )

  const nextBadge = badges
    .filter(b => b.type === 'core' && coreStamped < b.threshold)
    .sort((a, b) => a.threshold - b.threshold)[0]

  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--navy)]">

      {/* HEADER */}
      <div className="bg-[var(--navy)] px-6 py-8 text-center border-b-4 border-[var(--gold)]">
        <Link
          href="/"
          className="font-mono text-[10px] tracking-widest text-[var(--gold)] opacity-60
                     hover:opacity-100 transition-opacity uppercase"
        >
          ← PLACEHOLDER_COMPLETE_COLLECTION_BADGE_TITLE
        </Link>
        <h1 className="font-serif text-3xl font-black text-[var(--cream)] mt-3">
          Your Postcards
        </h1>
        <p className="text-[var(--gold)] text-sm italic mt-1 opacity-70">
          {coreStamped === 0 && 'No postmarks yet. PLACEHOLDER_COLLECTION_EMPTY_COPY'}
          {coreStamped > 0 && coreStamped < 10 &&
            `${coreStamped} of 10 postmarks collected`}
          {coreStamped === 10 && 'All postmarks collected. Walk to the pier.'}
        </p>
      </div>

      {/* PROGRESS BAR */}
      <div className="max-w-lg mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-widest text-[var(--navy-mid)] uppercase">
            Progress
          </span>
          <span className="font-mono text-xs text-[var(--navy-mid)] font-bold">
            {coreStamped}/10
          </span>
        </div>
        <div className="w-full h-3 bg-[color-mix(in srgb, var(--cream) 85%, var(--navy) 15%)] rounded-full overflow-hidden border border-[var(--navy-mid)]/20">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: mounted ? `${progress}%` : '0%',
              backgroundColor: coreStamped === 10 ? 'var(--gold)' : 'var(--navy)',
            }}
          />
        </div>
      </div>

      {/* EARNED BADGES */}
      {earnedBadges.length > 0 && (
        <div className="max-w-lg mx-auto px-6 pt-5">
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map(b => (
              <div
                key={b.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-white text-xs font-mono"
                style={{ backgroundColor: b.color }}
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEXT BADGE HINT */}
      {nextBadge && (
        <div className="max-w-lg mx-auto px-6 pt-3">
          <p className="font-serif text-sm italic text-[var(--navy-mid)] opacity-70">
            {nextBadge.threshold - coreStamped} more stamp{nextBadge.threshold - coreStamped !== 1 ? 's' : ''} to earn &ldquo;{nextBadge.label}&rdquo;
          </p>
        </div>
      )}

      {/* LAST STAMP DATE */}
      {lastStampDate && coreStamped > 0 && (
        <p className="font-mono text-[10px] tracking-widest text-[var(--navy-mid)]
                      opacity-40 uppercase text-center mb-4">
          Last postmarked: {lastStampDate}
        </p>
      )}

      {/* COMPLETION CERTIFICATE */}
      {completeDate && (
        <div className="mx-4 mb-6 bg-[var(--navy)] border-t-4 border-[var(--gold)]
                        rounded-sm p-6 text-center">
          <div className="max-w-[200px] mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100"
                 className="w-full">
              <circle cx="320" cy="36" r="22" fill="var(--gold)" opacity="0.4"/>
              <circle cx="320" cy="36" r="14" fill="var(--gold)" opacity="0.6"/>
              <g fill="var(--gold)">
                <rect x="20" y="56" width="320" height="3"/>
                <rect x="285" y="52" width="50" height="7"/>
                <rect x="295" y="38" width="30" height="14"/>
                <polygon points="291,38 310,28 329,38"/>
                <rect x="22" y="59" width="1.5" height="22"/>
                <rect x="46" y="59" width="1.5" height="22"/>
                <rect x="70" y="59" width="1.5" height="22"/>
                <rect x="94" y="59" width="1.5" height="22"/>
                <rect x="118" y="59" width="1.5" height="22"/>
                <rect x="142" y="59" width="1.5" height="22"/>
                <rect x="166" y="59" width="1.5" height="22"/>
                <rect x="190" y="59" width="1.5" height="22"/>
                <rect x="214" y="59" width="1.5" height="22"/>
                <rect x="238" y="59" width="1.5" height="22"/>
                <rect x="262" y="59" width="1.5" height="22"/>
                <rect x="281" y="59" width="1.5" height="22"/>
                <rect x="295" y="59" width="1.5" height="22"/>
                <rect x="311" y="59" width="1.5" height="22"/>
                <rect x="327" y="59" width="1.5" height="22"/>
              </g>
            </svg>
          </div>

          <p className="font-serif text-2xl font-bold text-[var(--cream)] mt-2">
            PLACEHOLDER_COMPLETION_CERTIFICATE_TITLE
          </p>
          <p className="font-mono text-[10px] tracking-widest text-[var(--gold)]
                        uppercase mt-2 opacity-70">
            PLACEHOLDER_COMPLETION_CERTIFICATE_SUBTITLE
          </p>
          <p className="font-mono text-[11px] text-[var(--gold)] opacity-50 mt-3">
            Walked on {completeDate}
          </p>

          <div className="grid grid-cols-2 gap-1 mt-4 text-left">
            {coreStops.map(stop => (
              <p key={stop.id}
                 className="font-mono text-[9px] text-[var(--gold)] opacity-60
                            tracking-wide">
                ✓ {stop.name}
              </p>
            ))}
          </div>

          <p className="font-mono text-[9px] text-[var(--gold)] opacity-30
                        tracking-widest uppercase mt-5">
            #AsburyParkPostmarks
          </p>
          <p className="font-mono text-[9px] text-[var(--gold)] opacity-20
                        tracking-widest uppercase mt-1">
            Screenshot to share
          </p>
        </div>
      )}

      {/* STAMP GRID */}
      <div className="max-w-lg mx-auto px-6 py-6">

        {/* PLACEHOLDER_ROUTE_SECTION_A section */}
        <div className="flex items-center gap-3 mb-4">
          <p className="font-mono text-[10px] tracking-widest text-[var(--navy-mid)] opacity-60 uppercase whitespace-nowrap">
            PLACEHOLDER_ROUTE_SECTION_A
          </p>
          <div className="flex-1 border-t border-dashed border-[var(--navy-mid)] opacity-30" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {fifthStops.map(shop => (
            <StampCard
              key={shop.id}
              shop={shop}
              stamped={!!stamps[shop.id]}
              stampDate={stamps[shop.id]}
              mounted={mounted}
            />
          ))}
        </div>

        {/* Corridor crossing divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[var(--gold)] opacity-40" />
          <span className="font-mono text-[10px] text-[var(--gold)] tracking-widest px-2">
            PLACEHOLDER_ROUTE_DIVIDER
          </span>
          <div className="flex-1 h-px bg-[var(--gold)] opacity-40" />
        </div>

        {/* PLACEHOLDER_ROUTE_SECTION_B section */}
        <div className="flex items-center gap-3 mb-4">
          <p className="font-mono text-[10px] tracking-widest text-[var(--navy-mid)] opacity-60 uppercase whitespace-nowrap">
            PLACEHOLDER_ROUTE_SECTION_B
          </p>
          <div className="flex-1 border-t border-dashed border-[var(--navy-mid)] opacity-30" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {thirdStops.map(shop => (
            <StampCard
              key={shop.id}
              shop={shop}
              stamped={!!stamps[shop.id]}
              stampDate={stamps[shop.id]}
              mounted={mounted}
            />
          ))}
        </div>
      </div>

      {/* COMPOSTELA — 10/10 completion */}
      {coreStamped === 10 && (
        <div className="max-w-lg mx-auto px-6 pb-8">
          <div className="p-6 bg-[var(--navy)] border-2 border-[var(--gold)] rounded-sm text-center">
            <p className="text-3xl mb-2">⚓</p>
            <p className="font-serif text-xl font-bold text-[var(--gold)]">
              PLACEHOLDER_COMPLETE_COLLECTION_BADGE_TITLE
            </p>
            <p className="font-serif italic text-sm text-[var(--cream)] mt-2 leading-relaxed">
              PLACEHOLDER_COMPLETE_COLLECTION_COPY</p>
            <p className="font-mono text-[10px] text-[var(--gold)] opacity-50 mt-4 tracking-widest">
              #AsburyParkPostmarks
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="bg-[var(--navy)] px-6 py-8 text-center border-t-2 border-[var(--gold)]">
        <Link
          href="/"
          className="font-mono text-xs text-[var(--gold)] opacity-60
                     hover:opacity-100 transition-opacity tracking-widest uppercase"
        >
          ← Back Home
        </Link>
        <p className="font-serif italic text-[var(--cream)] text-sm opacity-50 mt-4 leading-relaxed">
          Postmarks are saved on this device.
          <br />
          No account needed. No data leaves your phone.
        </p>
      </div>

    </main>
  )
}


/* ─── Stamp Card Component ─── */

function StampCard({
  shop,
  stamped,
  stampDate,
  mounted,
}: {
  shop: any
  stamped: boolean
  stampDate?: string
  mounted: boolean
}) {
  const formattedDate = stampDate
    ? new Date(stampDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <Link
      href={`/stop/${shop.id}`}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-sm
        border text-center transition-all min-h-[140px] group
        ${stamped
          ? 'bg-white/80 border-[var(--navy-mid)]/30 shadow-sm'
          : 'bg-white/30 border-dashed border-[var(--navy-mid)]/20 hover:bg-white/50'
        }
      `}
    >
      <span className="absolute top-2 left-2 font-mono text-[10px] text-[var(--navy-mid)] opacity-40">
        #{shop.passportStop}
      </span>

      <div
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-500 mb-2
          ${stamped ? 'scale-100 opacity-100' : 'scale-75 opacity-20'}
        `}
        style={{
          backgroundColor: stamped ? shop.selloColor : 'color-mix(in srgb, var(--cream) 85%, var(--navy) 15%)',
          border: stamped ? `2px solid ${shop.selloColor}` : '2px dashed var(--navy-mid)40',
        }}
      >
        {stamped ? (
          <span className="text-white text-lg">✓</span>
        ) : (
          <span className="text-[var(--navy-mid)] opacity-30 text-lg">?</span>
        )}
      </div>

      <p className={`
        font-serif text-xs font-bold leading-tight
        ${stamped ? 'text-[var(--navy)]' : 'text-[var(--navy-mid)] opacity-50'}
      `}>
        {shop.name}
      </p>

      <p className="font-mono text-[9px] mt-1 text-[var(--navy-mid)] opacity-50">
        {stamped ? formattedDate : 'Tap to visit →'}
      </p>
    </Link>
  )
}
