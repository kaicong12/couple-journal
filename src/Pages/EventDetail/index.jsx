import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, FileText, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@chakra-ui/react'
import { getEvent, deleteEvent } from '../../db'
import { toJsDate } from '../../utils'

function formatLongDate(ts) {
  const d = toJsDate(ts)
  if (!d) return ''
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  return `${weekday} · ${month} ${d.getDate()}, ${d.getFullYear()}`
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [event, setEvent] = useState(location.state?.event || null)
  const [loading, setLoading] = useState(!event)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteEvent(id)
      toast({ title: 'Event deleted', status: 'success', duration: 2500, isClosable: true })
      navigate('/events')
    } catch (err) {
      setDeleting(false)
      setConfirmDelete(false)
      toast({
        title: 'Delete failed',
        description: err.message || 'Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    if (event && event.id === id) return
    let cancelled = false
    setLoading(true)
    getEvent(id)
      .then((data) => {
        if (cancelled) return
        if (!data) setError('Event not found')
        else setEvent(data)
      })
      .catch((e) => !cancelled && setError(e.message || 'Failed to load'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-parchment flex items-center justify-center">
        <p className="text-muted-text text-sm">Loading…</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-parchment flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-text">{error || 'Event not found'}</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 px-4 py-2 bg-foreground text-background rounded text-sm uppercase tracking-wider"
          >
            Back to events
          </button>
        </div>
      </div>
    )
  }

  const categories = event.categories?.length ? event.categories : (event.category ? [event.category] : [])
  const people = event.people || []
  const photos = event.photos?.length ? event.photos : (event.thumbnail ? [event.thumbnail] : [])

  return (
    <div className="min-h-[calc(100vh-80px)] bg-parchment flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-surface shadow-soft flex items-center justify-center text-text hover:bg-accent-warm/40 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[12px] font-medium tracking-[0.2em] text-muted-text uppercase">Event</span>
        <button
          onClick={() => setConfirmDelete(true)}
          aria-label="Delete event"
          className="w-9 h-9 rounded-full bg-surface shadow-soft flex items-center justify-center text-text hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
          onClick={() => !deleting && setConfirmDelete(false)}
        >
          <div
            className="bg-surface rounded-lg shadow-soft max-w-sm w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-[20px] text-text mb-2">Delete this event?</h2>
            <p className="text-text/70 text-sm leading-relaxed mb-5">
              This event will be removed permanently. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded border border-accent-warm text-text text-xs uppercase tracking-[0.15em] hover:bg-accent-warm/30 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded bg-destructive text-white text-xs uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 px-5 pb-28 pt-4 max-w-lg w-full mx-auto">
        {photos.length > 0 && (
          <div className="mb-6 rounded-sm overflow-hidden shadow-soft">
            <img
              src={photos[0]}
              alt={event.title}
              className="w-full h-[260px] object-cover"
            />
          </div>
        )}

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center px-3 py-1 bg-accent-warm/60 text-text text-[11px] font-medium tracking-wider uppercase rounded-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-display text-[32px] font-medium leading-[1.1] text-text">
          {event.title}
        </h1>
        <p className="mt-3 text-[12px] font-medium tracking-[0.15em] text-muted-text uppercase">
          {formatLongDate(event.date)}
        </p>

        <hr className="border-accent-warm/50 my-6" />

        {event.location && (
          <Row icon={<MapPin size={14} className="text-sienna" />} label="Place">
            <p className="text-text">{event.location}</p>
          </Row>
        )}

        {people.length > 0 && (
          <Row icon={<Users size={14} className="text-sienna" />} label="Who's coming">
            <p className="text-text">{people.join(' & ')}</p>
          </Row>
        )}

        {event.description && (
          <Row icon={<FileText size={14} className="text-sienna" />} label="Notes">
            <p className="text-text/80 italic leading-relaxed">{event.description}</p>
          </Row>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-parchment border-t border-accent-warm/30 px-5 py-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate(`/events/${id}/edit`, { state: { event } })}
            className="w-full bg-foreground text-background py-3.5 rounded font-medium text-sm uppercase tracking-[0.15em] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Pencil size={14} />
            Edit Event
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-accent-warm/40 last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-accent-warm/40 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium tracking-[0.15em] text-muted-text uppercase mb-1">{label}</p>
        {children}
      </div>
    </div>
  )
}
