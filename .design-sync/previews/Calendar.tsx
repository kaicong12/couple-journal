import * as React from "react";
import { Calendar } from "couple-journal";

// Date picker used inside the Add Expense dialog's date popover.
export const SingleDate = () => (
  <div style={{ background: "#FBFAF6", display: "inline-block", borderRadius: 4 }}>
    <Calendar mode="single" selected={new Date(2026, 6, 8)} defaultMonth={new Date(2026, 6, 1)} />
  </div>
);

export const NoSelection = () => (
  <div style={{ background: "#FBFAF6", display: "inline-block", borderRadius: 4 }}>
    <Calendar mode="single" defaultMonth={new Date(2026, 6, 1)} />
  </div>
);
