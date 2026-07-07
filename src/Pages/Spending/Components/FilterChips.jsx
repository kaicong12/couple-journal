import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "ALL" },
  { key: "you", label: "YOU" },
  { key: "mira", label: "MIRA" },
  { key: "gmail", label: "FROM GMAIL" },
  { key: "manual", label: "MANUAL" },
];

export default function FilterChips({ filter, onFilterChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide transition-colors",
            filter === f.key
              ? "bg-text text-white"
              : "bg-white text-text border border-accent-warm hover:bg-accent-warm/50"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
