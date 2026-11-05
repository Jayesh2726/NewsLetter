import { useState } from "react";
import { X, Plus, Image as ImageIcon } from "lucide-react";

export default function AddEventModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    folder: "",
    imagePath: "",
  });
  const [error, setError] = useState("");

  if (!open) return null;

  const reset = () =>
    setForm({ title: "", date: "", description: "", folder: "", imagePath: "" });

  const handleSave = () => {
    if (!form.title.trim()) {
      setError("Event title required aahe.");
      return;
    }
    if (!form.date.trim()) {
      setError("Event date required aahe.");
      return;
    }
    if (!form.folder.trim()) {
      setError("Folder name required aahe (udaharan: Science_Day).");
      return;
    }

    const cleanFolder = form.folder
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^A-Za-z0-9_]/g, "");

    if (!cleanFolder) {
      setError("Folder name madhe fakt letters, numbers, underscore vapra.");
      return;
    }

    const images = [];
    if (form.imagePath.trim()) {
      const [src, dims] = form.imagePath.trim().split("|");
      let w = 1280;
      let h = 720;
      if (dims && /^\d+x\d+$/.test(dims.trim())) {
        [w, h] = dims.split("x").map(Number);
      }
      images.push({
        src: src.trim(),
        w,
        h,
        alt: `${form.title.trim()} photo 1`,
      });
    }

    const newEvent = {
      id: `${cleanFolder.toLowerCase()}-${Date.now()}`,
      folder: cleanFolder,
      title: form.title.trim(),
      date: form.date.trim(),
      description: form.description.trim(),
      layout: "auto",
      images,
    };

    onSave(newEvent);
    reset();
    setError("");
  };

  const handleClose = () => {
    reset();
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-navy text-ivory px-5 py-3 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-gold" />
            <h2 className="text-base font-semibold font-marathi">
              Navin Event Add Kara
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded hover:bg-white/10"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="tb-label">Event title (Marathi allowed) *</label>
            <textarea
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              rows={2}
              placeholder='"अविष्कार २K२६" किंवा "राष्ट्रीय विज्ञान दिन"'
              className="tb-input font-marathi"
            />
          </div>

          <div>
            <label className="tb-label">Event date (Marathi allowed) *</label>
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="उदाहरण: २८ फेब्रुवारी २०२६"
              className="tb-input font-marathi"
            />
          </div>

          <div>
            <label className="tb-label">Image folder name *</label>
            <input
              value={form.folder}
              onChange={(e) => setForm({ ...form, folder: e.target.value })}
              placeholder="NewEvent  (spaces auto-replace hoil → New_Event)"
              className="tb-input font-mono text-[12.5px]"
            />
            <p className="text-[11px] text-charcoal/60 mt-1 font-mono break-all">
              Photos yethे theva:{" "}
              <span className="text-navy">
                public/images/
                {form.folder.trim().replace(/\s+/g, "_") || "NewEvent"}/
              </span>
            </p>
          </div>

          <div>
            <label className="tb-label">Description (Marathi)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              placeholder="Event cha Marathi paragraph... (paragraph breaks sathi Enter daba)"
              className="tb-input font-marathi text-[13px] leading-relaxed"
            />
          </div>

          <div>
            <label className="tb-label flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" />
              First image path (optional)
            </label>
            <input
              value={form.imagePath}
              onChange={(e) => setForm({ ...form, imagePath: e.target.value })}
              placeholder="/images/NewEvent/1.jpeg|1280x720"
              className="tb-input font-mono text-[12.5px]"
            />
            <p className="text-[11px] text-charcoal/60 mt-1">
              Format: <code>path|WIDTHxHEIGHT</code> — dimensions automatic
              layout sathi aahet. Adhik images nantar Toolbar madhun add karu
              shakta.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg font-marathi">
              {error}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-[#fbfaf7] border-t border-charcoal/10 px-5 py-3 flex justify-end gap-2 rounded-b-xl">
          <button onClick={handleClose} className="tb-btn">
            Cancel
          </button>
          <button onClick={handleSave} className="tb-btn tb-primary">
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>
      </div>
    </div>
  );
}