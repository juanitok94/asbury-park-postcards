// /src/app/passport/page.tsx
'use client'

import { coreCountWord, resolveThreshold } from '@/lib/coreStops'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import shopsData from '@/data/shops.json'
import badgesData from '@/data/badges.json'
import { getStamps, getLastStampDate, type StampRecord } from '@/lib/stamps'

const shops = shopsData as any[]
const badges = badgesData as any[]

const coreStops = shops
  .filter(s => s.passportType === 'core')
  .sort((a, b) => a.passportStop - b.passportStop)

const COMPLETE_DATE_KEY = 'asbury-park-postmarks:complete-date'

const bangsStops = coreStops.filter(s => s.zone === 'bangs' || s.zone === 'main')
const cookmanStops = coreStops.filter(s => s.zone === 'cookman' || s.zone === 'boardwalk')

export default function PassportPage() {
  const [stamps, setStamps] = useState<StampRecord>({})
  const [mounted, setMounted] = useState(false)
  const [lastStampDate, setLastStampDate] = useState<string | null>(null)
  const [completeDate, setCompleteDate] = useState<string | null>(null)

  useEffect(() => {
    setStamps(getStamps())
    setMounted(true)
  }, [])

  useEffect(() => {
    const sync = () => setStamps(getStamps())
    window.addEventListener('focus', sync)
    return () => window.removeEventListener('focus', sync)
  }, [])

  useEffect(() => {
    if (!mounted) return
    setLastStampDate(getLastStampDate())
    const coreCount = coreStops.filter(s => stamps[s.id]).length
    if (coreCount === coreStops.length) {
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
  const progress = Math.round((coreStamped / coreStops.length) * 100)

  const earnedBadges = badges.filter(
    b => b.type === 'core' && coreStamped >= resolveThreshold(b.threshold)
  )

  const nextBadge = badges
    .filter(b => b.type === 'core' && coreStamped < resolveThreshold(b.threshold))
    .sort((a, b) => resolveThreshold(a.threshold) - resolveThreshold(b.threshold))[0]

  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--navy)]">

      {/* HEADER */}
      <div className="bg-[var(--navy)] px-6 py-8 text-center border-b-4 border-[var(--gold)]">
        <Link
          href="/"
          className="font-mono text-[10px] tracking-widest text-[var(--gold)] opacity-60
                     hover:opacity-100 transition-opacity uppercase"
        >
          ← Asbury Park Postmarks
        </Link>
        <h1 className="font-serif text-3xl font-black text-[var(--cream)] mt-3">
          Your Postcards
        </h1>
        <p className="text-[var(--gold)] text-sm italic mt-1 opacity-70">
          {coreStamped === 0 && 'No postmarks yet. Start walking.'}
          {coreStamped > 0 && coreStamped < coreStops.length &&
            `${coreStamped} of ${coreStops.length} postmarks collected`}
          {coreStamped === coreStops.length && 'All postmarks collected. Walk to the boardwalk.'}
        </p>
      </div>

      {/* PROGRESS BAR */}
      <div className="max-w-lg mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-widest text-[var(--navy-mid)] uppercase">
            Progress
          </span>
          <span className="font-mono text-xs text-[var(--navy-mid)] font-bold">
            {coreStamped}/{coreStops.length}
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
            {resolveThreshold(nextBadge.threshold) - coreStamped} more stamp{resolveThreshold(nextBadge.threshold) - coreStamped !== 1 ? 's' : ''} to earn &ldquo;{nextBadge.label}&rdquo;
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
              <g fill="var(--gold)">
                <rect x="10" y="82" width="380" height="3"/>
                <rect x="30" y="50" width="130" height="32"/>
                <rect x="240" y="50" width="130" height="32"/>
                <rect x="152" y="25" width="96" height="57"/>
                <rect x="145" y="20" width="110" height="8"/>
                <rect x="185" y="12" width="30" height="8"/>
              </g>
              <path d="M175 82 L175 55 Q200 32 225 55 L225 82Z" fill="var(--navy)" opacity="0.4"/>
              <g fill="var(--navy)" opacity="0.2">
                <rect x="45" y="58" width="6" height="18"/>
                <rect x="65" y="58" width="6" height="18"/>
                <rect x="85" y="58" width="6" height="18"/>
                <rect x="105" y="58" width="6" height="18"/>
                <rect x="125" y="58" width="6" height="18"/>
                <rect x="255" y="58" width="6" height="18"/>
                <rect x="275" y="58" width="6" height="18"/>
                <rect x="295" y="58" width="6" height="18"/>
                <rect x="315" y="58" width="6" height="18"/>
                <rect x="335" y="58" width="6" height="18"/>
              </g>
            </svg>
          </div>

          <p className="font-serif text-2xl font-bold text-[var(--cream)] mt-2">
            {coreCountWord} stops. Four blocks. Asbury Park, New Jersey.
          </p>
          <p className="font-mono text-[10px] tracking-widest text-[var(--gold)]
                        uppercase mt-2 opacity-70">
            asbury-park-postcards.vercel.app
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
            #AsburyPark
          </p>
          <p className="font-mono text-[9px] text-[var(--gold)] opacity-20
                        tracking-widest uppercase mt-1">
            Screenshot to share
          </p>
        </div>
      )}

      {/* STAMP GRID */}
      <div className="max-w-lg mx-auto px-6 py-6">

        {/* BANGS AVE section */}
        <div className="flex items-center gap-3 mb-4">
          <p className="font-mono text-[10px] tracking-widest text-[var(--navy-mid)] opacity-60 uppercase whitespace-nowrap">
            BANGS AVE
          </p>
          <div className="flex-1 border-t border-dashed border-[var(--navy-mid)] opacity-30" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {bangsStops.map(shop => (
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
            → COOKMAN AVE
          </span>
          <div className="flex-1 h-px bg-[var(--gold)] opacity-40" />
        </div>

        {/* COOKMAN AVE section */}
        <div className="flex items-center gap-3 mb-4">
          <p className="font-mono text-[10px] tracking-widest text-[var(--navy-mid)] opacity-60 uppercase whitespace-nowrap">
            COOKMAN AVE
          </p>
          <div className="flex-1 border-t border-dashed border-[var(--navy-mid)] opacity-30" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cookmanStops.map(shop => (
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
      {coreStamped === coreStops.length && (
        <div className="max-w-lg mx-auto px-6 pb-8">
          <div className="p-6 bg-[var(--navy)] border-2 border-[var(--gold)] rounded-sm text-center">
            <p className="text-3xl mb-2">⚓</p>
            <p className="font-serif text-xl font-bold text-[var(--gold)]">
              Asbury Park Postmarks — Complete
            </p>
            <p className="font-serif italic text-sm text-[var(--cream)] mt-2 leading-relaxed">
              {coreCountWord} stops. Four blocks. You walked the whole corridor.</p>
            <p className="font-mono text-[10px] text-[var(--gold)] opacity-50 mt-4 tracking-widest">
              #AsburyPark
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
