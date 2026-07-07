import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X, Mail } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { getCategories, addCategory, deleteCategory, getSpendingSettings, getExpenses } from "./spendingService";
import { MOCK_CATEGORIES, MOCK_SETTINGS } from "./mockData";

export default function SpendingSettings() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryCounts, setCategoryCounts] = useState({});

  const CATEGORY_COLORS = ["#B48261", "#7A8B5E", "#6B7FA3", "#A35D5D", "#4A7C59", "#C4944A", "#3D6B4F", "#8B6F47"];

  useEffect(() => {
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
          const counts = {};
          const now = new Date();
          for (const exp of expenses) {
            const d = exp.date?.toDate ? exp.date.toDate() : new Date(exp.date);
            if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
              counts[exp.categoryId] = (counts[exp.categoryId] || 0) + 1;
            }
          }
          setCategoryCounts(counts);
        } else {
          setCategories(MOCK_CATEGORIES);
          setSettings(MOCK_SETTINGS);
        }
      } catch (e) {
        setCategories(MOCK_CATEGORIES);
        setSettings(MOCK_SETTINGS);
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
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-medium">Spending settings</h1>
        <Button variant="outline" onClick={() => navigate("/spending")}>
          <ChevronLeft size={14} className="mr-1" />
          Back to Spending
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gmail receipts */}
        <div className="bg-white rounded-xl p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-display font-medium mb-2">Gmail receipts</h2>
          <p className="text-sm text-muted-text mb-6 leading-relaxed">
            When you hit <strong>Sync</strong>, Claude reads your recent inbox, keeps only emails that are actual receipts,
            and turns them into expenses. Nothing is imported without a merchant, amount, and date it can point to.
          </p>

          <div className="space-y-3 mb-4">
            {settings?.gmailAccounts?.map((account, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-accent-warm">
                <div className="w-10 h-10 rounded-lg bg-parchment flex items-center justify-center">
                  <Mail size={18} className="text-muted-text" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{account.email}</p>
                  <p className="text-xs text-[#2E7D32]">✓ {account.label}</p>
                </div>
                <button className="text-xs text-muted-text uppercase tracking-wide hover:text-text transition-colors">
                  Unlink
                </button>
              </div>
            ))}
          </div>

          <div className="bg-sienna/5 rounded-lg p-4 border border-sienna/20">
            <p className="text-xs leading-relaxed text-text">
              <strong className="text-sienna">How the filter works:</strong> the model looks for order confirmations,
              ride receipts, and card alerts — and ignores newsletters, promos, and shipping updates. Anything it's
              unsure about is skipped, never guessed. You can always add what it missed, or remove what it shouldn't have added.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-display font-medium mb-2">Categories</h2>
          <p className="text-sm text-muted-text mb-6 leading-relaxed">
            Yours to shape. New expenses suggest the closest match; type anything new in the picker and it lands here.
          </p>

          <div className="space-y-1 mb-4">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-parchment group">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm flex-1">{cat.name}</span>
                <span className="text-xs text-muted-text">
                  {categoryCounts[cat.id] || 0} this month
                </span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-text hover:text-text p-1"
                >
                  <X size={14} />
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
            <Button size="sm" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
