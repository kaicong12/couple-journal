import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { ChevronLeft, Clock, Mail } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { getExpenseById, deleteExpense, getCategories } from "./spendingService";
import { MOCK_CATEGORIES, getMockExpensesForUser } from "./mockData";
import Avatar from "./Components/Avatar";

const PARTNER_UID = "partner-mock-uid";

export default function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUid = user?.uid || "mock-user-uid";
  const [expense, setExpense] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFromMock = () => {
      const mockExp = getMockExpensesForUser(currentUid, PARTNER_UID).find((e) => e.id === id) || null;
      setExpense(mockExp);
      if (mockExp) {
        setCategory(MOCK_CATEGORIES.find((c) => c.id === mockExp.categoryId) || null);
      }
    };

    async function load() {
      try {
        const [exp, cats] = await Promise.all([getExpenseById(id), getCategories()]);
        if (exp && cats.length > 0) {
          setExpense(exp);
          setCategory(cats.find((c) => c.id === exp.categoryId) || null);
        } else {
          loadFromMock();
        }
      } catch (e) {
        loadFromMock();
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUid]);

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

  const formatShortDate = (d) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  const handleRemove = async () => {
    await deleteExpense(id);
    navigate("/spending");
  };

  const MetaRow = ({ icon, label, children, action }) => (
    <div className="flex items-center gap-3 px-5 py-2.5 border-b border-black/5">
      <span className="w-[30px] h-[30px] rounded-full bg-surface-warm text-sienna-deep flex items-center justify-center text-[13px] shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[9.5px] uppercase tracking-[0.12em] text-muted-text font-bold">{label}</p>
        <div className="text-sm mt-0.5">{children}</div>
      </div>
      {action && (
        <button className="text-[10px] text-sienna font-bold uppercase tracking-[0.1em] shrink-0">
          {action}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-8 text-left">
      {/* Back button */}
      <button
        onClick={() => navigate("/spending")}
        className="flex items-center gap-1 text-sm text-muted-text hover:text-text transition-colors mb-6"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <div className="bg-paper rounded-sm shadow-[var(--shadow-soft)] overflow-hidden">
        {/* Hero */}
        <div className="px-5 pt-5 pb-4 bg-gradient-to-b from-surface-warm to-parchment border-b border-black/5">
          {expense.source === "gmail" && (
            <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-sage/15 text-sage font-bold uppercase tracking-[0.1em] mb-2.5">
              ✦ From Gmail · {expense.merchant} receipt
            </span>
          )}
          <p className="text-[40px] leading-tight font-display font-medium tracking-tight">
            <span className="text-lg text-muted-text mr-1">S$</span>
            {expense.amount.toFixed(2)}
          </p>
          <p className="text-sm text-ink-soft mt-0.5">{expense.merchant}</p>
        </div>

        {/* Details */}
        <MetaRow icon={<Clock size={14} />} label="When">
          <span className="font-display text-[15px]">{formatDate(expDate)}</span>
        </MetaRow>

        <MetaRow
          icon={
            <span
              className="w-[9px] h-[9px] rounded-full"
              style={{ backgroundColor: category?.color || "#8E867E" }}
            />
          }
          label="Category"
          action="Change"
        >
          <span className="font-display text-[15px]">{category?.name || "Other"}</span>
        </MetaRow>

        <MetaRow icon={<Avatar who={isYou ? "you" : "mira"} className="!w-[22px] !h-[22px]" />} label="Paid by">
          <span>{isYou ? "You" : "Mira"}</span>
        </MetaRow>

        <MetaRow icon={<span className="text-[12px] font-semibold">½</span>} label="Split" action={expense.split === "50/50" ? "Edit" : undefined}>
          <span>
            {expense.split === "50/50"
              ? `50 / 50 · ${isYou ? "Mira's" : "Your"} share S$${splitAmount}`
              : "Not split"}
          </span>
        </MetaRow>

        {expense.gmailMeta && (
          <MetaRow icon={<Mail size={13} />} label="Source" action="View">
            <span>
              "{expense.gmailMeta.subject}"
              {expense.gmailMeta.receivedAt && (
                <> · {formatShortDate(expense.gmailMeta.receivedAt.toDate ? expense.gmailMeta.receivedAt.toDate() : new Date(expense.gmailMeta.receivedAt))}</>
              )}
            </span>
          </MetaRow>
        )}

        {/* Remove button */}
        <div className="p-5">
          <button
            onClick={handleRemove}
            className="w-full py-3 rounded-sm border border-rose/40 text-rose text-[11px] font-bold uppercase tracking-[0.13em] hover:bg-rose/5 transition-colors"
          >
            Remove This Expense
          </button>
          <p className="text-center text-[10.5px] text-muted-text mt-2.5">
            Removing tells the sync to skip this receipt next time.
          </p>
        </div>
      </div>
    </div>
  );
}
