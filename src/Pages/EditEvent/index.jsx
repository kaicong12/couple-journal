import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Timestamp } from 'firebase/firestore'
import { ArrowLeft } from 'lucide-react'
import { useToast } from '@chakra-ui/react'
import { getEvent, getEvents, updateEvent, deleteEvent } from '../../db'
import { toJsDate } from '../../utils'
import { StepBasics } from './StepBasics'
import { StepWhenWhere } from './StepWhenWhere'
import { StepDetails } from './StepDetails'
import { StepReview } from './StepReview'
import { Saved } from './Saved'

const STEPS = ['Basics', 'When & where', 'Details', 'Review']
const STEP_EYEBROWS = ['Step 1 · Basics', 'Step 2 · When & where', 'Step 3 · Details', 'Step 4 · Review']
const STEP_TITLES = [
  'What are you planning?',
  'A place & a time.',
  'A little more to remember it by.',
  'Look right?',
]
const STEP_NEXT_LABELS = ['Next', 'Next', 'Review', 'Save changes']

const DEFAULT_CATEGORIES = ['Meals', 'Gifts', 'Trips']

function eventToForm(event) {
  return {
    title: event.title || '',
    description: event.description || '',
    date: toJsDate(event.date),
    location: event.location || '',
    categories: event.categories?.length
      ? [...event.categories]
      : (event.category ? [event.category] : []),
    people: event.people ? [...event.people] : [],
    photos: event.photos?.length ? [...event.photos] : (event.thumbnail ? [event.thumbnail] : []),
  }
}

export default function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const locationHook = useLocation()
  const toast = useToast()

  const [formData, setFormData] = useState(
    locationHook.state?.event ? eventToForm(locationHook.state.event) : null
  )
  const [loading, setLoading] = useState(!formData)
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedEvent, setSavedEvent] = useState(null)
  const [recentPlaces, setRecentPlaces] = useState([])

  useEffect(() => {
    if (formData) return
    let cancelled = false
    setLoading(true)
    getEvent(id)
      .then((data) => {
        if (cancelled || !data) return
        setFormData(eventToForm(data))
      })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    getEvents()
      .then((events) => {
        const seen = new Set()
        const places = []
        events
          .sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))
          .forEach((e) => {
            if (e.id === id) return
            const loc = e.location
            if (loc && !seen.has(loc)) {
              seen.add(loc)
              places.push(loc)
            }
          })
        setRecentPlaces(places.slice(0, 5))
      })
      .catch(() => setRecentPlaces([]))
  }, [id])

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    setErrors((prev) => {
      const next = { ...prev }
      Object.keys(updates).forEach((k) => delete next[k])
      return next
    })
  }

  const validateStep = (step) => {
    const next = {}
    if (step === 0 && !formData.title.trim()) next.title = 'Title is required'
    if (step === 1) {
      if (!formData.date) next.date = 'Date is required'
      if (!formData.location) next.location = 'Place is required'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      handleSave()
    }
  }

  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1))

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: Timestamp.fromDate(formData.date),
        location: formData.location,
        categories: formData.categories,
        people: formData.people,
        photos: formData.photos,
      }
      await updateEvent(payload)
      setSavedEvent(payload)
    } catch (err) {
      console.error('Save failed', err)
      toast({
        title: 'Save failed',
        description: err.message || 'Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      await deleteEvent(id)
      toast({ title: 'Event deleted', status: 'success', duration: 2500, isClosable: true })
      navigate('/events')
    } catch (err) {
      console.error('Delete failed', err)
      toast({
        title: 'Delete failed',
        description: err.message || 'Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const jumpToStep = (step) => setCurrentStep(step)

  if (loading || !formData) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-parchment flex items-center justify-center">
        <p className="text-muted-text text-sm">Loading…</p>
      </div>
    )
  }

  if (savedEvent) {
    return (
      <Saved
        event={savedEvent}
        onEditAgain={() => {
          setSavedEvent(null)
          setCurrentStep(0)
        }}
      />
    )
  }

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
        <span className="font-display text-[18px] text-text">Edit event</span>
        <span className="w-9 h-9" aria-hidden />
      </div>

      <div className="px-5 max-w-lg w-full mx-auto pt-4">
        <div className="flex items-center gap-1.5 mb-2">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-[3px] flex-1 rounded-full transition-colors ${
                idx < currentStep
                  ? 'bg-foreground'
                  : idx === currentStep
                  ? 'bg-sienna'
                  : 'bg-accent-warm'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-muted-text">
          <span>{STEP_EYEBROWS[currentStep]}</span>
          <span>{currentStep + 1} of {STEPS.length}</span>
        </div>
        <h1 className="font-display text-[28px] leading-[1.15] text-text mt-3 mb-6">
          {STEP_TITLES[currentStep]}
        </h1>
      </div>

      <div className="flex-1 px-5 pb-28 max-w-lg w-full mx-auto">
        {currentStep === 0 && (
          <StepBasics
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            defaultCategories={DEFAULT_CATEGORIES}
          />
        )}
        {currentStep === 1 && (
          <StepWhenWhere
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            recentPlaces={recentPlaces}
          />
        )}
        {currentStep === 2 && (
          <StepDetails
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        )}
        {currentStep === 3 && (
          <StepReview
            formData={formData}
            onEditStep={jumpToStep}
            onDelete={handleDelete}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-parchment border-t border-accent-warm/30 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="px-5 py-3 rounded border border-accent-warm text-text text-xs uppercase tracking-[0.15em] hover:bg-accent-warm/30 transition-colors"
            >
              ← Back
            </button>
          ) : (
            <button
              onClick={() => navigate(`/events/${id}`)}
              className="px-5 py-3 rounded border border-accent-warm text-muted-text text-xs uppercase tracking-[0.15em] hover:bg-accent-warm/30 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`flex-1 py-3.5 rounded font-medium text-xs uppercase tracking-[0.15em] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${
              currentStep === STEPS.length - 1
                ? 'bg-foreground text-background hover:opacity-90'
                : 'bg-sienna text-white hover:opacity-90'
            }`}
          >
            {isSubmitting ? 'Saving…' : STEP_NEXT_LABELS[currentStep] + (currentStep < STEPS.length - 1 ? ' →' : '')}
          </button>
        </div>
      </div>
    </div>
  )
}

