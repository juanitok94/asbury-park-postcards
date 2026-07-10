'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import shopsData from '@/data/shops.json'

const shops = shopsData as any[]

const allCoreStops = shops
  .filter(s => s.passportType === 'core')
  .sort((a, b) => a.passportStop - b.passportStop)

const allDirectoryStops = shops.filter(s => s.passportType === 'directory')

const PILLS = [
  { id: 'morning', label: 'Morning', icon: '☀️' },
  { id: 'lunch',   label: 'Lunch',   icon: '🍽' },
  { id: 'dinner',  label: 'Dinner',  icon: '🌙' },
  { id: 'dessert', label: 'Dessert', icon: '🍦' },
]

export default function RouteFilter() {
  const [activeFilter, setActiveFilter] = useState<string>('morning')

  useEffect(() => {
    if (new Date().getHours() >= 18) setActiveFilter('dinner')
  }, [])

  const filteredCore = useMemo(
    () => allCoreStops.filter(s => s.mealtime?.includes(activeFilter)),
    [activeFilter]
  )

  const sectionLabel = useMemo(() => {
    if (activeFilter === 'morning') return 'PLACEHOLDER_CORE_ROUTE_LABEL'
    return 'PLACEHOLDER_EVENING_ROUTE_LABEL'
  }, [activeFilter])

  const showDining = ['lunch', 'dinner', 'dessert'].includes(activeFilter)

  const filteredDirectory = useMemo(
    () => showDining ? allDirectoryStops.filter(s => s.mealtime?.includes(activeFilter)) : [],
    [activeFilter, showDining]
  )

  function stopCard(shop: any, linked: boolean) {
    const inner = (
      <>
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center
                     text-white text-xs font-mono font-bold flex-shrink-0"
          style={{ backgroundColor: shop.selloColor || 'var(--navy-mid)' }}
        >
          {shop.passportStop ?? '✦'}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-serif font-bold text-[var(--navy)] text-base truncate">{shop.name}</p>
          <p className="font-mono text-[11px] text-[var(--navy-mid)] opacity-80">{shop.address}</p>
          {!linked && shop.story?.insiderTip && (
            <p className="font-serif italic text-xs text-[var(--navy-mid)] opacity-60 mt-1 leading-relaxed line-clamp-2">
              {shop.story.insiderTip}
            </p>
          )}
        </div>
        {linked && (
          <span className="text-[var(--navy-mid)] text-lg opacity-40 group-hover:opacity-70 transition-all">›</span>
        )}
      </>
    )

    const base = `flex items-start gap-3 p-4 bg-white/70 border border-[var(--navy-mid)]/20
                  rounded-sm shadow-[0_2px_8px_rgba(13,31,60,0.08)] transition-all duration-200`

    return linked ? (
      <Link
        key={shop.id}
        href={`/stop/${shop.id}`}
        className={`${base} hover:bg-white/80 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(13,31,60,0.14)] group`}
      >
        {inner}
      </Link>
    ) : (
      <div key={shop.id} className={base}>
        {inner}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pb-6">
      <div className="flex items-center gap-3 mb-5">
        <h3 className="font-serif text-2xl font-bold text-[var(--navy)]">The Route</h3>
        <div className="flex-1 border-t border-dashed border-[var(--navy-mid)] opacity-30" />
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PILLS.map(pill => {
          const active = activeFilter === pill.id
          return (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono
                transition-all border
                ${active
                  ? 'bg-[var(--navy)] text-[var(--gold)] border-[var(--navy)]'
                  : 'bg-transparent border-[var(--navy-mid)]/20 text-[var(--navy-mid)] opacity-50 hover:opacity-80'
                }
              `}
            >
              <span>{pill.icon}</span>
              <span>{pill.label}</span>
            </button>
          )
        })}
      </div>

      {/* Core stops */}
      {filteredCore.length > 0 && (
        <>
          <p className="font-mono text-[11px] tracking-widest text-[var(--navy-mid)] opacity-80 uppercase mb-4 border-l-2 border-[var(--gold)]/40 pl-3">
            {sectionLabel}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {filteredCore.map(s => stopCard(s, true))}
          </div>
        </>
      )}

      {/* Empty core state */}
      {filteredCore.length === 0 && (
        <p className="font-serif italic text-[var(--navy-mid)] opacity-60 text-sm py-2">
          PLACEHOLDER_EMPTY_ROUTE_FILTER_COPY
        </p>
      )}

      {/* Directory — appears for Lunch / Dinner / Dessert */}
      {showDining && filteredDirectory.length > 0 && (
        <div className="mt-6">
          <p className="font-mono text-[11px] tracking-widest text-[var(--navy-mid)] opacity-80 uppercase mb-4 border-l-2 border-[var(--gold)]/40 pl-3">
            Also on the Corridor
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredDirectory.map(s => stopCard(s, false))}
          </div>
        </div>
      )}
    </div>
  )
}
