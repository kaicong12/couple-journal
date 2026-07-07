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
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-display font-medium">Spending</h1>
            <div className="flex items-center gap-1 text-muted-text">
              <button onClick={prevMonth} className="p-1 hover:text-text transition-colors">
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium min-w-[110px] text-center">
                {MONTHS[selectedMonth.month]} {selectedMonth.year}
              </span>
              <button onClick={nextMonth} className="p-1 hover:text-text transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <button
            onClick={() => navigate("/spending/settings")}
            className="p-2 text-muted-text hover:text-text transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-muted-text hidden sm:block">✓ last synced 2 min ago</span>
          <Button variant="outline" size="lg" onClick={handleSync}>
            <RefreshCw size={16} className="mr-1.5" />
            Sync Gmail
          </Button>
          <Button size="lg" onClick={() => setShowAddDialog(true)}>
            <Plus size={16} className="mr-1.5" />
            Add Expense
          </Button>
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

      {/* Sync Toast */}
      <SyncToast
        show={showSyncToast}
        onDismiss={() => setShowSyncToast(false)}
        onFilterGmail={() => setFilter("gmail")}
      />
    </div>
  );
}
