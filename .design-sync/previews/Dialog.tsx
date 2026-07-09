import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
} from "couple-journal";

// Modal dialog in the app's "Add an expense" style — serif title,
// parchment footer band, uppercase tracked action buttons.
export const AddExpense = () => (
  <Dialog open>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-display">Add an expense</DialogTitle>
        <DialogDescription>Log something you or Mira paid for.</DialogDescription>
      </DialogHeader>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-muted-text font-medium mb-1 block">
            Merchant / Description
          </Label>
          <Input placeholder="e.g. Atlas Coffeehouse" className="h-11" />
        </div>
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-muted-text font-medium mb-1 block">
            Amount
          </Label>
          <Input placeholder="0.00" className="h-11" />
        </div>
      </div>
      <DialogFooter className="flex-row justify-end gap-2">
        <Button variant="outline" className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]">
          Cancel
        </Button>
        <Button className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em] bg-text text-paper hover:bg-text/90">
          Save Expense
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
