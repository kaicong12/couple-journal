import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X, Mail } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { getCategories, addCategory, deleteCategory, getSpendingSettings, getExpenses } from "./spendingService";
import { MOCK_CATEGORIES, MOCK_SETTINGS, MOCK_EXPENSES } from "./mockData";

function countByCategoryThisMonth(expenses) {
  const counts = {};
  const now = new Date();
  for (const exp of expenses) {
    const d = exp.date?.toDate ? exp.date.toDate() : new Date(exp.date);
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      counts[exp.categoryId] = (counts[exp.categoryId] || 0) + 1;
    }
  }
  return counts;
}

export default function SpendingSettings() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryCounts, setCategoryCounts] = useState({});

  const CATEGORY_COLORS = ["#C0764A", "#8F9A6E", "#708BA4", "#B07A6B", "#5C7064", "#C09A4F", "#9C8A78", "#8B6F47"];

  useEffect(() => {
    const loadFromMock = () => {
      setCategories(MOCK_CATEGORIES);
      setSettings(MOCK_SETTINGS);
      setCategoryCounts(countByCategoryThisMonth(MOCK_EXPENSES));
    };

    async function load() {
      try {
        const [cats, settingsData, expenses] = await Promise.all([
          getCategories(),
          getSpendingSettings(),
          getExpenses(),
        ]);
        if (cats.length > 0) {
          setCategories(cats);
          setSettings(settingsData);
          setCategoryCounts(countByCategoryThisMonth(expenses));
        } else {
          loadFromMock();
        }
      } catch (e) {
        loadFromMock();
      }
    }
    load();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const color = CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length];
    const newCat = await addCategory(newCategoryName.trim(), color);
    setCategories((prev) => [...prev, newCat]);
    setNewCategoryName("");
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-medium tracking-tight">Spending settings</h1>
        <Button
          variant="outline"
          onClick={() => navigate("/spending")}
          className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em] bg-paper"
        >
          <ChevronLeft size={14} className="mr-1" />
          Back to Spending
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gmail receipts */}
        <div className="bg-paper rounded-sm p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-display font-medium mb-2">Gmail receipts</h2>
          <p className="text-sm text-muted-text mb-6 leading-relaxed">
            When you hit <strong>Sync</strong>, Claude reads your recent inbox, keeps only emails that are actual receipts,
            and turns them into expenses. Nothing is imported without a merchant, amount, and date it can point to.
          </p>

          <div className="space-y-3 mb-4">
            {settings?.gmailAccounts?.map((account, i) => (
              <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-sm bg-parchment border border-black/5">
                <div className="w-10 h-10 rounded-lg bg-white border border-black/5 flex items-center justify-center">
                  <Mail size={17} className="text-muted-text" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold">{account.email}</p>
                  <p className="text-[11px] text-sage font-semibold">✓ {account.label}</p>
                </div>
                <button className="text-[11px] text-muted-text font-semibold uppercase tracking-[0.08em] hover:text-text transition-colors">
                  Unlink
                </button>
              </div>
            ))}
          </div>

          <div className="bg-sienna/15 rounded-sm p-3.5">
            <p className="text-xs leading-relaxed text-sienna-deep">
              <strong>How the filter works:</strong> the model looks for order confirmations,
              ride receipts, and card alerts — and ignores newsletters, promos, and shipping updates. Anything it's
              unsure about is skipped, never guessed. You can always add what it missed, or remove what it shouldn't have added.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-paper rounded-sm p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-display font-medium mb-2">Categories</h2>
          <p className="text-sm text-muted-text mb-6 leading-relaxed">
            Yours to shape. New expenses suggest the closest match; type anything new in the picker and it lands here.
          </p>

          <div className="space-y-1 mb-4">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 py-2 px-2 border-b border-black/5 last:border-b-0 hover:bg-parchment group">
                <span
                  className="w-[9px] h-[9px] rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[13px] flex-1">{cat.name}</span>
                <span className="text-[11px] text-muted-text">
                  {categoryCounts[cat.id] || 0} this month
                </span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="opacity-50 group-hover:opacity-100 transition-opacity text-muted-text hover:text-text p-1"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              placeholder="New category..."
              className="h-9"
            />
            <Button
              size="sm"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="rounded-sm text-[10px] font-bold uppercase tracking-[0.13em]"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
