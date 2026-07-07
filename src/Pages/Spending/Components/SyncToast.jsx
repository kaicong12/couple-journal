import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const MOCK_SYNC_RESULTS = [
  { merchant: "Ya Kun Kaya Toast", amount: 8.4 },
  { merchant: "Grab · ride receipt", amount: 17.2 },
  { merchant: "FairPrice Finest", amount: 86.35 },
];

export default function SyncToast({ show, onDismiss, onFilterGmail }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-xl shadow-lg border border-accent-warm p-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <button
        onClick={() => { setVisible(false); onDismiss(); }}
        className="absolute top-3 right-3 text-muted-text hover:text-text"
      >
        <X size={14} />
      </button>

      <div className="flex items-start gap-3 mb-3">
        <span className="w-8 h-8 rounded-full bg-sienna/10 flex items-center justify-center text-sienna text-sm">
          ✦
        </span>
        <div>
          <p className="font-medium text-sm">3 new expenses from Gmail</p>
          <p className="text-xs text-muted-text">Claude read 41 emails · 3 were receipts</p>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        {MOCK_SYNC_RESULTS.map((item, i) => (
          <div key={i} className="flex justify-between text-xs px-2 py-1">
            <span>{item.merchant}</span>
            <span className="font-medium">S${item.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { onFilterGmail(); setVisible(false); onDismiss(); }}
          className="flex-1 py-2 rounded-lg text-xs font-medium uppercase tracking-wide bg-parchment border border-accent-warm text-text hover:bg-accent-warm/50 transition-colors"
        >
          Review
        </button>
        <button
          onClick={() => { setVisible(false); onDismiss(); }}
          className="flex-1 py-2 rounded-lg text-xs font-medium uppercase tracking-wide bg-sienna text-white hover:bg-sienna-dark transition-colors"
        >
          Looks Right
        </button>
      </div>
    </div>
  );
}
