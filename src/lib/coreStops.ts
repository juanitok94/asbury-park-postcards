import shopsData from '@/data/shops.json'

// Single source of truth for core-stop counts. Derives from shops.json.
export const coreStops = (shopsData as any[])
  .filter(s => s.passportType === 'core')
  .sort((a, b) => a.passportStop - b.passportStop)

export const coreCount = coreStops.length

const WORDS = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen',
  'Nineteen', 'Twenty',
]

// "Sixteen" (capitalized); falls back to digits above twenty.
export const coreCountWord = WORDS[coreCount] ?? String(coreCount)

// badges.json thresholds may be a number, "half", or "all".
export function resolveThreshold(t: number | 'half' | 'all'): number {
  if (t === 'all') return coreCount
  if (t === 'half') return Math.ceil(coreCount / 2)
  return t
}
