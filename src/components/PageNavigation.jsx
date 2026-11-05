import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PageNavigation({ total, current, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(0, current - 1))}
        disabled={current === 0}
        className="pn-btn"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="text-xs text-charcoal/70 tabular-nums min-w-[70px] text-center font-sans">
        Page {current + 1} / {total}
      </div>
      <button
        onClick={() => onChange(Math.min(total - 1, current + 1))}
        disabled={current === total - 1}
        className="pn-btn"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}