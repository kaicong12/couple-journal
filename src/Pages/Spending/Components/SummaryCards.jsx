import { useAuth } from "../../../AuthContext";

export default function SummaryCards({ summary }) {
  const { total, youPaid, miraPaid, count, categoryBreakdown } = summary;
  const totalBar = youPaid + miraPaid || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* This Month So Far */}
      <div className="bg-white rounded-lg p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-wider text-muted-text mb-2 font-medium">
          This Month · So Far
        </p>
        <p className="text-3xl font-medium font-display">
          <span className="text-base text-muted-text mr-1">S$</span>
          {total.toFixed(2)}
        </p>
        <p className="text-xs text-muted-text mt-2">{count} expenses</p>
      </div>

      {/* Who Paid */}
      <div className="bg-white rounded-lg p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-wider text-muted-text mb-3 font-medium">
          Who Paid
        </p>
        <div className="w-full h-3 rounded-full overflow-hidden flex mb-3">
          <div
            className="h-full bg-sienna rounded-l-full"
            style={{ width: `${(youPaid / totalBar) * 100}%` }}
          />
          <div
            className="h-full bg-[#6B5344] rounded-r-full"
            style={{ width: `${(miraPaid / totalBar) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-sienna inline-flex items-center justify-center text-[10px] text-white font-medium leading-none">
              Y
            </span>
            You · S${youPaid.toFixed(0)}
          </span>
          <span className="flex items-center gap-1.5">
            S${miraPaid.toFixed(0)} · Mira
            <span className="w-5 h-5 rounded-full bg-[#6B5344] inline-flex items-center justify-center text-[10px] text-white font-medium leading-none">
              M
            </span>
          </span>
        </div>
      </div>

      {/* By Category */}
      <div className="bg-white rounded-lg p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-wider text-muted-text mb-3 font-medium">
          By Category
        </p>
        <div className="space-y-2">
          {categoryBreakdown.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <span className="text-xs w-20 truncate">{cat.name}</span>
              <div className="flex-1 h-2 bg-[#F7F5F0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(cat.amount / (categoryBreakdown[0]?.amount || 1)) * 100}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <span className="text-xs font-medium w-14 text-right">S${cat.amount.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
