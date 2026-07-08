import * as React from "react";
import { Label, Input } from "couple-journal";

export const FieldLabel = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 320 }}>
    <Label htmlFor="amount">Amount</Label>
    <Input id="amount" placeholder="0.00" />
  </div>
);

export const MetadataStyle = () => (
  <Label className="text-[11px] uppercase tracking-wider text-muted-text font-medium">
    Paid By
  </Label>
);
