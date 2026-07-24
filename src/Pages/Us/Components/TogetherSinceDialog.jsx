import { useEffect, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { Calendar } from '@/Components/ui/calendar'
import { saveCoupleProfile } from '../../../db'

export function TogetherSinceDialog({ open, onClose, togetherSince, onSaved }) {
  const [date, setDate] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) setDate(togetherSince ?? null)
  }, [open, togetherSince])

  const handleSave = async () => {
    if (!date) return
    setIsSaving(true)
    try {
      await saveCoupleProfile({ togetherSince: Timestamp.fromDate(date) })
      await onSaved()
      onClose()
    } catch (error) {
      console.error('Failed to save together-since date:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent showCloseButton={false} className="w-fit bg-parchment p-6">
        <DialogTitle className="font-display text-xl">Together since</DialogTitle>
        <DialogDescription className="text-xs text-muted-text">
          The day it all began — the counter starts here.
        </DialogDescription>
        <div className="rounded-lg border border-accent-warm bg-surface">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={date}
            defaultMonth={date ?? togetherSince ?? undefined}
            disabled={{ after: new Date() }}
            onSelect={setDate}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !date}
            className="rounded-sm bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.13em] hover:bg-foreground/90"
          >
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
