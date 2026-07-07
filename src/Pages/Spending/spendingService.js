import { db } from "../../db/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

const EXPENSES_COLLECTION = "expenses";
const CATEGORIES_COLLECTION = "spendingCategories";
const SETTINGS_DOC = "spendingSettings";

const DEFAULT_CATEGORIES = [
  { name: "Eating out", color: "#B48261" },
  { name: "Groceries", color: "#7A8B5E" },
  { name: "Transport", color: "#6B7FA3" },
  { name: "Date night", color: "#A35D5D" },
  { name: "Travel", color: "#4A7C59" },
  { name: "Gifts", color: "#C4944A" },
  { name: "Home", color: "#3D6B4F" },
];

export async function getCategories() {
  const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addCategory(name, color) {
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    name,
    color,
    createdAt: Timestamp.now(),
  });
  return { id: docRef.id, name, color, createdAt: Timestamp.now() };
}

export async function deleteCategory(categoryId) {
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
}

export async function getExpenses() {
  const snapshot = await getDocs(collection(db, EXPENSES_COLLECTION));
  const expenses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  expenses.sort((a, b) => {
    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
    return dateB - dateA;
  });
  return expenses;
}

export async function getExpenseById(id) {
  const docSnap = await getDoc(doc(db, EXPENSES_COLLECTION, id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

export async function addExpense(expense) {
  const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
    ...expense,
    currency: "SGD",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateExpense(id, data) {
  await updateDoc(doc(db, EXPENSES_COLLECTION, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteExpense(id) {
  await deleteDoc(doc(db, EXPENSES_COLLECTION, id));
}

export async function getSpendingSettings() {
  const docSnap = await getDoc(doc(db, SETTINGS_DOC, "config"));
  if (!docSnap.exists()) return null;
  return docSnap.data();
}

export async function updateSpendingSettings(data) {
  await setDoc(doc(db, SETTINGS_DOC, "config"), data, { merge: true });
}

export async function seedDataIfEmpty(currentUserUid, partnerUid) {
  const snapshot = await getDocs(collection(db, EXPENSES_COLLECTION));
  if (snapshot.docs.length > 0) return false;

  const catSnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
  let categories;
  if (catSnapshot.docs.length === 0) {
    categories = [];
    for (const cat of DEFAULT_CATEGORIES) {
      const ref = await addDoc(collection(db, CATEGORIES_COLLECTION), {
        ...cat,
        createdAt: Timestamp.now(),
      });
      categories.push({ id: ref.id, ...cat });
    }
  } else {
    categories = catSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  const findCat = (name) => categories.find((c) => c.name === name)?.id || categories[0].id;

  const now = new Date(2026, 6, 7);
  const makeDate = (day) => Timestamp.fromDate(new Date(2026, 6, day));

  const mockExpenses = [
    { merchant: "Ya Kun Kaya Toast", category: "Eating out", amount: 8.4, paidBy: currentUserUid, date: makeDate(7), source: "gmail", split: "none", description: "breakfast" },
    { merchant: "Grab · Tanjong Pagar → home", category: "Transport", amount: 17.2, paidBy: partnerUid, date: makeDate(7), source: "gmail", split: "none", description: "9:41 pm" },
    { merchant: "FairPrice Finest", category: "Groceries", amount: 86.35, paidBy: currentUserUid, date: makeDate(7), source: "gmail", split: "50/50", description: "weekly run" },
    { merchant: "GV Plaza · 2 tickets", category: "Date night", amount: 28.0, paidBy: partnerUid, date: makeDate(6), source: "gmail", split: "50/50", description: "movie night" },
    { merchant: "Blue Label Pizza", category: "Eating out", amount: 104.5, paidBy: currentUserUid, date: makeDate(6), source: "gmail", split: "50/50", description: "dinner" },
    { merchant: "IKEA Alexandra", category: "Home", amount: 63.8, paidBy: currentUserUid, date: makeDate(5), source: "manual", split: "none", description: "shelves" },
    { merchant: "BooksActually", category: "Gifts", amount: 34.0, paidBy: partnerUid, date: makeDate(5), source: "manual", split: "none", description: null },
    { merchant: "Grab · Orchard → home", category: "Transport", amount: 12.5, paidBy: partnerUid, date: makeDate(4), source: "gmail", split: "none", description: null },
    { merchant: "Atlas Coffeehouse", category: "Eating out", amount: 42.5, paidBy: currentUserUid, date: makeDate(4), source: "manual", split: "none", description: null },
    { merchant: "Cold Storage", category: "Groceries", amount: 67.2, paidBy: currentUserUid, date: makeDate(3), source: "gmail", split: "none", description: null },
    { merchant: "Grab · CBD → Tiong Bahru", category: "Transport", amount: 9.8, paidBy: currentUserUid, date: makeDate(3), source: "gmail", split: "none", description: null },
    { merchant: "Don Don Donki", category: "Groceries", amount: 45.3, paidBy: partnerUid, date: makeDate(2), source: "manual", split: "50/50", description: null },
    { merchant: "Netflix", category: "Date night", amount: 22.98, paidBy: currentUserUid, date: makeDate(1), source: "manual", split: "none", description: null },
  ];

  for (const exp of mockExpenses) {
    await addDoc(collection(db, EXPENSES_COLLECTION), {
      merchant: exp.merchant,
      amount: exp.amount,
      currency: "SGD",
      categoryId: findCat(exp.category),
      paidBy: exp.paidBy,
      split: exp.split,
      date: exp.date,
      source: exp.source,
      description: exp.description,
      gmailMeta: exp.source === "gmail" ? { subject: `Receipt from ${exp.merchant}`, receivedAt: exp.date } : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  await setDoc(doc(db, SETTINGS_DOC, "config"), {
    gmailAccounts: [
      { email: "jordan.tan@gmail.com", label: "Connected · syncs on demand", connectedAt: Timestamp.now() },
      { email: "mira.w@gmail.com", label: "Connected · Mira manages this one", connectedAt: Timestamp.now() },
    ],
    lastSyncedAt: Timestamp.now(),
  });

  return true;
}
