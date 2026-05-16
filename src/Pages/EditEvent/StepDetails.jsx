import { useState } from 'react'
import { AlignLeft, Users, Plus, X } from 'lucide-react'

export function StepDetails({ formData, updateFormData, errors }) {
  const [newPerson, setNewPerson] = useState('')
  const [showPersonInput, setShowPersonInput] = useState(false)

  const addPerson = () => {
    const trimmed = newPerson.trim()
    if (trimmed && !formData.people.includes(trimmed)) {
      updateFormData({ people: [...formData.people, trimmed] })
    }
    setNewPerson('')
    setShowPersonInput(false)
  }

  const removePerson = (person) => {
    updateFormData({ people: formData.people.filter((p) => p !== person) })
  }

  const removePhoto = (idx) => {
    updateFormData({ photos: formData.photos.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-7">
      <div>
        <label className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2 block">
          <AlignLeft size={11} className="inline mr-1.5 relative -top-px" />
          Notes
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="A little more to remember it by…"
          rows={5}
          className="w-full p-3.5 rounded-lg border border-accent-warm bg-surface text-text outline-none transition-colors focus:border-sienna resize-none"
        />
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2">
          Inspiration · Photos
        </p>
        <div className="grid grid-cols-4 gap-2">
          {formData.photos.map((src, idx) => (
            <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-accent-warm">
              <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(idx)}
                aria-label={`Remove photo ${idx + 1}`}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          ))}
          <button
            disabled
            title="Photo upload coming soon"
            className="aspect-square rounded-md border border-dashed border-accent-warm flex items-center justify-center text-muted-text/60 cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2 block">
          <Users size={11} className="inline mr-1.5 relative -top-px" />
          Who's coming
        </label>
        <div className="flex flex-wrap gap-2">
          {formData.people.map((person) => (
            <div
              key={person}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-foreground text-background"
            >
              <span className="w-7 h-7 rounded-full bg-sienna text-white text-xs font-medium flex items-center justify-center">
                {person.charAt(0).toUpperCase()}
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[12px] font-medium">{person}</span>
                <span className="text-[9px] uppercase tracking-[0.1em] opacity-70 mt-0.5">Going ✓</span>
              </div>
              <button
                onClick={() => removePerson(person)}
                aria-label={`Remove ${person}`}
                className="ml-1 opacity-60 hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {showPersonInput ? (
            <input
              autoFocus
              value={newPerson}
              onChange={(e) => setNewPerson(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addPerson()
                if (e.key === 'Escape') setShowPersonInput(false)
              }}
              onBlur={() => (newPerson.trim() ? addPerson() : setShowPersonInput(false))}
              placeholder="Name…"
              className="px-3 py-2 text-xs border border-sienna rounded-full w-28 bg-surface outline-none"
            />
          ) : (
            <button
              onClick={() => setShowPersonInput(true)}
              className="px-3 py-2 rounded-full text-xs font-medium border border-dashed border-accent-warm text-muted-text hover:border-sienna hover:text-sienna transition-colors"
            >
              + Add person
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
