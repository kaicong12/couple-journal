# Spending Feature Design

## Overview

A shared expense ledger for two partners, displayed in SGD. Expenses can be added manually or appear via Gmail sync (mock for now). Each expense tracks who paid and an optional 50/50 split. The feature includes a monthly dashboard, add/detail views, and a settings page for categories and Gmail accounts.

## Routes

- `/spending` — main dashboard
- `/spending/settings` — category management + Gmail account display
- `/spending/:id` — expense detail view

Add "Spending" tab to the existing bottom navigation bar.

## Data Model (Firestore)

### `expenses` collection

```
{
  id: string (auto),
  amount: number,
  currency: "SGD",
  merchant: string,
  description: string | null,
  categoryId: string (ref to spendingCategories doc),
  paidBy: string (Firebase Auth uid),
  split: "none" | "50/50",
  date: Timestamp,
  source: "manual" | "gmail",
  gmailMeta: { subject: string, receivedAt: Timestamp } | null,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `spendingCategories` collection

```
{
  id: string (auto),
  name: string,
  color: string (hex),
  createdAt: Timestamp
}
```

### `spendingSettings` document (single doc, id: "config")

```
{
  gmailAccounts: [
    { email: string, label: string, connectedAt: Timestamp }
  ],
  lastSyncedAt: Timestamp | null
}
```

## Pages & Components

### 1. Spending Dashboard (`/spending`)

**Header area:**
- Page title "Spending" in serif font (Newsreader)
- Month navigator: `< July 2026 >` arrows to change month
- "Last synced X min ago" text
- "Sync Gmail" button (triggers mock sync toast)
- "+ Add Expense" primary button (opens AddExpenseDialog)

**Summary cards row (3 cards):**
- **This Month So Far:** Total S$ amount, % change vs previous month, expense count
- **Who Paid:** Horizontal stacked bar (sienna for You, brown for Mira), amounts labeled
- **By Category:** Horizontal bar chart with category colors and amounts, top 4 categories

**Filter chips:**
- ALL | YOU | MIRA | FROM GMAIL | MANUAL
- Search input: "Search merchant, category..."

**Expense list:**
- Grouped by date (e.g., "TODAY · MON JUL 7", "SUN JUL 6")
- Each row: colored dot (category), merchant name, category + description, badges (GMAIL, SPLIT 50/50), paid-by avatar, amount, X button to remove
- Left border accent color per category

### 2. Add Expense Dialog

Modal dialog with fields:
- **Amount:** S$ prefix, numeric input (autofocused)
- **Date:** Date picker, defaults to today, shows "Mon, Jul 7 · today"
- **Merchant/Description:** Text input
- **Category:** Searchable dropdown with fuzzy matching (Fuse.js), colored dots, "Create [typed text] as a new category" option at bottom
- **Paid By:** Toggle between You / Mira (avatar buttons)
- **Split:** Toggle: NOT SPLIT | 50/50
- **Actions:** Cancel, Save Expense

### 3. Expense Detail (`/spending/:id`)

Full page view:
- Source badge if from Gmail (e.g., "FROM GMAIL · FAIRPRICE RECEIPT")
- Large amount display
- Merchant + location
- When: date and time
- Category: with "CHANGE" action
- Paid by: avatar + name
- Split: type + calculated share amount, "EDIT" action
- Source: email subject + date, "VIEW" action (no-op for now)
- "Remove This Expense" button (deletes from Firestore)

### 4. Spending Settings (`/spending/settings`)

**Header:** "Spending settings" title + "Back to Spending" button

**Two-column layout:**

Left column — Gmail receipts:
- Explanation text about how sync works
- List of connected Gmail accounts (mock data: 2 accounts)
- Each shows email, status ("Connected · syncs on demand"), Unlink button (no-op)
- Info box explaining the filter logic

Right column — Categories:
- Explanation text
- List of categories with color dot, name, usage count ("9 this month"), X to delete
- "New category..." input + ADD button at bottom

### 5. Sync Toast

Floating notification (bottom-right on desktop, bottom-center on mobile):
- Icon + "3 new expenses from Gmail"
- Subtitle: "Claude read 41 emails · 3 were receipts"
- List of extracted expenses (merchant + amount)
- Two buttons: REVIEW (navigates to filtered view) | LOOKS RIGHT (dismisses, keeps expenses)

## Mock Data

Seed the following expenses on first load (check if collection is empty):

| Merchant | Category | Amount | Paid By | Date | Source | Split |
|----------|----------|--------|---------|------|--------|-------|
| Ya Kun Kaya Toast | Eating out | 8.40 | You | Jul 7 | gmail | none |
| Grab · Tanjong Pagar → home | Transport | 17.20 | Mira | Jul 7 | gmail | none |
| FairPrice Finest | Groceries | 86.35 | You | Jul 7 | gmail | 50/50 |
| GV Plaza · 2 tickets | Date night | 28.00 | Mira | Jul 6 | gmail | 50/50 |
| Blue Label Pizza | Eating out | 104.50 | You | Jul 6 | gmail | 50/50 |
| IKEA Alexandra | Home | 63.80 | You | Jul 5 | manual | none |
| BooksActually | Gifts | 34.00 | Mira | Jul 5 | manual | none |
| Grab · Orchard → home | Transport | 12.50 | Mira | Jul 4 | gmail | none |
| Atlas Coffeehouse | Eating out | 42.50 | You | Jul 4 | manual | none |
| Cold Storage | Groceries | 67.20 | You | Jul 3 | gmail | none |
| Grab · CBD → Tiong Bahru | Transport | 9.80 | You | Jul 3 | gmail | none |
| Don Don Donki | Groceries | 45.30 | Mira | Jul 2 | manual | 50/50 |
| Netflix | Date night | 22.98 | You | Jul 1 | manual | none |

Default categories:
- Eating out (sienna/warm brown)
- Groceries (olive green)
- Transport (slate blue)
- Date night (muted red)
- Travel (forest green)
- Gifts (amber)
- Home (dark green)

Mock Gmail accounts:
- jordan.tan@gmail.com — "Connected · syncs on demand"
- mira.w@gmail.com — "Connected · Mira manages this one"

## UI Stack & Styling

- All new components: shadcn/ui + Tailwind CSS
- Follow Sienna Heirloom design system from CLAUDE.md
- Newsreader for headlines, DM Sans / system sans for body
- Earthy palette: sienna (#B48261), parchment (#F7F5F0), warm grays
- Soft shadows, no hard borders, generous padding
- Responsive: cards stack vertically on mobile, list simplifies

## Interactions

- Month arrows filter expenses by selected month
- Filter chips are mutually exclusive (radio behavior)
- Search filters list in real-time (fuzzy match on merchant + category name)
- Category picker in Add dialog uses Fuse.js for fuzzy search
- Sync Gmail button: shows toast after 1.5s delay with mock data
- Toast auto-dismisses after 8s or on user action
- Remove expense: confirmation not needed (matches X button UX in design)

## Out of Scope

- Real Gmail API integration (mock only)
- Custom split percentages (only "none" and "50/50")
- Multi-currency support
- Export/import
- Recurring expenses
- Budget limits or alerts
