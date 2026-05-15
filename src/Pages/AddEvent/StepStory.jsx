import { useState } from 'react'
import { Type, AlignLeft, Tags } from 'lucide-react'

export function StepStory({ formData, updateFormData, errors }) {
  const [newTag, setNewTag] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)

  const addTag = () => {
    const trimmed = newTag.trim().toLowerCase()
    if (trimmed && !formData.tags.includes(trimmed)) {
      updateFormData({ tags: [...formData.tags, trimmed] })
    }
    setNewTag('')
    setShowTagInput(false)
  }

  const removeTag = (tag) => {
    updateFormData({ tags: formData.tags.filter(t => t !== tag) })
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-text mb-2 block">
          <Type size={12} className="inline mr-1.5 relative -top-px" />
          Title
        </label>
        <input
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="Give this event a name..."
          className={`w-full p-3.5 rounded-lg border bg-surface text-sm outline-none transition-colors ${
            errors.title
              ? 'border-destructive'
              : 'border-accent-warm focus:border-sienna'
          }`}
        />
        {errors.title && <p className="text-destructive text-xs mt-1.5">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-text mb-2 block">
          <AlignLeft size={12} className="inline mr-1.5 relative -top-px" />
          Description (optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Write about this memory..."
          rows={4}
          className="w-full p-3.5 rounded-lg border border-accent-warm bg-surface text-sm outline-none transition-colors focus:border-sienna resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-text mb-2 block">
          <Tags size={12} className="inline mr-1.5 relative -top-px" />
          Tags (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-warm/50 text-text flex items-center gap-1.5"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-muted-text hover:text-text"
              >
                ×
              </button>
            </span>
          ))}
          {showTagInput ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTag()
                  if (e.key === 'Escape') setShowTagInput(false)
                }}
                onBlur={() => {
                  if (newTag.trim()) addTag()
                  else setShowTagInput(false)
                }}
                placeholder="Tag..."
                className="px-2 py-1 text-xs border border-accent-warm rounded-full w-20 bg-transparent outline-none focus:border-sienna"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowTagInput(true)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-accent-warm text-muted-text hover:border-sienna hover:text-sienna transition-colors"
            >
              + add
            </button>
          )}
        </div>
      </div>

      {/* Preview of photos */}
      {formData.files.length > 0 && (
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-text mb-2 block">
            Photos
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {formData.files.map((file, idx) => (
              <img
                key={idx}
                src={file.preview}
                alt={`Photo ${idx + 1}`}
                className="w-16 h-16 object-cover rounded border border-accent-warm shrink-0"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
