import { useState } from 'react'
import { Calendar as CalendarIcon, MapPin, Tag, Users } from 'lucide-react'
import { Calendar } from '@/Components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/popover'
import { LocationSearchBox } from '../EventsList/Components/LocationSearchBox'

export function StepDetails({ formData, updateFormData, errors, defaultCategories }) {
  const [newCategory, setNewCategory] = useState('')
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [newPerson, setNewPerson] = useState('')
  const [showPersonInput, setShowPersonInput] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const allCategories = [...new Set([...defaultCategories, ...formData.categories])]

  const toggleCategory = (cat) => {
    const current = formData.categories
    if (current.includes(cat)) {
      updateFormData({ categories: current.filter(c => c !== cat) })
    } else {
      updateFormData({ categories: [...current, cat] })
    }
  }

  const addCategory = () => {
    const trimmed = newCategory.trim()
    if (trimmed && !allCategories.includes(trimmed)) {
      updateFormData({ categories: [...formData.categories, trimmed] })
    } else if (trimmed && allCategories.includes(trimmed) && !formData.categories.includes(trimmed)) {
      updateFormData({ categories: [...formData.categories, trimmed] })
    }
    setNewCategory('')
    setShowCategoryInput(false)
  }

  const addPerson = () => {
    const trimmed = newPerson.trim()
    if (trimmed && !formData.people.includes(trimmed)) {
      updateFormData({ people: [...formData.people, trimmed] })
    }
    setNewPerson('')
    setShowPersonInput(false)
  }

  const removePerson = (person) => {
    updateFormData({ people: formData.people.filter(p => p !== person) })
  }

  const handleLocationChange = (location) => {
    const locationText = location?.label ?? ''
    updateFormData({ location: locationText })
  }

  const formatDate = (date) => {
    if (!date) return null
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Date */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-text mb-2 block">
          Date
        </label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger
            className={`w-full flex items-center gap-3 p-3.5 rounded-lg border transition-colors text-left ${
              errors.date
                ? 'border-destructive bg-destructive/5'
                : 'border-accent-warm bg-surface hover:border-sienna/50'
            }`}
          >
            <CalendarIcon size={18} className="text-sienna shrink-0" />
            <span className={formData.date ? 'text-text text-sm' : 'text-muted-text text-sm'}>
              {formatDate(formData.date) || 'Select a date'}
            </span>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => {
                updateFormData({ date })
                setCalendarOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-destructive text-xs mt-1.5">{errors.date}</p>}
      </div>

      {/* Location */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-text mb-2 block">
          Place
        </label>
        <div className={`rounded-lg border transition-colors ${
          errors.location
            ? 'border-destructive bg-destructive/5'
            : 'border-accent-warm bg-surface'
        }`}>
          <div className="flex items-center gap-3 px-3.5">
            <MapPin size={18} className="text-sienna shrink-0" />
            <div className="flex-1 [&_.css-b62m3t-container]:border-0 [&_*]:!border-0 [&_*]:!shadow-none [&_.css-13cymwt-control]:!bg-transparent [&_.css-t3ipsp-control]:!bg-transparent [&_.css-1dimb5e-singleValue]:!text-text [&_.css-1jqq78o-placeholder]:!text-muted-text">
              <LocationSearchBox
                onSelectLocation={handleLocationChange}
                currentLocation={formData.location}
                editMode={true}
              />
            </div>
          </div>
        </div>
        {errors.location && <p className="text-destructive text-xs mt-1.5">{errors.location}</p>}
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-text mb-2 block">
          <Tag size={12} className="inline mr-1.5 relative -top-px" />
          Category (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                formData.categories.includes(cat)
                  ? 'bg-sienna text-white'
                  : 'bg-accent-warm/50 text-muted-text hover:bg-accent-warm'
              }`}
            >
              {cat}
            </button>
          ))}
          {showCategoryInput ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCategory()
                  if (e.key === 'Escape') setShowCategoryInput(false)
                }}
                onBlur={() => {
                  if (newCategory.trim()) addCategory()
                  else setShowCategoryInput(false)
                }}
                placeholder="Type..."
                className="px-2 py-1 text-xs border border-accent-warm rounded-full w-20 bg-transparent outline-none focus:border-sienna"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowCategoryInput(true)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-accent-warm text-muted-text hover:border-sienna hover:text-sienna transition-colors"
            >
              + add
            </button>
          )}
        </div>
      </div>

      {/* People */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-text mb-2 block">
          <Users size={12} className="inline mr-1.5 relative -top-px" />
          Who&apos;s in it
        </label>
        <div className="flex flex-wrap gap-2">
          {formData.people.map((person) => (
            <span
              key={person}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-sienna/10 text-sienna flex items-center gap-1.5"
            >
              {person}
              <button
                onClick={() => removePerson(person)}
                className="hover:text-sienna-dark"
              >
                ×
              </button>
            </span>
          ))}
          {showPersonInput ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addPerson()
                  if (e.key === 'Escape') setShowPersonInput(false)
                }}
                onBlur={() => {
                  if (newPerson.trim()) addPerson()
                  else setShowPersonInput(false)
                }}
                placeholder="Name..."
                className="px-2 py-1 text-xs border border-accent-warm rounded-full w-20 bg-transparent outline-none focus:border-sienna"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowPersonInput(true)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-accent-warm text-muted-text hover:border-sienna hover:text-sienna transition-colors"
            >
              + add person
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
