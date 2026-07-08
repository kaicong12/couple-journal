import { useAuth } from "../../../AuthContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Avatar from "./Avatar";

function formatDateHeader(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();

  if (date.toDateString() === today.toDateString()) {
    return `Today · ${dayName} ${monthName} ${dayNum}`;
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday · ${dayName} ${monthName} ${dayNum}`;
  }
  return `${dayName} ${monthName} ${dayNum}`;
}

export default function ExpenseList({ groupedExpenses, categories, onRemove }) {
  const { user } = useAuth();
  const currentUid = user?.uid || "mock-user-uid";
  const navigate = useNavigate();

  if (groupedExpenses.length === 0) {
    return (
      <p className="text-center text-muted-text py-12">No expenses this month.</p>
    );
  }

  return (
    <div className="bg-paper rounded-sm shadow-[var(--shadow-soft)] overflow-hidden">
      {groupedExpenses.map(([dateKey, items]) => (
        <div key={dateKey}>
          <p className="px-5 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-text font-bold bg-parchment border-b border-black/5">
            {formatDateHeader(dateKey)}
          </p>
          {items.map((expense) => {
            const cat = categories.find((c) => c.id === expense.categoryId);
            const isYou = expense.paidBy === currentUid;

            return (
              <div
                key={expense.id}
                className="flex items-center gap-4 py-3 px-5 border-b border-black/5 last:border-b-0 cursor-pointer hover:bg-parchment transition-colors group"
                onClick={() => navigate(`/spending/${expense.id}`)}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat?.color || "#8E867E" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-medium text-[15.5px] truncate">{expense.merchant}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[11px] text-muted-text">{cat?.name || "Other"}</span>
                    {expense.description && (
                      <>
                        <span className="text-[11px] text-muted-text">·</span>
                        <span className="text-[11px] text-muted-text">{expense.description}</span>
                      </>
                    )}
                    {expense.source === "gmail" && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-sage/15 text-sage font-bold uppercase tracking-[0.1em] leading-none inline-flex items-center gap-1">
                        ✦ Gmail
                      </span>
                    )}
                    {expense.split === "50/50" && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-sienna/15 text-sienna-deep font-bold uppercase tracking-[0.08em] leading-none">
                        Split 50/50
                      </span>
                    )}
                  </div>
                </div>

                <Avatar who={isYou ? "you" : "mira"} />

                <span className="font-display font-medium text-base sm:w-24 text-right whitespace-nowrap">
                  <span className="text-[11px] text-muted-text mr-0.5">S$</span>
                  {expense.amount.toFixed(2)}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(expense.id);
                  }}
                  className="hidden sm:flex w-6 h-6 rounded-full items-center justify-center opacity-35 group-hover:opacity-100 group-hover:border group-hover:border-accent-warm group-hover:bg-paper transition-opacity text-muted-text hover:text-text"
                >
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
