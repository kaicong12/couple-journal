import { useState } from 'react'
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react'
import { Calendar } from '@/Components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/popover'
import { LocationSearchBox } from '../EventsList/Components/LocationSearchBox'

function formatDate(date) {
  if (!date) return null
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function StepWhenWhere({ formData, updateFormData, errors, recentPlaces }) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [showLocationSearch, setShowLocationSearch] = useState(false)

  const handleLocationChange = (location) => {
    const text = location?.label ?? ''
    updateFormData({ location: text })
    setShowLocationSearch(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2 block">
          <CalendarIcon size={11} className="inline mr-1.5 relative -top-px" />
          Date
        </label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger
            className={`w-full flex items-center gap-3 p-3.5 rounded-lg border bg-surface text-left transition-colors ${
              errors.date ? 'border-destructive' : 'border-accent-warm hover:border-sienna/50'
            }`}
          >
            <CalendarIcon size={16} className="text-sienna shrink-0" />
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

      <div>
        <label className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2 block">
          <MapPin size={11} className="inline mr-1.5 relative -top-px" />
          Place
        </label>
        {showLocationSearch ? (
          <div
            className={`w-full rounded-lg border transition-colors ${
              errors.location ? 'border-destructive' : 'border-accent-warm bg-surface'
            }`}
          >
            <div className="flex items-center gap-3 px-3.5 w-full min-w-0">
              <MapPin size={16} className="text-sienna shrink-0" />
              <div className="flex-1 min-w-0 [&_*]:!border-0 [&_*]:!shadow-none [&_.css-13cymwt-control]:!bg-transparent [&_.css-t3ipsp-control]:!bg-transparent">
                <LocationSearchBox
                  onSelectLocation={handleLocationChange}
                  currentLocation={formData.location}
                  editMode={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLocationSearch(true)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-lg border bg-surface text-left transition-colors min-w-0 ${
              errors.location ? 'border-destructive' : 'border-accent-warm hover:border-sienna/50'
            }`}
          >
            <MapPin size={16} className="text-sienna shrink-0" />
            <span className={`flex-1 min-w-0 truncate ${formData.location ? 'text-text text-sm' : 'text-muted-text text-sm'}`}>
              {formData.location || 'Search a place…'}
            </span>
          </button>
        )}
        {errors.location && <p className="text-destructive text-xs mt-1.5">{errors.location}</p>}
        {recentPlaces?.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-text mb-2">Recent</p>
            <div className="flex flex-wrap gap-2">
              {recentPlaces.map((place) => (
                <button
                  key={place}
                  onClick={() => updateFormData({ location: place })}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors max-w-full truncate ${
                    formData.location === place
                      ? 'bg-foreground text-background'
                      : 'bg-surface border border-accent-warm text-text hover:border-sienna'
                  }`}
                  title={place}
                >
                  <Clock size={10} className="inline mr-1 relative -top-px opacity-60" />
                  {place}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
