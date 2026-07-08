import * as React from "react";
import { Button } from "couple-journal";

// Sienna Heirloom buttons — primary is the sienna "archival stamp" with
// uppercase tracked label, as used on the Spending page.
export const Variants = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <Button className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]">
      Add Expense
    </Button>
    <Button variant="outline" className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em] bg-paper">
      Sync Gmail
    </Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Remove</Button>
    <Button variant="link">View receipt</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <Button size="xs">Extra small</Button>
    <Button size="sm">Small</Button>
    <Button size="default">Default</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const States = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <Button disabled>Save Expense</Button>
    <Button variant="outline" disabled>
      Cancel
    </Button>
  </div>
);
