import { useState } from 'react'
import { Type, AlignLeft, Sparkles } from 'lucide-react'
import { generateCaption } from '../../utils/generateCaption'

export function StepStory({ formData, updateFormData, errors }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState(null)

  const handleGenerate = async () => {
    if (!formData.files.length) return
    setIsGenerating(true)
    setGenerateError(null)
    try {
      const result = await generateCaption(formData.files)
      updateFormData({
        title: result.title || formData.title,
        description: result.description || formData.description,
      })
    } catch (err) {
      console.error('AI generation failed:', err)
      setGenerateError('Could not generate caption. Please try again or write your own.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Generate with AI */}
      {formData.files.length > 0 && (
        <div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-sienna/50 text-sienna text-sm font-medium hover:bg-sienna/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} className={isGenerating ? 'animate-pulse' : ''} />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
          {generateError && (
            <p className="text-destructive text-xs mt-1.5 text-center">{generateError}</p>
          )}
        </div>
      )}

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
