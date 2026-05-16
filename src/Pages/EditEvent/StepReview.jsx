import { useState } from 'react'
import { Tag, Calendar as CalendarIcon, MapPin, Users, AlignLeft, Trash2 } from 'lucide-react'

function formatDate(date) {
  if (!date) return '—'
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export function StepReview({ formData, onEditStep, onDelete, isSubmitting }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const rows = [
    {
      step: 0,
      icon: <Tag size={14} className="text-sienna" />,
      label: 'Title · Category',
      value: (
        <div>
          <p className="text-text">{formData.title || '—'}</p>
          {formData.categories.length > 0 && (
            <p className="text-muted-text text-xs mt-1">{formData.categories.join(' · ')}</p>
          )}
        </div>
      ),
    },
    {
      step: 1,
      icon: <CalendarIcon size={14} className="text-sienna" />,
      label: 'When',
      value: <p className="text-text">{formatDate(formData.date)}</p>,
    },
    {
      step: 1,
      icon: <MapPin size={14} className="text-sienna" />,
      label: 'Where',
      value: <p className="text-text truncate">{formData.location || '—'}</p>,
    },
    {
      step: 2,
      icon: <Users size={14} className="text-sienna" />,
      label: 'Who',
      value: <p className="text-text">{formData.people.join(' & ') || '—'}</p>,
    },
    {
      step: 2,
      icon: <AlignLeft size={14} className="text-sienna" />,
      label: 'Notes',
      value: (
        <p className="text-text/80 line-clamp-3 text-sm leading-relaxed">
          {formData.description || '—'}
        </p>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <p className="text-text/70 text-sm leading-relaxed -mt-2">
        A small recap. Tap any field to jump back and tweak.
      </p>

      <div className="bg-surface rounded-lg shadow-soft divide-y divide-accent-warm/40">
        {rows.map((row, i) => (
          <button
            key={i}
            onClick={() => onEditStep(row.step)}
            className="w-full flex items-start gap-3 p-4 text-left hover:bg-accent-warm/20 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-accent-warm/40 flex items-center justify-center shrink-0">
              {row.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-text mb-1">{row.label}</p>
              {row.value}
            </div>
            <span className="text-[11px] uppercase tracking-[0.15em] text-sienna shrink-0 self-center group-hover:underline">
              Edit
            </span>
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-accent-warm/40">
        <p className="text-[10px] uppercase tracking-[0.15em] text-destructive/80 mb-3">
          Danger zone
        </p>
        {!confirmOpen ? (
          <button
            onClick={() => setConfirmOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded border border-dashed border-destructive/40 text-destructive text-xs uppercase tracking-[0.15em] hover:bg-destructive/5 transition-colors"
          >
            <Trash2 size={14} />
            Delete event
          </button>
        ) : (
          <div className="bg-destructive/5 border border-destructive/30 rounded-lg p-4">
            <p className="text-sm text-text mb-3">
              Delete this event permanently? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded border border-accent-warm text-text text-xs uppercase tracking-[0.15em] hover:bg-accent-warm/30 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded bg-destructive text-white text-xs uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
