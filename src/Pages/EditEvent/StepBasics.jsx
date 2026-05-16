import { useState } from 'react'
import { Tag } from 'lucide-react'

export function StepBasics({ formData, updateFormData, errors, defaultCategories }) {
  const [newCategory, setNewCategory] = useState('')
  const [showCategoryInput, setShowCategoryInput] = useState(false)

  const allCategories = [...new Set([...defaultCategories, ...formData.categories])]

  const toggleCategory = (cat) => {
    const current = formData.categories
    if (current.includes(cat)) {
      updateFormData({ categories: current.filter((c) => c !== cat) })
    } else {
      updateFormData({ categories: [...current, cat] })
    }
  }

  const addCategory = () => {
    const trimmed = newCategory.trim()
    if (trimmed && !formData.categories.includes(trimmed)) {
      updateFormData({ categories: [...formData.categories, trimmed] })
    }
    setNewCategory('')
    setShowCategoryInput(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2 block">
          Title
        </label>
        <input
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="Give this event a name…"
          className={`w-full p-3.5 rounded-lg border bg-surface text-text outline-none transition-colors ${
            errors.title
              ? 'border-destructive'
              : 'border-accent-warm focus:border-sienna'
          }`}
        />
        {errors.title && <p className="text-destructive text-xs mt-1.5">{errors.title}</p>}
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2 block">
          <Tag size={11} className="inline mr-1.5 relative -top-px" />
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => {
            const active = formData.categories.includes(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors ${
                  active
                    ? 'bg-foreground text-background'
                    : 'bg-surface border border-accent-warm text-text hover:border-sienna'
                }`}
              >
                {cat}
              </button>
            )
          })}
          {showCategoryInput ? (
            <input
              autoFocus
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCategory()
                if (e.key === 'Escape') setShowCategoryInput(false)
              }}
              onBlur={() => (newCategory.trim() ? addCategory() : setShowCategoryInput(false))}
              placeholder="Type…"
              className="px-3 py-2 text-xs border border-sienna rounded-md w-24 bg-surface outline-none"
            />
          ) : (
            <button
              onClick={() => setShowCategoryInput(true)}
              className="px-3.5 py-2 rounded-md text-xs font-medium border border-dashed border-accent-warm text-muted-text hover:border-sienna hover:text-sienna transition-colors"
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
