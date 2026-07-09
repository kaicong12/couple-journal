import * as React from "react";
import { SummaryCards } from "couple-journal";

const summary = {
  total: 1486.2,
  youPaid: 862,
  miraPaid: 624.2,
  count: 23,
  pctChange: -12,
  prevMonthName: "June",
  categoryBreakdown: [
    { name: "Eating out", amount: 486, color: "#C0764A" },
    { name: "Groceries", amount: 342, color: "#8F9A6E" },
    { name: "Transport", amount: 218, color: "#708BA4" },
    { name: "Date night", amount: 186, color: "#B07A6B" },
  ],
};

// Monthly spending summary band: total with month-over-month delta,
// who-paid split bar, and top category bars.
export const MonthlySummary = () => (
  <div style={{ maxWidth: 960, background: "#F7F5F0", padding: 16 }}>
    <SummaryCards summary={summary} />
  </div>
);

export const FirstMonth = () => (
  <div style={{ maxWidth: 960, background: "#F7F5F0", padding: 16 }}>
    <SummaryCards
      summary={{
        total: 212.85,
        youPaid: 148.5,
        miraPaid: 64.35,
        count: 4,
        pctChange: null,
        prevMonthName: "June",
        categoryBreakdown: [
          { name: "Groceries", amount: 132.55, color: "#8F9A6E" },
          { name: "Eating out", amount: 80.3, color: "#C0764A" },
        ],
      }}
    />
  </div>
);
