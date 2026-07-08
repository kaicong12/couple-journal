import Avatar from "./Avatar";

export default function SummaryCards({ summary }) {
  const { total, youPaid, miraPaid, count, categoryBreakdown, pctChange, prevMonthName } = summary;
  const totalBar = youPaid + miraPaid || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* This Month So Far */}
      <div className="bg-paper rounded-sm p-6 shadow-[var(--shadow-soft)]">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-text font-bold">
          This month · so far
        </p>
        <p className="text-4xl font-display font-medium tracking-tight mt-2">
          <span className="text-xl text-muted-text mr-1">S$</span>
          {total.toFixed(2)}
        </p>
        <p className="text-xs text-muted-text mt-1.5">
          {pctChange !== null && (
            <span className={`font-semibold ${pctChange <= 0 ? "text-sage" : "text-rose"}`}>
              {pctChange <= 0 ? "↓" : "↑"} {Math.abs(pctChange)}%
            </span>
          )}
          {pctChange !== null && <> vs {prevMonthName} · </>}
          {count} expenses
        </p>
      </div>

      {/* Who Paid */}
      <div className="bg-paper rounded-sm p-6 shadow-[var(--shadow-soft)]">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-text font-bold mb-4">
          Who paid
        </p>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-surface-deep">
          <div
            className="h-full bg-gradient-to-r from-[#C9A788] to-[#A87653]"
            style={{ width: `${(youPaid / totalBar) * 100}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-[#B07A6B] to-[#96604F]"
            style={{ width: `${(miraPaid / totalBar) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-ink-soft mt-2.5">
          <span className="flex items-center gap-1.5">
            <Avatar who="you" />
            You · <b className="font-display text-sm font-medium">S${youPaid.toFixed(0)}</b>
          </span>
          <span className="flex items-center gap-1.5">
            <b className="font-display text-sm font-medium">S${miraPaid.toFixed(0)}</b> · Mira
            <Avatar who="mira" />
          </span>
        </div>
      </div>

      {/* By Category */}
      <div className="bg-paper rounded-sm p-6 shadow-[var(--shadow-soft)]">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-text font-bold mb-3">
          By category
        </p>
        <div className="space-y-2">
          {categoryBreakdown.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2.5">
              <span className="text-xs text-ink-soft w-20 truncate">{cat.name}</span>
              <div className="flex-1 h-1.5 bg-surface-deep rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(cat.amount / (categoryBreakdown[0]?.amount || 1)) * 100}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <span className="text-[13px] font-display w-14 text-right">S${cat.amount.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
