const MS_PER_DAY = 24 * 60 * 60 * 1000

export const ICONS = [
    { id: 'heart', glyph: '♥', name: 'Anniversary' },
    { id: 'circle', glyph: '◯', name: 'Birthday' },
    { id: 'star', glyph: '✦', name: 'First / special' },
    { id: 'flag', glyph: '⚑', name: 'Milestone' },
]

export const REPEAT_OPTIONS = [
    { value: 'none', label: "Doesn't repeat" },
    { value: 'yearly', label: 'Every year' },
    { value: 'monthly', label: 'Every month' },
]

export function iconGlyph(iconId) {
    return ICONS.find((i) => i.id === iconId)?.glyph ?? '♥'
}

export function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysBetween(from, to) {
    return Math.round((startOfDay(to) - startOfDay(from)) / MS_PER_DAY)
}

// Number of days in a given (0-indexed) month of a year.
function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

// Build a date for (year, month, day), clamping day to the month's length so
// e.g. day 31 in February lands on Feb 28/29 instead of rolling into March.
function clampedDate(year, month, day) {
    return new Date(year, month, Math.min(day, daysInMonth(year, month)))
}

// Next date this milestone lands on, today or later.
// Non-repeating milestones already in the past return null.
export function nextOccurrence(date, repeats, today = new Date()) {
    const target = startOfDay(date)
    const now = startOfDay(today)
    const targetDay = target.getDate()

    if (!repeats || repeats === 'none') {
        return target >= now ? target : null
    }

    if (repeats === 'yearly') {
        let candidate = clampedDate(now.getFullYear(), target.getMonth(), targetDay)
        if (candidate < now) {
            candidate = clampedDate(now.getFullYear() + 1, target.getMonth(), targetDay)
        }
        return candidate
    }

    // monthly
    let candidate = clampedDate(now.getFullYear(), now.getMonth(), targetDay)
    if (candidate < now) {
        candidate = clampedDate(now.getFullYear(), now.getMonth() + 1, targetDay)
    }
    return candidate
}

// Full years and remaining full months since a start date.
export function togetherBreakdown(since, today = new Date()) {
    const start = startOfDay(since)
    const now = startOfDay(today)

    let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
    if (now.getDate() < start.getDate()) months -= 1
    months = Math.max(0, months)

    return { years: Math.floor(months / 12), months: months % 12 }
}

export function formatFullDate(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatShortDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
