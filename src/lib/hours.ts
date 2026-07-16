export type Hours = {
  mon: string | null
  tue: string | null
  wed: string | null
  thu: string | null
  fri: string | null
  sat: string | null
  sun: string | null
  note?: string
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function parseRange(range: string): { open: number; close: number } {
  const [openStr, closeStr] = range.split('-')
  const [oh, om] = openStr.split(':').map(Number)
  const [ch, cm] = closeStr.split(':').map(Number)
  return { open: oh * 60 + om, close: ch * 60 + cm }
}

function getRange(hours: Hours, dayIndex: number): { open: number; close: number } | null {
  const key = DAY_KEYS[dayIndex]
  const val = hours[key]
  if (typeof val !== 'string') return null
  return parseRange(val)
}

function formatTime(dayIndex: number, minutes: number): string {
  if (minutes >= 1440) {
    dayIndex = (dayIndex + 1) % 7
    minutes -= 1440
  }
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const h12 = h % 12 || 12
  const ampm = h < 12 ? 'AM' : 'PM'
  return m === 0
    ? `${DAY_LABELS[dayIndex]} ${h12} ${ampm}`
    : `${DAY_LABELS[dayIndex]} ${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function isOpenNow(hours: Hours, now: Date): boolean {
  const dayIndex = now.getDay()
  const currentMin = now.getHours() * 60 + now.getMinutes()

  const todayRange = getRange(hours, dayIndex)
  if (todayRange) {
    if (todayRange.close <= 1440) {
      if (currentMin >= todayRange.open && currentMin < todayRange.close) return true
    } else {
      if (currentMin >= todayRange.open) return true
    }
  }

  const yesterdayIndex = (dayIndex + 6) % 7
  const yesterdayRange = getRange(hours, yesterdayIndex)
  if (yesterdayRange && yesterdayRange.close > 1440) {
    if (currentMin < yesterdayRange.close - 1440) return true
  }

  return false
}

export function nextChange(hours: Hours, now: Date): { state: 'opens' | 'closes'; time: string } {
  const dayIndex = now.getDay()
  const currentMin = now.getHours() * 60 + now.getMinutes()

  const yesterdayIndex = (dayIndex + 6) % 7
  const yesterdayRange = getRange(hours, yesterdayIndex)
  if (yesterdayRange && yesterdayRange.close > 1440) {
    const overflow = yesterdayRange.close - 1440
    if (currentMin < overflow) {
      return { state: 'closes', time: formatTime(dayIndex, overflow) }
    }
  }

  const todayRange = getRange(hours, dayIndex)
  if (todayRange) {
    if (todayRange.close <= 1440) {
      if (currentMin >= todayRange.open && currentMin < todayRange.close) {
        return { state: 'closes', time: formatTime(dayIndex, todayRange.close) }
      }
    } else {
      if (currentMin >= todayRange.open) {
        const tomorrowIndex = (dayIndex + 1) % 7
        return { state: 'closes', time: formatTime(tomorrowIndex, todayRange.close - 1440) }
      }
    }
  }

  if (todayRange && currentMin < todayRange.open) {
    return { state: 'opens', time: formatTime(dayIndex, todayRange.open) }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const checkDay = (dayIndex + offset) % 7
    const range = getRange(hours, checkDay)
    if (range) {
      return { state: 'opens', time: formatTime(checkDay, range.open) }
    }
  }

  return { state: 'opens', time: '' }
}
