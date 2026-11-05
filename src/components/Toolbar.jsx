import {
  Download,
  Printer,
  RotateCcw,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";

const LAYOUTS = [
  { value: "auto", label: "Auto" },
  { value: "grid", label: "Grid" },
  { value: "mosaic", label: "Mosaic" },
  { value: "hero", label: "Hero + strip" },
  { value: "strip", label: "Strip" },
  { value: "single", label: "Single" },
];

export default function Toolbar({
  event,
  onEdit,
  onExportPdf,
  onPrint,
  onReset,
  onLayoutChange,
  onMoveImage,
  onRemoveImage,
  onAddImage,
  onDeleteEvent,
}) {
  if (!event) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={onExportPdf} className="tb-btn tb-primary">
          <Download className="w-4 h-4" /> Download PDF
        </button>
        <button onClick={onPrint} className="tb-btn">
          <Printer className="w-4 h-4" /> Print
        </button>
        <button onClick={onReset} className="tb-btn">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button
          onClick={() => onDeleteEvent?.(event.id)}
          className="tb-btn !text-red-600 !border-red-200 hover:!bg-red-50"
          title="He event delete kara"
        >
          <Trash2 className="w-4 h-4" /> Delete event
        </button>
      </div>

      <div>
        <label className="tb-label">Event title</label>
        <textarea
          value={event.title}
          onChange={(e) => onEdit("title", e.target.value)}
          rows={3}
          className="tb-input font-marathi"
        />
      </div>

      <div>
        <label className="tb-label">Date</label>
        <input
          value={event.date}
          onChange={(e) => onEdit("date", e.target.value)}
          className="tb-input font-marathi"
        />
      </div>

      <div>
        <label className="tb-label">Marathi description</label>
        <textarea
          value={event.description}
          onChange={(e) => onEdit("description", e.target.value)}
          rows={10}
          className="tb-input font-marathi text-[13px] leading-relaxed"
        />
      </div>

      <div>
        <label className="tb-label">Image layout</label>
        <select
          value={event.layout}
          onChange={(e) => onLayoutChange(e.target.value)}
          className="tb-input"
        >
          {LAYOUTS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="tb-label">Images ({event.images.length})</label>
        <div className="space-y-2">
          {event.images.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="flex items-center gap-2 bg-white border border-charcoal/10 rounded-md p-2"
            >
              <div className="w-10 h-10 bg-ivory rounded overflow-hidden shrink-0">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-mono truncate">
                  {img.src.split("/").pop()}
                </p>
                <p className="text-[10px] text-charcoal/50">
                  {img.w}×{img.h}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onMoveImage(i, -1)}
                  disabled={i === 0}
                  className="ic-btn"
                  title="Move up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onMoveImage(i, 1)}
                  disabled={i === event.images.length - 1}
                  className="ic-btn"
                  title="Move down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onRemoveImage(i)}
                  className="ic-btn ic-danger"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onAddImage}
          className="tb-btn tb-ghost mt-2 w-full justify-center"
        >
          <ImageIcon className="w-4 h-4" /> Add image path
        </button>
      </div>
    </div>
  );
}