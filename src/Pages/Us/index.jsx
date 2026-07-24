import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { getCoupleProfile, getEvents, getMilestones } from '../../db'
import { MilestoneDialog } from './Components/MilestoneDialog'
import { TogetherSinceDialog } from './Components/TogetherSinceDialog'
import {
  daysBetween,
  formatFullDate,
  formatShortDate,
  iconGlyph,
  nextOccurrence,
  togetherBreakdown,
} from './milestoneUtils'

function MilestoneRow({ milestone, onClick }) {
  const { title, glyph, next, days, urgent, passed, repeatLabel } = milestone
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3.5 rounded-sm border bg-surface px-4 py-3.5 text-left shadow-(--shadow-soft) transition-all hover:-translate-y-px hover:shadow-(--shadow-soft-hover) ${
        urgent ? 'border-sienna' : 'border-accent-warm/70'
      } ${passed ? 'opacity-60' : ''}`}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-warm/60 text-[15px] text-sienna-dark">
        {glyph}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-[15px] font-medium sm:text-base">{title}</div>
        <div className="mt-0.5 text-[11px] text-muted-text">
          {passed ? `${formatShortDate(next)} · passed` : formatFullDate(next)}
          {repeatLabel && ` · ${repeatLabel}`}
        </div>
      </div>
      {!passed && (
        <div className={`shrink-0 font-display text-lg ${urgent ? 'text-sienna' : 'text-text'}`}>
          {days === 0 ? 'Today' : `${days}d`}
        </div>
      )}
    </button>
  )
}

export default function Us() {
  const [profile, setProfile] = useState(null)
  const [milestones, setMilestones] = useState([])
  const [eventCount, setEventCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState(null)
  const [sinceDialogOpen, setSinceDialogOpen] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [profileData, milestoneData, events] = await Promise.all([
        getCoupleProfile(),
        getMilestones(),
        getEvents(),
      ])
      setProfile(profileData)
      setMilestones(milestoneData)
      setEventCount(events.length)
    } catch (error) {
      console.error('Error fetching Us data:', error)
    }
  }, [])

  useEffect(() => {
    fetchData().finally(() => setIsLoading(false))
  }, [fetchData])

  const togetherSince = profile?.togetherSince?.toDate() ?? null

  const counter = useMemo(() => {
    if (!togetherSince) return null
    return { days: daysBetween(togetherSince, new Date()), ...togetherBreakdown(togetherSince) }
  }, [togetherSince])

  const { upcoming, passed } = useMemo(() => {
    const upcomingList = []
    const passedList = []

    milestones.forEach((m) => {
      if (!m.date?.toDate) return
      const date = m.date.toDate()
      const next = nextOccurrence(date, m.repeats)
      const repeatLabel =
        m.repeats === 'yearly' ? 'every year' : m.repeats === 'monthly' ? 'every month' : null
      const base = { ...m, glyph: iconGlyph(m.icon), repeatLabel }

      if (next) {
        upcomingList.push({ ...base, next, days: daysBetween(new Date(), next), passed: false })
      } else {
        passedList.push({ ...base, next: date, days: null, passed: true })
      }
    })

    upcomingList.sort((a, b) => a.next - b.next)
    if (upcomingList.length) upcomingList[0].urgent = true
    passedList.sort((a, b) => b.next - a.next)

    return { upcoming: upcomingList, passed: passedList }
  }, [milestones])

  const openAdd = () => {
    setEditingMilestone(null)
    setMilestoneDialogOpen(true)
  }

  const openEdit = (milestone) => {
    setEditingMilestone(milestone)
    setMilestoneDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-parchment">
        <Loader2 className="size-8 animate-spin text-sienna" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-parchment">
      <div className="mx-auto w-full max-w-5xl px-5 py-8 lg:py-10">
        <div className="gap-8 lg:grid lg:grid-cols-[340px_1fr] lg:items-start">
          {/* Counter card */}
          <div className="mb-8 lg:mb-0">
            <div className="relative rounded-sm bg-gradient-to-b from-accent-warm/70 to-surface px-6 py-8 text-center shadow-(--shadow-soft) sm:py-9">
              <button
                onClick={() => setSinceDialogOpen(true)}
                title="Edit start date"
                className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full text-muted-text transition-colors hover:bg-foreground/5 hover:text-text"
              >
                <Pencil size={13} />
              </button>

              {togetherSince ? (
                <>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-text">
                    together since {formatShortDate(togetherSince)}
                  </div>
                  <div className="mt-2.5 font-display text-[56px] leading-none font-medium tracking-tight lg:text-[64px]">
                    {counter.days.toLocaleString()}
                  </div>
                  <div className="mt-1.5 font-display text-[17px] italic text-sienna-dark">
                    days &amp; counting
                  </div>
                  <div className="mt-4 flex items-baseline justify-center gap-5 text-[11px] text-muted-text">
                    <span>
                      <b className="mr-1 font-display text-base font-medium text-text">{counter.years}</b>
                      years
                    </span>
                    <span>
                      <b className="mr-1 font-display text-base font-medium text-text">{counter.months}</b>
                      months
                    </span>
                    <span>
                      <b className="mr-1 font-display text-base font-medium text-text">{eventCount}</b>
                      events
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-display text-xl font-medium">The day it all began</div>
                  <p className="mx-auto mt-2 max-w-[240px] text-xs leading-relaxed text-muted-text">
                    Set your start date and this becomes a running count of your days together.
                  </p>
                  <Button
                    onClick={() => setSinceDialogOpen(true)}
                    className="mt-5 rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]"
                  >
                    Set the date
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-[22px] font-medium">Upcoming milestones</h2>
              <Button
                onClick={openAdd}
                className="shrink-0 rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]"
              >
                <Plus size={13} />
                Add a milestone
              </Button>
            </div>

            {upcoming.length === 0 && passed.length === 0 ? (
              <div className="rounded-sm bg-surface px-6 py-10 text-center shadow-(--shadow-soft)">
                <div className="font-display text-lg font-medium">Nothing on the horizon yet</div>
                <p className="mx-auto mt-1.5 max-w-[280px] text-xs leading-relaxed text-muted-text">
                  Add anniversaries, birthdays, or any date worth counting down to.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {upcoming.map((m) => (
                    <MilestoneRow key={m.id} milestone={m} onClick={() => openEdit(m)} />
                  ))}
                </div>

                {passed.length > 0 && (
                  <>
                    <div className="mt-6 mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-text">
                      Passed
                    </div>
                    <div className="flex flex-col gap-2">
                      {passed.map((m) => (
                        <MilestoneRow key={m.id} milestone={m} onClick={() => openEdit(m)} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <MilestoneDialog
        open={milestoneDialogOpen}
        onClose={() => setMilestoneDialogOpen(false)}
        milestone={editingMilestone}
        onSaved={fetchData}
      />
      <TogetherSinceDialog
        open={sinceDialogOpen}
        onClose={() => setSinceDialogOpen(false)}
        togetherSince={togetherSince}
        onSaved={fetchData}
      />
    </div>
  )
}
