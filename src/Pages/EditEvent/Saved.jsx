import { useNavigate } from 'react-router-dom'
import { Check, ArrowLeft } from 'lucide-react'
import { toJsDate } from '../../utils'

function formatLongDate(date) {
  const d = toJsDate(date)
  if (!d) return ''
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  return `${weekday} · ${month} ${d.getDate()} · ${d.getFullYear()}`
}

export function Saved({ event, onEditAgain }) {
  const navigate = useNavigate()
  const categories = event.categories?.length ? event.categories : []
  const people = event.people || []
  const partner = people.find((p) => p.toLowerCase() !== 'you')

  const goToEventsList = () => navigate('/events')

  return (
    <div className="min-h-[calc(100vh-80px)] bg-parchment flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={goToEventsList}
          aria-label="Back to events"
          className="w-9 h-9 rounded-full bg-surface shadow-soft flex items-center justify-center text-text hover:bg-accent-warm/40 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[12px] font-medium tracking-[0.2em] text-muted-text uppercase">Saved</span>
        <span className="w-9 h-9" aria-hidden />
      </div>

      <div className="flex-1 px-5 pb-28 pt-8 max-w-lg w-full mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-sienna flex items-center justify-center mb-5">
            <Check size={28} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-[28px] leading-[1.1] text-text">
            Changes <em className="italic">saved.</em>
          </h1>
          {partner && (
            <p className="text-muted-text text-sm mt-3 max-w-xs">
              {partner} will see the updated event on their side too.
            </p>
          )}
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-5">
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex px-2 py-0.5 bg-accent-warm/60 text-text text-[10px] font-medium tracking-wider uppercase rounded-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
          <h2 className="font-display text-[22px] text-text leading-tight mb-2">{event.title}</h2>
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-text">
            {formatLongDate(event.date)}
          </p>
          {event.location && (
            <p className="text-text/80 text-sm mt-2">{event.location}</p>
          )}
          {event.description && (
            <p className="text-text/70 text-sm italic mt-3 leading-relaxed">{event.description}</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-parchment border-t border-accent-warm/30 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={onEditAgain}
            className="px-5 py-3 rounded border border-accent-warm text-text text-xs uppercase tracking-[0.15em] hover:bg-accent-warm/30 transition-colors"
          >
            Edit again
          </button>
          <button
            onClick={goToEventsList}
            className="flex-1 py-3.5 rounded bg-foreground text-background font-medium text-xs uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
          >
            Back to events
          </button>
        </div>
      </div>
    </div>
  )
}
