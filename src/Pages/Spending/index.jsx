import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Plus, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { useSpending } from "./useSpending";
import SummaryCards from "./Components/SummaryCards";
import FilterChips from "./Components/FilterChips";
import ExpenseList from "./Components/ExpenseList";
import AddExpenseDialog from "./Components/AddExpenseDialog";
import SyncToast from "./Components/SyncToast";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function Spending() {
  const navigate = useNavigate();
  const {
    groupedExpenses,
    categories,
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
  } = useSpending();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSyncToast, setShowSyncToast] = useState(false);

  const handleSync = useCallback(() => {
    setShowSyncToast(false);
    setTimeout(() => setShowSyncToast(true), 1500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-text">Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div className="flex items-baseline gap-4">
          <h1 className="text-3xl font-display font-medium tracking-tight">Spending</h1>
          <div className="flex items-center gap-2 text-ink-soft">
            <button onClick={prevMonth} className="p-1 hover:text-text transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="font-display text-[17px] text-text min-w-[100px] text-center">
              {MONTHS[selectedMonth.month]} {selectedMonth.year}
            </span>
            <button onClick={nextMonth} className="p-1 hover:text-text transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] text-muted-text hidden sm:block">
            <span className="text-sage font-bold">✓</span> last synced 2 min ago
          </span>
          <Button
            variant="outline"
            size="lg"
            onClick={handleSync}
            className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em] bg-paper"
          >
            <RefreshCw size={14} className="mr-1.5" />
            Sync Gmail
          </Button>
          <Button
            size="lg"
            onClick={() => setShowAddDialog(true)}
            className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]"
          >
            <Plus size={14} className="mr-1.5" />
            Add Expense
          </Button>
          <button
            onClick={() => navigate("/spending/settings")}
            className="p-2 text-muted-text hover:text-text transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <SummaryCards summary={summary} />

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <FilterChips filter={filter} onFilterChange={setFilter} />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search merchant, category..."
          className="w-full sm:w-64 h-9"
        />
      </div>

      {/* Expense List */}
      <ExpenseList
        groupedExpenses={groupedExpenses}
        categories={categories}
        onRemove={removeExpense}
      />

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        categories={categories}
        onSave={addExpense}
        onAddCategory={addCategory}
        partnerUid={partnerUid}
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setShowAddDialog(true)}
        className="sm:hidden fixed right-5 bottom-6 z-40 w-[52px] h-[52px] rounded-full bg-sienna text-white font-display text-[28px] leading-none shadow-[0_10px_24px_-6px_rgba(150,101,72,0.55)] flex items-center justify-center pb-1"
        aria-label="Add expense"
      >
        +
      </button>

      {/* Sync Toast */}
      <SyncToast
        show={showSyncToast}
        onDismiss={() => setShowSyncToast(false)}
        onFilterGmail={() => setFilter("gmail")}
      />
    </div>
  );
}
