// /src/app/map/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import shopsData from '@/data/shops.json'
import layersData from '@/data/layers.json'
import { getStamps, type StampRecord } from '@/lib/stamps'

const shops = shopsData as any[]
const layers = layersData as any[]

// Stops projected by passport order, not real geography.
// Y offset hints at which corridor: design (top), fifth/third (alternating middle), bay (bottom).
function stopToX(passportStop: number, flip: boolean): number {
  const pct = ((passportStop - 1) / 14) * 92 + 4
  return flip ? 100 - pct : pct
}

function zoneToYOffset(zone: string, passportStop: number): number {
  if (zone === 'main') return 0
  if (zone === 'boardwalk') return 55
  return passportStop % 2 === 1 ? -35 : 35
}

// Sort core stops for the route line
const coreStops = shops
  .filter(s => s.passportType === 'core')
  .sort((a, b) => a.passportStop - b.passportStop)

const bonusStops = shops.filter(s => s.passportType === 'bonus')

export default function MapPage() {
  const [stamps, setStamps] = useState<StampRecord>({})
  const [mounted, setMounted] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState<string | null>('coffee')
  const [selectedStop, setSelectedStop] = useState<string | null>(null)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setStamps(getStamps())
    setMounted(true)
  }, [])

  useEffect(() => {
    const sync = () => setStamps(getStamps())
    window.addEventListener('focus', sync)
    return () => window.removeEventListener('focus', sync)
  }, [])

  function selectLayer(layerId: string) {
    setSelectedLayer(layerId)
  }

  const visibleCoreStops = useMemo(() => {
    if (selectedLayer === null) return coreStops
    return coreStops.filter(s => s.layers.includes(selectedLayer))
  }, [selectedLayer])

  const visibleBonusStops = useMemo(() => {
    if (selectedLayer === null) return []
    return bonusStops.filter(s => s.layers.includes(selectedLayer))
  }, [selectedLayer])

  const visibleDirectoryStops = useMemo(() => {
    return shops.filter(s => {
      if (s.passportType !== 'directory') return false
      if (selectedLayer === null) return false
      return s.layers.includes(selectedLayer)
    })
  }, [selectedLayer])

  const selectedShop = selectedStop ? shops.find(s => s.id === selectedStop) : null
  const coreStamped = coreStops.filter(s => stamps[s.id]).length

  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--navy)]">

      {/* HEADER */}
      <div className="bg-[var(--navy)] px-6 py-6 text-center border-b-4 border-[var(--gold)]">
        <Link
          href="/"
          className="font-mono text-[10px] tracking-widest text-[var(--gold)] opacity-60
                     hover:opacity-100 transition-opacity uppercase"
        >
          ← Asbury Park Postmarks
        </Link>
        <h1 className="font-serif text-3xl font-black text-[var(--cream)] mt-2">
          The Map
        </h1>
        <p className="text-[var(--gold)] text-sm italic mt-1 opacity-70">
          Fifteen stops, west to east
        </p>
      </div>

      {/* LAYER FILTERS */}
      <div className="max-w-2xl mx-auto px-4 pt-5">
        <p className="text-center font-mono text-[10px] tracking-widest text-[var(--navy-mid)] opacity-50 uppercase mb-3">
          Tap to filter by type
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedLayer(null)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-mono transition-all border
              ${selectedLayer === null
                ? 'bg-[var(--navy)] text-white border-transparent'
                : 'bg-transparent border-[var(--navy-mid)]/20 text-[var(--navy-mid)] opacity-50 hover:opacity-80'
              }
            `}
          >
            All
          </button>
          {layers.map(layer => {
            const active = selectedLayer === layer.id
            return (
              <button
                key={layer.id}
                onClick={() => selectLayer(layer.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono
                  transition-all border
                  ${active
                    ? 'text-white border-transparent'
                    : 'bg-transparent border-[var(--navy-mid)]/20 text-[var(--navy-mid)] opacity-50 hover:opacity-80'
                  }
                `}
                style={active ? { backgroundColor: layer.color } : {}}
              >
                <span>{layer.icon}</span>
                <span>{layer.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* MAP CONTAINER */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="relative bg-white/40 border border-[var(--navy-mid)]/15 rounded-sm p-4 overflow-hidden">

          {/* Direction labels + flip toggle */}
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[9px] tracking-widest text-[var(--navy-mid)] opacity-40 uppercase">
              {flipped ? '← East' : '← West'}
            </span>
            <button
              onClick={() => setFlipped(f => !f)}
              className="font-mono text-[9px] tracking-widest text-[var(--navy-mid)] opacity-50
                         hover:opacity-80 transition-opacity px-2 py-1 border border-[var(--navy-mid)]/20
                         rounded-sm bg-white/50 hover:bg-white/80"
            >
              ⇄ Flip
            </button>
            <span className="font-mono text-[9px] tracking-widest text-[var(--navy-mid)] opacity-40 uppercase">
              {flipped ? 'West →' : 'East →'}
            </span>
          </div>

          {/* The corridor */}
          <div className="relative h-[340px]">

            {/* Route line segments — gold when both ends are stamped */}
            {coreStops.slice(0, -1).map((shop, i) => {
              const nextShop = coreStops[i + 1]
              const x1 = stopToX(shop.passportStop, flipped)
              const x2 = stopToX(nextShop.passportStop, flipped)
              const bothStamped = !!stamps[shop.id] && !!stamps[nextShop.id]
              return (
                <div
                  key={`seg-${i}`}
                  className="absolute h-[3px] rounded-full"
                  style={{
                    left: `${Math.min(x1, x2)}%`,
                    width: `${Math.abs(x2 - x1)}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: bothStamped ? 'var(--gold)' : 'rgba(26,53,96,0.2)',
                    transition: 'background-color 0.8s ease',
                  }}
                />
              )
            })}

            {/* Corridor crossing placeholder */}
            <div
              className="absolute top-0 bottom-0 w-px transition-all duration-500"
              style={{ left: `${stopToX(4.5, flipped)}%` }}
            >
              <div className="absolute inset-0 bg-[var(--gold)] opacity-30" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="font-mono text-[8px] text-[var(--gold)] tracking-widest bg-[var(--cream)]/80 px-1.5 py-0.5 rounded-sm">
                  MAIN ST
                </span>
              </div>
            </div>

            {/* Cross-street labels */}
            <div
              className="absolute font-mono text-[8px] tracking-widest text-[var(--navy-mid)] opacity-30 uppercase"
              style={{ top: '24px', left: `${stopToX(2.5, flipped)}%`, transform: 'translateX(-50%)' }}
            >
              BANGS AVE
            </div>
            <div
              className="absolute font-mono text-[8px] tracking-widest text-[var(--navy-mid)] opacity-30 uppercase"
              style={{ top: '24px', left: `${stopToX(9.5, flipped)}%`, transform: 'translateX(-50%)' }}
            >
              COOKMAN AVE
            </div>
            <div
              className="absolute font-mono text-[8px] tracking-widest text-[var(--navy-mid)] opacity-30 uppercase"
              style={{ top: '24px', left: `${stopToX(14.5, flipped)}%`, transform: 'translateX(-50%)' }}
            >
              BOARDWALK
            </div>

            {/* Zone labels */}
            {(() => {
              const crossPct = stopToX(4.5, flipped)
              const bangsCenter = flipped
                ? crossPct + (100 - crossPct) / 2
                : crossPct / 2
              const cookmanCenter = flipped
                ? crossPct / 2
                : crossPct + (100 - crossPct) / 2
              return (
                <>
                  <div
                    className="absolute font-mono text-[8px] tracking-widest text-[var(--navy-mid)] opacity-30 uppercase transition-all duration-500"
                    style={{ top: '8px', left: `${bangsCenter}%`, transform: 'translateX(-50%)' }}
                  >
                    BANGS AVE
                  </div>
                  <div
                    className="absolute font-mono text-[8px] tracking-widest text-[var(--navy-mid)] opacity-30 uppercase transition-all duration-500"
                    style={{ top: '8px', left: `${cookmanCenter}%`, transform: 'translateX(-50%)' }}
                  >
                    COOKMAN AVE
                  </div>
                </>
              )
            })()}

            {/* Non-collection layer dots */}
            {visibleDirectoryStops
              .map(shop => {
                const x = stopToX(5, flipped)
                const layerColor = layers.find(l => l.id === shop.layers[0])?.color || '#999'
                const hash = shop.id.charCodeAt(0) + shop.id.charCodeAt(1)
                const yOffset = (hash % 7) * 18 - 63
                return (
                  <button
                    key={shop.id}
                    onClick={() => setSelectedStop(selectedStop === shop.id ? null : shop.id)}
                    className={`
                      absolute w-3 h-3 rounded-full transition-all duration-200
                      hover:scale-150 hover:z-20
                      ${selectedStop === shop.id ? 'scale-150 z-20 ring-2 ring-white' : 'opacity-50 hover:opacity-90'}
                    `}
                    style={{
                      left: `${x}%`,
                      top: `calc(50% + ${yOffset}px)`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: layerColor,
                    }}
                    title={shop.name}
                  />
                )
              })}

            {/* Bonus stops */}
            {visibleBonusStops.map(shop => {
              const x = stopToX(shop.passportStop || 5, flipped)
              const stamped = !!stamps[shop.id]
              const hash = shop.id.charCodeAt(2) + shop.id.charCodeAt(3)
              const yOffset = (hash % 5) * 14 - 28
              return (
                <button
                  key={shop.id}
                  onClick={() => setSelectedStop(selectedStop === shop.id ? null : shop.id)}
                  className={`
                    absolute w-4 h-4 rounded-sm transition-all duration-200
                    hover:scale-150 hover:z-20 rotate-45
                    ${selectedStop === shop.id ? 'scale-150 z-20 ring-2 ring-white' : ''}
                    ${stamped ? 'opacity-100' : 'opacity-60 hover:opacity-90'}
                  `}
                  style={{
                    left: `${x}%`,
                    top: `calc(50% + ${yOffset}px)`,
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    backgroundColor: shop.selloColor,
                  }}
                  title={shop.name}
                />
              )
            })}

            {/* Core postmark stops */}
            {visibleCoreStops.map(shop => {
              const x = stopToX(shop.passportStop, flipped)
              const stamped = !!stamps[shop.id]
              const yOffset = zoneToYOffset(shop.zone, shop.passportStop)
              const above = yOffset < 0
              return (
                <button
                  key={shop.id}
                  onClick={() => setSelectedStop(selectedStop === shop.id ? null : shop.id)}
                  className="absolute flex flex-col items-center transition-all duration-200 hover:z-20 group"
                  style={{
                    left: `${x}%`,
                    top: `calc(50% + ${yOffset}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className="absolute w-px bg-[var(--navy-mid)]/15"
                    style={{
                      height: `${Math.abs(yOffset) - 14}px`,
                      top: above ? '100%' : 'auto',
                      bottom: above ? 'auto' : '100%',
                    }}
                  />

                  <div
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center
                      text-xs font-mono font-bold transition-all duration-300
                      group-hover:scale-110
                      ${selectedStop === shop.id ? 'scale-110 ring-2 ring-[var(--gold)]' : ''}
                      ${stamped ? 'text-white shadow-sm' : 'text-white/70'}
                    `}
                    style={{
                      backgroundColor: stamped ? shop.selloColor : `${shop.selloColor}88`,
                    }}
                  >
                    {stamped ? '✓' : shop.passportStop}
                  </div>

                  <p className={`
                    text-center font-mono text-[9px] text-[var(--navy)] mt-1 leading-tight w-16 break-words
                    ${stamped ? 'text-[var(--navy)]' : 'text-[var(--navy-mid)] opacity-60'}
                  `}>
                    {shop.name}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-dashed border-[var(--navy-mid)]/15">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-[var(--navy)] flex items-center justify-center">
                <span className="text-white text-[7px] font-mono">1</span>
              </div>
              <span className="font-mono text-[9px] text-[var(--navy-mid)] opacity-60">Postmark stop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#2a6b3a] opacity-60" />
              <span className="font-mono text-[9px] text-[var(--navy-mid)] opacity-60">Also on corridor</span>
            </div>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      {selectedStop && selectedShop && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setSelectedStop(null)}
        />
      )}

      {/* BOTTOM SHEET */}
      {selectedStop && selectedShop && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[var(--cream)] rounded-t-2xl shadow-[0_-4px_24px_rgba(13,31,60,0.15)] max-w-2xl mx-auto"
            style={{
              borderTopColor: selectedShop.selloColor,
              borderTopWidth: '4px',
              borderTopStyle: 'solid',
            }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[var(--navy-mid)]/20" />
            </div>

            <div className="px-6 pb-8 pt-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-mono text-[10px] tracking-widest text-[var(--navy-mid)] opacity-50 uppercase mb-1">
                    {selectedShop.layers?.[0]}
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-[var(--navy)] leading-tight">
                    {selectedShop.name}
                  </h2>
                  <p className="font-mono text-xs text-[var(--navy-mid)] opacity-60 mt-1">
                    {selectedShop.address}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStop(null)}
                  className="w-8 h-8 rounded-full bg-[var(--navy-mid)]/10 flex items-center
                             justify-center font-mono text-sm text-[var(--navy-mid)]
                             hover:bg-[var(--navy-mid)]/20 transition-colors flex-shrink-0 mt-1"
                >
                  ×
                </button>
              </div>

              {(() => {
                const todayKey = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()]
                const todayHours = selectedShop.hours?.[todayKey]
                const isClosed = todayHours?.toLowerCase() === 'closed'
                return todayHours ? (
                  <p className="font-mono text-sm mt-3">
                    <span className="text-[var(--gold)] font-bold">→ Today: </span>
                    <span className={isClosed ? 'text-[#b5451b]' : 'text-[var(--navy)]'}>
                      {todayHours}
                    </span>
                  </p>
                ) : null
              })()}

              <div className="flex flex-wrap gap-2 mt-3">
                {selectedShop.layers?.map((layerId: string) => {
                  const layer = layers.find(l => l.id === layerId)
                  return layer ? (
                    <span
                      key={layerId}
                      className="text-[10px] font-mono px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: layer.color }}
                    >
                      {layer.icon} {layer.label}
                    </span>
                  ) : null
                })}
              </div>

              <div className="flex gap-3 mt-4">
                {selectedShop.passportType === 'core' && (
                  <Link
                    href={`/stop/${selectedShop.id}`}
                    className="flex-1 py-3 bg-[var(--navy)] text-[var(--cream)] text-center
                               font-mono text-xs tracking-widest uppercase rounded-sm
                               hover:bg-[var(--navy-mid)] transition-colors"
                  >
                    Visit Stop →
                  </Link>
                )}
                {selectedShop.instagram && (
                  <a
                    href={`https://instagram.com/${selectedShop.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 border border-[var(--navy-mid)]/30 text-[var(--navy-mid)]
                               text-center font-mono text-xs tracking-widest uppercase
                               rounded-sm hover:bg-[var(--navy-mid)]/10 transition-colors"
                  >
                    Instagram ↗
                  </a>
                )}
                {selectedShop.placeId && (
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${selectedShop.placeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 border border-[var(--navy-mid)]/30 text-[var(--navy-mid)]
                               text-center font-mono text-xs tracking-widest uppercase
                               rounded-sm hover:bg-[var(--navy-mid)]/10 transition-colors"
                  >
                    Directions ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROUTE LIST */}
      <div className="max-w-2xl mx-auto px-4 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-serif text-lg font-bold text-[var(--navy)]">
            The Route
          </h2>
          <div className="flex-1 border-t border-dashed border-[var(--navy-mid)] opacity-20" />
          <span className="font-mono text-[10px] text-[var(--navy-mid)] opacity-50">
            {coreStamped}/{coreStops.length}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {coreStops.map((shop, i) => {
            const stamped = !!stamps[shop.id]
            const showDivider = i === 5 ? '→ Cookman Ave' : i === 13 ? '→ Boardwalk' : null
            return (
              <div key={shop.id}>
                {showDivider && (
                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-[var(--gold)] opacity-30" />
                    <span className="font-mono text-[9px] text-[var(--gold)] tracking-widest">{showDivider}</span>
                    <div className="flex-1 h-px bg-[var(--gold)] opacity-30" />
                  </div>
                )}
                <Link
                  href={`/stop/${shop.id}`}
                  className="flex items-center gap-2.5 p-2.5 bg-white/40 border border-[var(--navy-mid)]/10
                             rounded-sm hover:bg-white/70 transition-all group"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center
                               text-white text-[10px] font-mono font-bold flex-shrink-0"
                    style={{ backgroundColor: stamped ? shop.selloColor : `${shop.selloColor}66` }}
                  >
                    {stamped ? '✓' : shop.passportStop}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-serif text-sm truncate ${stamped ? 'font-bold text-[var(--navy)]' : 'text-[var(--navy-mid)]'}`}>
                      {shop.name}
                    </p>
                  </div>
                  <span className="font-mono text-[9px] text-[var(--navy-mid)] opacity-30 flex-shrink-0">
                    {shop.address.split(' ').slice(0, 2).join(' ')}
                  </span>
                  <span className="text-[var(--navy-mid)] opacity-20 group-hover:opacity-50 transition-all text-sm">
                    →
                  </span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* POSTCARDS CTA */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <Link
          href="/passport"
          className="block w-full py-4 bg-[var(--navy)] text-[var(--cream)] text-center
                     font-mono text-sm tracking-widest uppercase rounded-sm
                     shadow-[3px_3px_0_var(--gold)] hover:translate-x-[-1px]
                     hover:translate-y-[-1px] hover:shadow-[4px_4px_0_var(--gold)]
                     transition-all"
        >
          View Your Postcards
        </Link>
      </div>

      {/* FOOTER */}
      <div className="bg-[var(--navy)] px-6 py-6 text-center border-t-2 border-[var(--gold)]">
        <Link
          href="/"
          className="font-mono text-xs text-[var(--gold)] opacity-60
                     hover:opacity-100 transition-opacity tracking-widest uppercase"
        >
          ← Back Home
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          60% { transform: translateY(-4px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.35s ease-out;
        }
      `}} />

    </main>
  )
}
