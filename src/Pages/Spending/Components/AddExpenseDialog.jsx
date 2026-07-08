import { useState, useMemo } from "react";
import { useAuth } from "../../../AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { Timestamp } from "firebase/firestore";
import Fuse from "fuse.js";
import { Plus, Search, CalendarDays } from "lucide-react";
import Avatar from "./Avatar";

const CATEGORY_COLORS = ["#C0764A", "#8F9A6E", "#708BA4", "#B07A6B", "#5C7064", "#C09A4F", "#9C8A78", "#8B6F47"];

const localDateStr = (d = new Date()) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function AddExpenseDialog({ open, onOpenChange, categories, onSave, onAddCategory, partnerUid }) {
  const { user } = useAuth();
  const currentUid = user?.uid || "mock-user-uid";
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => localDateStr());
  const [merchant, setMerchant] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [paidBy, setPaidBy] = useState("you");
  const [split, setSplit] = useState("none");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const fuse = new Fuse(categories, { keys: ["name"], threshold: 0.4 });
    return fuse.search(categorySearch).map((r) => r.item);
  }, [categories, categorySearch]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();
    const suffix = d.toDateString() === today.toDateString() ? " · today" : "";
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}${suffix}`;
  };

  const handleSave = async () => {
    if (!amount || !merchant) return;
    await onSave({
      amount: parseFloat(amount),
      merchant,
      description: null,
      categoryId: selectedCategoryId || null,
      paidBy: paidBy === "you" ? currentUid : partnerUid,
      split,
      date: Timestamp.fromDate(new Date(date + "T12:00:00")),
      source: "manual",
      gmailMeta: null,
    });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setAmount("");
    setDate(localDateStr());
    setMerchant("");
    setCategorySearch("");
    setSelectedCategoryId("");
    setPaidBy("you");
    setSplit("none");
  };

  const handleCreateCategory = async () => {
    const color = CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length];
    const newCat = await onAddCategory(categorySearch.trim(), color);
    setSelectedCategoryId(newCat.id);
    setCategorySearch(newCat.name);
    setShowCategoryDropdown(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Add an expense</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Amount + Date */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3">
              <label className="text-[11px] uppercase tracking-wider text-muted-text font-medium mb-1 block">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text text-sm">S$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9 h-11 text-xl font-display font-medium"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-[11px] uppercase tracking-wider text-muted-text font-medium mb-1 block">
                Date
              </label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      className="h-11 w-full flex items-center gap-2 rounded-lg border border-input bg-parchment px-3 text-sm text-text hover:border-sienna transition-colors"
                    />
                  }
                >
                  <CalendarDays size={14} className="text-muted-text shrink-0" />
                  <span className="truncate">{formatDate(date)}</span>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={new Date(date + "T00:00:00")}
                    onSelect={(d) => {
                      if (d) {
                        const yyyy = d.getFullYear();
                        const mm = String(d.getMonth() + 1).padStart(2, "0");
                        const dd = String(d.getDate()).padStart(2, "0");
                        setDate(`${yyyy}-${mm}-${dd}`);
                      }
                      setShowDatePicker(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Merchant */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-text font-medium mb-1 block">
              Merchant / Description
            </label>
            <Input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Atlas Coffeehouse"
              className="h-11"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <label className="text-[11px] uppercase tracking-wider text-muted-text font-medium mb-1 block">
              Category
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
              <Input
                value={selectedCategory ? selectedCategory.name : categorySearch}
                onChange={(e) => {
                  setCategorySearch(e.target.value);
                  setSelectedCategoryId("");
                  setShowCategoryDropdown(true);
                }}
                onFocus={() => setShowCategoryDropdown(true)}
                placeholder="Search or create..."
                className="h-11 pl-8"
              />
            </div>
            {showCategoryDropdown && !selectedCategoryId && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-accent-warm overflow-hidden">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setCategorySearch(cat.name);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-parchment flex items-center gap-2 text-sm"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </button>
                ))}
                {categorySearch.trim() && (
                  <button
                    onClick={handleCreateCategory}
                    className="w-full text-left px-3 py-2.5 hover:bg-parchment flex items-center gap-2 text-sm text-sienna border-t border-accent-warm"
                  >
                    <Plus size={14} />
                    Create "{categorySearch.trim()}" as a new category
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Paid By */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-text font-medium mb-1 block">
              Paid By
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setPaidBy("you")}
                className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                  paidBy === "you"
                    ? "bg-text text-white"
                    : "bg-parchment text-text border border-accent-warm"
                }`}
              >
                <Avatar who="you" />
                You
              </button>
              <button
                onClick={() => setPaidBy("mira")}
                className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                  paidBy === "mira"
                    ? "bg-text text-white"
                    : "bg-parchment text-text border border-accent-warm"
                }`}
              >
                <Avatar who="mira" />
                Mira
              </button>
            </div>
          </div>

          {/* Split */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-text font-medium mb-1 block">
              Split
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSplit("none")}
                className={`px-4 py-2 rounded-full text-[10.5px] font-bold uppercase tracking-[0.06em] transition-colors ${
                  split === "none"
                    ? "bg-sienna text-white"
                    : "bg-paper text-ink-soft border border-accent-warm"
                }`}
              >
                Not Split
              </button>
              <button
                onClick={() => setSplit("50/50")}
                className={`px-4 py-2 rounded-full text-[10.5px] font-bold uppercase tracking-[0.06em] transition-colors ${
                  split === "50/50"
                    ? "bg-sienna text-white"
                    : "bg-paper text-ink-soft border border-accent-warm"
                }`}
              >
                50 / 50
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!amount || !merchant}
            className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em] bg-text text-paper hover:bg-text/90"
          >
            Save Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
