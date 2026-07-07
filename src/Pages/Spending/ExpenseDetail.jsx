import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { getExpenseById, deleteExpense, getCategories } from "./spendingService";
import { MOCK_EXPENSES, MOCK_CATEGORIES } from "./mockData";

export default function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUid = user?.uid || "mock-user-uid";
  const [expense, setExpense] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [exp, cats] = await Promise.all([getExpenseById(id), getCategories()]);
        if (exp && cats.length > 0) {
          setExpense(exp);
          setCategory(cats.find((c) => c.id === exp.categoryId) || null);
        } else {
          const mockExp = MOCK_EXPENSES.find((e) => e.id === id) || null;
          setExpense(mockExp);
          if (mockExp) {
            setCategory(MOCK_CATEGORIES.find((c) => c.id === mockExp.categoryId) || null);
          }
        }
      } catch (e) {
        const mockExp = MOCK_EXPENSES.find((e) => e.id === id) || null;
        setExpense(mockExp);
        if (mockExp) {
          setCategory(MOCK_CATEGORIES.find((c) => c.id === mockExp.categoryId) || null);
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-text">Loading...</p>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-text">Expense not found.</p>
        <Button variant="outline" onClick={() => navigate("/spending")}>
          Back to Spending
        </Button>
      </div>
    );
  }

  const expDate = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date);
  const isYou = expense.paidBy === currentUid;
  const splitAmount = expense.split === "50/50" ? (expense.amount / 2).toFixed(2) : null;

  const formatDate = (d) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const hours = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const h = hours % 12 || 12;
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} · ${h}:${mins} ${ampm}`;
  };

  const handleRemove = async () => {
    await deleteExpense(id);
    navigate("/spending");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/spending")}
        className="flex items-center gap-1 text-sm text-muted-text hover:text-text transition-colors mb-6"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <div className="bg-white rounded-xl p-6 shadow-[var(--shadow-soft)]">
        {/* Header */}
        <p className="text-[10px] uppercase tracking-wider text-center text-muted-text font-medium mb-4">
          Expense
        </p>

        {/* Source badge */}
        {expense.source === "gmail" && (
          <p className="text-center text-xs text-[#2E7D32] font-medium uppercase tracking-wide mb-2">
            ✦ From Gmail · {expense.merchant} Receipt
          </p>
        )}

        {/* Amount */}
        <p className="text-center text-4xl font-display font-medium mb-1">
          <span className="text-lg text-muted-text">S$</span>
          {expense.amount.toFixed(2)}
        </p>
        <p className="text-center text-sm text-muted-text mb-6">{expense.merchant}</p>

        {/* Details */}
        <div className="space-y-4 border-t border-accent-warm pt-5">
          {/* When */}
          <div className="flex items-start gap-3">
            <span className="text-muted-text text-xs uppercase tracking-wider w-20 pt-0.5 shrink-0">When</span>
            <span className="text-sm">{formatDate(expDate)}</span>
          </div>

          {/* Category */}
          <div className="flex items-start gap-3">
            <span className="text-muted-text text-xs uppercase tracking-wider w-20 pt-0.5 shrink-0">Category</span>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: category?.color || "#8E867E" }}
              />
              <span className="text-sm">{category?.name || "Other"}</span>
            </div>
          </div>

          {/* Paid by */}
          <div className="flex items-start gap-3">
            <span className="text-muted-text text-xs uppercase tracking-wider w-20 pt-0.5 shrink-0">Paid by</span>
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-medium ${
                  isYou ? "bg-sienna" : "bg-[#6B5344]"
                }`}
              >
                {isYou ? "Y" : "M"}
              </span>
              <span className="text-sm">{isYou ? "You" : "Mira"}</span>
            </div>
          </div>

          {/* Split */}
          <div className="flex items-start gap-3">
            <span className="text-muted-text text-xs uppercase tracking-wider w-20 pt-0.5 shrink-0">Split</span>
            <span className="text-sm">
              {expense.split === "50/50"
                ? `50 / 50 · ${isYou ? "Mira" : "Your"}'s share S$${splitAmount}`
                : "Not split"}
            </span>
          </div>

          {/* Source */}
          {expense.gmailMeta && (
            <div className="flex items-start gap-3">
              <span className="text-muted-text text-xs uppercase tracking-wider w-20 pt-0.5 shrink-0">Source</span>
              <span className="text-sm">"{expense.gmailMeta.subject}"</span>
            </div>
          )}
        </div>

        {/* Remove button */}
        <div className="mt-8 pt-5 border-t border-accent-warm">
          <button
            onClick={handleRemove}
            className="w-full py-3 rounded-lg border border-destructive/30 text-destructive text-sm font-medium uppercase tracking-wide hover:bg-destructive/5 transition-colors"
          >
            Remove This Expense
          </button>
          <p className="text-center text-xs text-muted-text mt-2">
            Removing tells the sync to skip this receipt next time.
          </p>
        </div>
      </div>
    </div>
  );
}
