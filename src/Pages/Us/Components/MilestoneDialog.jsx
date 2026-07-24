import { useEffect, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/Components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog'
import { Button } from '@/Components/ui/button'
import { Calendar } from '@/Components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/popover'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/Components/ui/select'
import { addMilestone, updateMilestone, deleteMilestone } from '../../../db'
import { ICONS, REPEAT_OPTIONS, formatShortDate } from '../milestoneUtils'

const EMPTY_FORM = { title: '', icon: 'heart', date: null, repeats: 'yearly' }

export function MilestoneDialog({ open, onClose, milestone, onSaved }) {
  const isEdit = Boolean(milestone)
  const [form, setForm] = useState(EMPTY_FORM)
  const [step, setStep] = useState('form')
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    setStep('form')
    setErrors({})
    setConfirmDeleteOpen(false)
    if (milestone) {
      setForm({
        title: milestone.title,
        icon: milestone.icon ?? 'heart',
        date: milestone.date.toDate(),
        repeats: milestone.repeats ?? 'none',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, milestone])

  const updateForm = (updates) => {
    setForm((prev) => ({ ...prev, ...updates }))
    setErrors((prev) => {
      const next = { ...prev }
      Object.keys(updates).forEach((key) => delete next[key])
      return next
    })
  }

  const handleSave = async () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.date) newErrors.date = 'Date is required'
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    setIsSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        icon: form.icon,
        date: Timestamp.fromDate(form.date),
        repeats: form.repeats,
      }
      if (isEdit) {
        await updateMilestone({ id: milestone.id, ...payload })
      } else {
        await addMilestone(payload)
      }
      await onSaved()
      setStep('saved')
    } catch (error) {
      console.error('Failed to save milestone:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsSaving(true)
    try {
      await deleteMilestone(milestone.id)
      await onSaved()
      setConfirmDeleteOpen(false)
      onClose()
    } catch (error) {
      console.error('Failed to delete milestone:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bottom-0 top-auto left-0 max-w-full translate-x-0 translate-y-0 rounded-t-[18px] rounded-b-none bg-parchment p-5 pb-7 sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:p-6"
      >
        <div className="mx-auto h-1 w-9 rounded-full bg-foreground/15 sm:hidden" />

        {step === 'form' ? (
          <>
            {/* Mobile sheet header */}
            <div className="flex items-baseline justify-between sm:hidden">
              <button onClick={onClose} className="text-sm text-muted-text">
                Cancel
              </button>
              <span className="font-display text-lg font-medium">
                {isEdit ? 'Edit milestone' : 'New milestone'}
              </span>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="text-[11px] font-bold uppercase tracking-[0.1em] text-sienna disabled:opacity-50"
              >
                Save
              </button>
            </div>

            {/* Desktop dialog header */}
            <div className="hidden sm:block">
              <DialogTitle className="font-display text-xl">
                {isEdit ? 'Edit milestone' : 'Add a milestone'}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-xs leading-relaxed text-muted-text">
                A date worth counting down to — anniversaries, birthdays, whatever you want to remember.
              </DialogDescription>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2 block">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  placeholder="e.g. First trip together"
                  className={`w-full p-3 rounded-lg border bg-surface text-sm text-text outline-none transition-colors ${
                    errors.title ? 'border-destructive' : 'border-accent-warm focus:border-sienna'
                  }`}
                />
                {errors.title && <p className="text-destructive text-xs mt-1.5">{errors.title}</p>}
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2 block">
                  Icon
                </label>
                <div className="flex gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon.id}
                      title={icon.name}
                      onClick={() => updateForm({ icon: icon.id })}
                      className={`flex size-11 items-center justify-center rounded-sm border text-[17px] transition-colors ${
                        form.icon === icon.id
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-accent-warm bg-surface text-sienna-dark hover:border-sienna'
                      }`}
                    >
                      {icon.glyph}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2 block">
                    Date
                  </label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger
                      className={`flex w-full items-center gap-2.5 rounded-lg border bg-surface p-3 text-left transition-colors ${
                        errors.date ? 'border-destructive' : 'border-accent-warm hover:border-sienna/50'
                      }`}
                    >
                      <CalendarIcon size={15} className="shrink-0 text-sienna" />
                      <span className={`text-sm ${form.date ? 'text-text' : 'text-muted-text'}`}>
                        {form.date ? formatShortDate(form.date) : 'Pick a date'}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        startMonth={new Date(new Date().getFullYear() - 30, 0)}
                        endMonth={new Date(new Date().getFullYear() + 10, 11)}
                        selected={form.date}
                        defaultMonth={form.date ?? undefined}
                        onSelect={(date) => {
                          updateForm({ date })
                          setCalendarOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && <p className="text-destructive text-xs mt-1.5">{errors.date}</p>}
                </div>
                <div className="flex-1">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-muted-text mb-2 block">
                    Repeats
                  </label>
                  <Select
                    value={form.repeats}
                    onValueChange={(value) => updateForm({ repeats: value })}
                    items={REPEAT_OPTIONS}
                  >
                    <SelectTrigger className="h-[46px] w-full rounded-lg border-accent-warm bg-surface px-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {REPEAT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isEdit && (
                <button
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 self-start text-xs text-destructive/80 transition-colors hover:text-destructive disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  Delete this milestone
                </button>
              )}
            </div>

            {/* Desktop footer */}
            <div className="hidden justify-end gap-2 sm:flex">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-sm bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.13em] hover:bg-foreground/90"
              >
                {isSaving ? 'Saving…' : 'Save milestone'}
              </Button>
            </div>
          </>
        ) : (
          <div className="px-1 py-4 text-center">
            <div className="mx-auto mb-4 flex size-13 items-center justify-center rounded-full bg-sienna font-display text-2xl text-white">
              ✓
            </div>
            <div className="font-display text-xl font-medium">
              {isEdit ? 'Milestone updated.' : 'Milestone added.'}
            </div>
            <p className="mx-auto mt-2 max-w-[280px] text-xs leading-relaxed text-muted-text">
              “{form.title.trim()}” will show up on the Us tab, counting down from today.
            </p>
            <Button
              onClick={onClose}
              className="mt-5 rounded-sm bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.13em] hover:bg-foreground/90"
            >
              Back to Us
            </Button>
          </div>
        )}

        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogContent className="bg-parchment p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-lg">
                Delete this milestone?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs leading-relaxed text-muted-text">
                “{milestone?.title}” will be removed for both of you. This can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteOpen(false)}
                disabled={isSaving}
                className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]"
              >
                Keep it
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSaving}
                className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]"
              >
                {isSaving ? 'Deleting…' : 'Delete'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  )
}
