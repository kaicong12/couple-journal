import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../AuthContext";
import Fuse from "fuse.js";
import {
  getCategories,
  getExpenses,
  addExpense as addExpenseService,
  deleteExpense as deleteExpenseService,
  addCategory as addCategoryService,
  deleteCategory as deleteCategoryService,
  seedDataIfEmpty,
  getSpendingSettings,
} from "./spendingService";
import { MOCK_CATEGORIES, MOCK_SETTINGS, getMockExpensesForUser } from "./mockData";

const PARTNER_UID = "partner-mock-uid";
const MOCK_USER_UID = "mock-user-uid";

export function useSpending() {
  const { user } = useAuth();
  const currentUid = user?.uid || MOCK_USER_UID;
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const partnerUid = PARTNER_UID;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (user) {
        await seedDataIfEmpty(currentUid, partnerUid);
        const [expData, catData, settingsData] = await Promise.all([
          getExpenses(),
          getCategories(),
          getSpendingSettings(),
        ]);
        if (catData.length > 0) {
          setExpenses(expData);
          setCategories(catData);
          setSettings(settingsData);
        } else {
          setExpenses(getMockExpensesForUser(currentUid, partnerUid));
          setCategories(MOCK_CATEGORIES);
          setSettings(MOCK_SETTINGS);
        }
      } else {
        setExpenses(getMockExpensesForUser(currentUid, partnerUid));
        setCategories(MOCK_CATEGORIES);
        setSettings(MOCK_SETTINGS);
      }
    } catch (e) {
      setExpenses(getMockExpensesForUser(currentUid, partnerUid));
      setCategories(MOCK_CATEGORIES);
      setSettings(MOCK_SETTINGS);
    }
    setLoading(false);
  }, [user, currentUid, partnerUid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const monthExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const d = exp.date?.toDate ? exp.date.toDate() : new Date(exp.date);
      return d.getFullYear() === selectedMonth.year && d.getMonth() === selectedMonth.month;
    });
  }, [expenses, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    let result = monthExpenses;

    if (filter === "you") {
      result = result.filter((e) => e.paidBy === currentUid);
    } else if (filter === "mira") {
      result = result.filter((e) => e.paidBy !== currentUid);
    } else if (filter === "gmail") {
      result = result.filter((e) => e.source === "gmail");
    } else if (filter === "manual") {
      result = result.filter((e) => e.source === "manual");
    }

    if (searchQuery.trim()) {
      const fuse = new Fuse(result, {
        keys: ["merchant", "description"],
        threshold: 0.4,
      });
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    return result;
  }, [monthExpenses, filter, searchQuery, currentUid]);

  const groupedExpenses = useMemo(() => {
    const groups = {};
    for (const exp of filteredExpenses) {
      const d = exp.date?.toDate ? exp.date.toDate() : new Date(exp.date);
      const key = d.toISOString().split("T")[0];
      if (!groups[key]) groups[key] = [];
      groups[key].push(exp);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredExpenses]);

  const summary = useMemo(() => {
    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const prevM = selectedMonth.month === 0 ? 11 : selectedMonth.month - 1;
    const prevY = selectedMonth.month === 0 ? selectedMonth.year - 1 : selectedMonth.year;
    const prevTotal = expenses.reduce((sum, e) => {
      const d = e.date?.toDate ? e.date.toDate() : new Date(e.date);
      return d.getFullYear() === prevY && d.getMonth() === prevM ? sum + e.amount : sum;
    }, 0);
    const pctChange = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : null;
    const prevMonthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][prevM];
    const youPaid = monthExpenses
      .filter((e) => e.paidBy === currentUid)
      .reduce((sum, e) => sum + e.amount, 0);
    const miraPaid = total - youPaid;
    const count = monthExpenses.length;

    const byCategory = {};
    for (const exp of monthExpenses) {
      const cat = categories.find((c) => c.id === exp.categoryId);
      const name = cat?.name || "Other";
      const color = cat?.color || "#8E867E";
      if (!byCategory[name]) byCategory[name] = { amount: 0, color };
      byCategory[name].amount += exp.amount;
    }
    const categoryBreakdown = Object.entries(byCategory)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);

    return { total, youPaid, miraPaid, count, categoryBreakdown, pctChange, prevMonthName };
  }, [monthExpenses, expenses, selectedMonth, categories, currentUid]);

  const addExpense = useCallback(
    async (data) => {
      await addExpenseService(data);
      await loadData();
    },
    [loadData]
  );

  const removeExpense = useCallback(
    async (id) => {
      await deleteExpenseService(id);
      await loadData();
    },
    [loadData]
  );

  const addCategory = useCallback(
    async (name, color) => {
      const newCat = await addCategoryService(name, color);
      setCategories((prev) => [...prev, newCat]);
      return newCat;
    },
    []
  );

  const removeCategory = useCallback(
    async (id) => {
      await deleteCategoryService(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    },
    []
  );

  const prevMonth = useCallback(() => {
    setSelectedMonth((prev) => {
      const m = prev.month - 1;
      if (m < 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: m };
    });
  }, []);

  const nextMonth = useCallback(() => {
    setSelectedMonth((prev) => {
      const m = prev.month + 1;
      if (m > 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: m };
    });
  }, []);

  const getCategoryById = useCallback(
    (id) => categories.find((c) => c.id === id),
    [categories]
  );

  return {
    expenses: filteredExpenses,
    groupedExpenses,
    categories,
    settings,
    loading,
    selectedMonth,
    filter,
    searchQuery,
    summary,
    partnerUid,
    setFilter,
    setSearchQuery,
    prevMonth,
    nextMonth,
    addExpense,
    removeExpense,
    addCategory,
    removeCategory,
    getCategoryById,
    loadData,
  };
}
