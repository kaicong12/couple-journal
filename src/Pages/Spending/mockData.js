export const MOCK_USER_UID = "mock-user-uid";
export const PARTNER_UID = "partner-mock-uid";

const makeDate = (day) => {
  const d = new Date(2026, 6, day, 12, 0, 0);
  return { toDate: () => d, seconds: d.getTime() / 1000 };
};

export function getMockExpensesForUser(currentUid, partnerUid) {
  return MOCK_EXPENSES.map(exp => ({
    ...exp,
    paidBy: exp.paidBy === MOCK_USER_UID ? currentUid : partnerUid,
  }));
}

export const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Eating out", color: "#B48261" },
  { id: "cat-2", name: "Groceries", color: "#7A8B5E" },
  { id: "cat-3", name: "Transport", color: "#6B7FA3" },
  { id: "cat-4", name: "Date night", color: "#A35D5D" },
  { id: "cat-5", name: "Travel", color: "#4A7C59" },
  { id: "cat-6", name: "Gifts", color: "#C4944A" },
  { id: "cat-7", name: "Home", color: "#3D6B4F" },
];

export const MOCK_EXPENSES = [
  { id: "exp-1", merchant: "Ya Kun Kaya Toast", amount: 8.4, currency: "SGD", categoryId: "cat-1", paidBy: MOCK_USER_UID, split: "none", date: makeDate(7), source: "gmail", description: "breakfast", gmailMeta: { subject: "Receipt from Ya Kun Kaya Toast", receivedAt: makeDate(7) }, createdAt: makeDate(7), updatedAt: makeDate(7) },
  { id: "exp-2", merchant: "Grab · Tanjong Pagar → home", amount: 17.2, currency: "SGD", categoryId: "cat-3", paidBy: PARTNER_UID, split: "none", date: makeDate(7), source: "gmail", description: "9:41 pm", gmailMeta: { subject: "Your Grab ride receipt", receivedAt: makeDate(7) }, createdAt: makeDate(7), updatedAt: makeDate(7) },
  { id: "exp-3", merchant: "FairPrice Finest", amount: 86.35, currency: "SGD", categoryId: "cat-2", paidBy: MOCK_USER_UID, split: "50/50", date: makeDate(7), source: "gmail", description: "weekly run", gmailMeta: { subject: "Your FairPrice e-receipt", receivedAt: makeDate(7) }, createdAt: makeDate(7), updatedAt: makeDate(7) },
  { id: "exp-4", merchant: "GV Plaza · 2 tickets", amount: 28.0, currency: "SGD", categoryId: "cat-4", paidBy: PARTNER_UID, split: "50/50", date: makeDate(6), source: "gmail", description: "movie night", gmailMeta: { subject: "GV Cinema booking confirmation", receivedAt: makeDate(6) }, createdAt: makeDate(6), updatedAt: makeDate(6) },
  { id: "exp-5", merchant: "Blue Label Pizza", amount: 104.5, currency: "SGD", categoryId: "cat-1", paidBy: MOCK_USER_UID, split: "50/50", date: makeDate(6), source: "gmail", description: "dinner", gmailMeta: { subject: "Receipt from Blue Label Pizza", receivedAt: makeDate(6) }, createdAt: makeDate(6), updatedAt: makeDate(6) },
  { id: "exp-6", merchant: "IKEA Alexandra", amount: 63.8, currency: "SGD", categoryId: "cat-7", paidBy: MOCK_USER_UID, split: "none", date: makeDate(5), source: "manual", description: "shelves", gmailMeta: null, createdAt: makeDate(5), updatedAt: makeDate(5) },
  { id: "exp-7", merchant: "BooksActually", amount: 34.0, currency: "SGD", categoryId: "cat-6", paidBy: PARTNER_UID, split: "none", date: makeDate(5), source: "manual", description: null, gmailMeta: null, createdAt: makeDate(5), updatedAt: makeDate(5) },
  { id: "exp-8", merchant: "Grab · Orchard → home", amount: 12.5, currency: "SGD", categoryId: "cat-3", paidBy: PARTNER_UID, split: "none", date: makeDate(4), source: "gmail", description: null, gmailMeta: { subject: "Your Grab ride receipt", receivedAt: makeDate(4) }, createdAt: makeDate(4), updatedAt: makeDate(4) },
  { id: "exp-9", merchant: "Atlas Coffeehouse", amount: 42.5, currency: "SGD", categoryId: "cat-1", paidBy: MOCK_USER_UID, split: "none", date: makeDate(4), source: "manual", description: null, gmailMeta: null, createdAt: makeDate(4), updatedAt: makeDate(4) },
  { id: "exp-10", merchant: "Cold Storage", amount: 67.2, currency: "SGD", categoryId: "cat-2", paidBy: MOCK_USER_UID, split: "none", date: makeDate(3), source: "gmail", description: null, gmailMeta: { subject: "Cold Storage e-receipt", receivedAt: makeDate(3) }, createdAt: makeDate(3), updatedAt: makeDate(3) },
  { id: "exp-11", merchant: "Grab · CBD → Tiong Bahru", amount: 9.8, currency: "SGD", categoryId: "cat-3", paidBy: MOCK_USER_UID, split: "none", date: makeDate(3), source: "gmail", description: null, gmailMeta: { subject: "Your Grab ride receipt", receivedAt: makeDate(3) }, createdAt: makeDate(3), updatedAt: makeDate(3) },
  { id: "exp-12", merchant: "Don Don Donki", amount: 45.3, currency: "SGD", categoryId: "cat-2", paidBy: PARTNER_UID, split: "50/50", date: makeDate(2), source: "manual", description: null, gmailMeta: null, createdAt: makeDate(2), updatedAt: makeDate(2) },
  { id: "exp-13", merchant: "Netflix", amount: 22.98, currency: "SGD", categoryId: "cat-4", paidBy: MOCK_USER_UID, split: "none", date: makeDate(1), source: "manual", description: null, gmailMeta: null, createdAt: makeDate(1), updatedAt: makeDate(1) },
];

export const MOCK_SETTINGS = {
  gmailAccounts: [
    { email: "jordan.tan@gmail.com", label: "Connected · syncs on demand", connectedAt: makeDate(1) },
    { email: "mira.w@gmail.com", label: "Connected · Mira manages this one", connectedAt: makeDate(1) },
  ],
  lastSyncedAt: makeDate(7),
};
