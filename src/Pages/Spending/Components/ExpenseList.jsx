import { useAuth } from "../../../AuthContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

function formatDateHeader(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();

  if (date.toDateString() === today.toDateString()) {
    return `TODAY · ${dayName} ${monthName} ${dayNum}`;
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return `YESTERDAY · ${dayName} ${monthName} ${dayNum}`;
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
    <div className="space-y-6">
      {groupedExpenses.map(([dateKey, items]) => (
        <div key={dateKey}>
          <p className="text-[11px] uppercase tracking-wider text-muted-text font-medium mb-2 px-1">
            {formatDateHeader(dateKey)}
          </p>
          <div className="space-y-0">
            {items.map((expense) => {
              const cat = categories.find((c) => c.id === expense.categoryId);
              const isYou = expense.paidBy === currentUid;

              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-3 py-3 px-4 bg-white rounded-lg mb-1 shadow-[var(--shadow-soft)] cursor-pointer hover:shadow-[var(--shadow-soft-hover)] transition-shadow group"
                  style={{ borderLeft: `3px solid ${cat?.color || "#8E867E"}` }}
                  onClick={() => navigate(`/spending/${expense.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{expense.merchant}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-text">{cat?.name || "Other"}</span>
                      {expense.description && (
                        <>
                          <span className="text-xs text-muted-text">·</span>
                          <span className="text-xs text-muted-text">{expense.description}</span>
                        </>
                      )}
                      {expense.source === "gmail" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] font-medium uppercase leading-none">
                          ✦ Gmail
                        </span>
                      )}
                      {expense.split === "50/50" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-sienna/10 text-sienna font-medium uppercase leading-none">
                          Split 50/50
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-[11px] text-white font-medium shrink-0 leading-none ${
                      isYou ? "bg-sienna" : "bg-[#6B5344]"
                    }`}
                  >
                    {isYou ? "Y" : "M"}
                  </span>

                  <span className="text-sm font-medium w-20 text-right whitespace-nowrap">
                    S$ {expense.amount.toFixed(2)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(expense.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-text hover:text-text p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
