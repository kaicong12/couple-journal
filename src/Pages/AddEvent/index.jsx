import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timestamp } from 'firebase/firestore'
import { uploadEvent } from '../../db'
import { StepPhotos } from './StepPhotos'
import { StepDetails } from './StepDetails'
import { StepStory } from './StepStory'
import { ArrowLeft } from 'lucide-react'
import { useToast } from '@chakra-ui/react'

const STEPS = ['Pick Photos', 'When & Where', 'Tell the Story']

const DEFAULT_CATEGORIES = ['Meals', 'Gifts', 'Trips']

export default function AddEvent() {
  const navigate = useNavigate()
  const toast = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    files: [],
    date: null,
    location: '',
    categories: [],
    people: [],
    title: '',
    description: '',
    tags: [],
  })

  const [errors, setErrors] = useState({})

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
    setErrors(prev => {
      const next = { ...prev }
      Object.keys(updates).forEach(key => delete next[key])
      return next
    })
  }, [])

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 0) {
      if (!formData.files.length) {
        newErrors.files = 'Please select at least one photo'
      }
    } else if (step === 1) {
      if (!formData.date) {
        newErrors.date = 'Date is required'
      }
      if (!formData.location) {
        newErrors.location = 'Location is required'
      }
    } else if (step === 2) {
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      const eventPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: Timestamp.fromDate(formData.date),
        location: formData.location,
        categories: formData.categories,
        people: formData.people,
        tags: formData.tags,
        files: formData.files,
      }

      await uploadEvent(eventPayload)

      toast({
        title: 'Event saved!',
        description: 'Your event has been added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      navigate('/events')
    } catch (error) {
      console.error('Failed to save event:', error)
      toast({
        title: 'Error',
        description: 'Failed to save event. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-parchment flex flex-col">
      <div className="max-w-lg mx-auto px-5 py-6 flex-1 w-full pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => currentStep === 0 ? navigate('/events') : handleBack()}
            className="flex items-center gap-1.5 text-muted-text hover:text-text transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>
          <h1 className="font-display text-xl font-medium text-text">New Event</h1>
          <div className="w-14" />
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center gap-1 mb-2">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  idx <= currentStep ? 'bg-sienna' : 'bg-accent-warm'
                }`}
              />
            ))}
          </div>
          <p className="text-xs uppercase tracking-wider text-muted-text">
            Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep]}
          </p>
        </div>

        {/* Step content */}
        {currentStep === 0 && (
          <StepPhotos
            files={formData.files}
            onChange={(files) => updateFormData({ files })}
            error={errors.files}
          />
        )}
        {currentStep === 1 && (
          <StepDetails
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            defaultCategories={DEFAULT_CATEGORIES}
          />
        )}
        {currentStep === 2 && (
          <StepStory
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        )}
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-parchment border-t border-accent-warm/30 px-5 py-4">
        <div className="max-w-lg mx-auto">
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="w-full bg-foreground text-background py-3.5 rounded font-medium text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-foreground text-background py-3.5 rounded font-medium text-sm uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Event'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
