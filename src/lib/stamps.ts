// /src/lib/stamps.ts
// localStorage wrapper for postmark state.
// Internal stamp naming is preserved for now; values are { [shopId]: ISO timestamp }.

const STORAGE_KEY = 'asbury-park-postmarks:postmarks'
const LAST_POSTMARK_DATE_KEY = 'asbury-park-postmarks:last-postmark-date'

export type StampRecord = Record<string, string> // shopId → ISO date

export function getStamps(): StampRecord {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function addStamp(shopId: string): StampRecord {
  const stamps = getStamps()
  if (!stamps[shopId]) {
    stamps[shopId] = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stamps))
  }
  return stamps
}

export function removeStamp(shopId: string): StampRecord {
  const stamps = getStamps()
  delete stamps[shopId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stamps))
  return stamps
}

export function clearAllStamps(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isStamped(shopId: string): boolean {
  return !!getStamps()[shopId]
}

export function stampCount(): number {
  return Object.keys(getStamps()).length
}

export function recordStampDate(): void {
  if (typeof window === 'undefined') return
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
  localStorage.setItem(LAST_POSTMARK_DATE_KEY, today)
}

export function getLastStampDate(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(LAST_POSTMARK_DATE_KEY)
}
