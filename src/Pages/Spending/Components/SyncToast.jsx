import { useState, useEffect } from "react";

// Fallback when logged out (no real Gmail sync possible)
const MOCK_RESULTS = {
  scanned: 41,
  receipts: 3,
  imported: [
    { merchant: "Ya Kun Kaya Toast", amount: 8.4 },
    { merchant: "Grab · ride receipt", amount: 17.2 },
    { merchant: "FairPrice Finest", amount: 86.35 },
  ],
};

export default function SyncToast({ show, results, onDismiss, onFilterGmail }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 8000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!visible) return null;

  const { scanned, receipts, imported } = results || MOCK_RESULTS;
  const hasNew = imported.length > 0;

  return (
    <div className="fixed bottom-6 max-sm:left-1/2 max-sm:-translate-x-1/2 sm:right-6 z-50 w-80 bg-text text-paper rounded-md p-4 shadow-[0_24px_60px_-12px_rgba(42,37,33,0.45)] text-left animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-2.5">
        <span className="w-[26px] h-[26px] rounded-full bg-sienna flex items-center justify-center text-[13px] shrink-0">
          ✦
        </span>
        <div>
          <p className="font-bold text-[13px]">
            {hasNew ? `${imported.length} new expense${imported.length > 1 ? "s" : ""} from Gmail` : "No new expenses"}
          </p>
          <p className="text-[11.5px] opacity-75 mt-0.5">
            Claude read {scanned} email{scanned === 1 ? "" : "s"} · {receipts} {receipts === 1 ? "was a receipt" : "were receipts"}
          </p>
        </div>
      </div>

      {hasNew && (
        <div className="mt-3 pt-2.5 border-t border-white/15 space-y-1.5">
          {imported.slice(0, 5).map((item, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="opacity-85 truncate mr-3">{item.merchant}</span>
              <span className="font-display shrink-0">S${item.amount.toFixed(2)}</span>
            </div>
          ))}
          {imported.length > 5 && (
            <p className="text-[11px] opacity-60">+ {imported.length - 5} more</p>
          )}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        {hasNew && (
          <button
            onClick={() => { onFilterGmail(); setVisible(false); onDismiss(); }}
            className="flex-1 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.12em] border border-white/25 text-paper hover:bg-white/10 transition-colors"
          >
            Review
          </button>
        )}
        <button
          onClick={() => { setVisible(false); onDismiss(); }}
          className="flex-1 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.12em] bg-sienna text-paper hover:bg-sienna-dark transition-colors"
        >
          {hasNew ? "Looks Right" : "OK"}
        </button>
      </div>
    </div>
  );
}
