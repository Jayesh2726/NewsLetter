import { useEffect, useMemo, useRef, useState } from "react";
import { Printer, Download, Eye, PanelLeft, Plus, Trash2 } from "lucide-react";
import defaultData from "./data/events.json";
import Header from "./components/Header";
import EventCard from "./components/EventCard";
import NewsletterPage from "./components/NewsletterPage";
import Toolbar from "./components/Toolbar";
import PageNavigation from "./components/PageNavigation";
import AddEventModal from "./components/AddEventModal";

const STORAGE_KEY = "sspit-newsletter-v1";

export default function App() {
  const [data, setData] = useState(() => loadFromStorage() || defaultData);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showAllPages, setShowAllPages] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const previewRef = useRef(null);
  const [scale, setScale] = useState(1);

  const selectedEvent = data.events[selectedIdx];

  // Persist edits
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota errors ignored */
    }
  }, [data]);

  // Fit-to-width scale
  useEffect(() => {
    const compute = () => {
      const wrap = previewRef.current;
      if (!wrap) return;
      const available = wrap.clientWidth - 24;
      const pagePx = mmToPx(210);
      const s = Math.min(1, available / pagePx);
      setScale(s);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  /* ---------- edit handlers ---------- */
  const patchEvent = (patch) =>
    setData((d) => ({
      ...d,
      events: d.events.map((e, i) => (i === selectedIdx ? { ...e, ...patch } : e)),
    }));

  const handleEdit = (field, value) => patchEvent({ [field]: value });
  const handleLayoutChange = (layout) => patchEvent({ layout });

  const handleMoveImage = (from, dir) => {
    const to = from + dir;
    if (to < 0 || to >= selectedEvent.images.length) return;
    const images = [...selectedEvent.images];
    const [item] = images.splice(from, 1);
    images.splice(to, 0, item);
    patchEvent({ images });
  };

  const handleRemoveImage = (idx) =>
    patchEvent({ images: selectedEvent.images.filter((_, i) => i !== idx) });

  const handleAddImage = () => {
    const path = window.prompt(
      "Enter image path (e.g. /images/Avishkar/12.jpeg). Optional: append |WxH like /images/x.jpeg|1280x720",
      "/images/"
    );
    if (!path) return;
    const [src, dims] = path.split("|");
    let w = 1280;
    let h = 720;
    if (dims && /^\d+x\d+$/.test(dims.trim())) {
      [w, h] = dims.split("x").map(Number);
    }
    patchEvent({
      images: [
        ...selectedEvent.images,
        { src: src.trim(), w, h, alt: "New event photo" },
      ],
    });
  };

  /* ---------- add / delete event ---------- */
  const handleAddEvent = (newEvent) => {
    setData((d) => ({
      ...d,
      events: [...d.events, newEvent],
    }));
    // Navin event automatic select kara
    setSelectedIdx(data.events.length);
    setShowAllPages(false);
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id) => {
    const ev = data.events.find((e) => e.id === id);
    if (!ev) return;
    if (data.events.length === 1) {
      alert("Kamiत kami ek event pahije. Delete karta yet nahi.");
      return;
    }
    const ok = window.confirm(
      `He event delete karaych aahe ka?\n\n"${ev.title
        .replace(/^"|"$/g, "")
        .slice(0, 60)}..."\n\n(local edits janar — Reset daba ki events.json madhe parat yetil)`
    );
    if (!ok) return;

    const deletedIdx = data.events.findIndex((e) => e.id === id);

    setData((d) => ({
      ...d,
      events: d.events.filter((e) => e.id !== id),
    }));

    setSelectedIdx((cur) => {
      if (deletedIdx === -1) return cur;
      if (deletedIdx >= data.events.length - 1) {
        return Math.max(0, data.events.length - 2);
      }
      return deletedIdx;
    });
  };

  const handleReset = () => {
    if (!window.confirm("Reset all edits back to the original newsletter?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultData);
    setSelectedIdx(0);
  };

  /* ---------- PDF export ---------- */
  const handleExportPdf = async () => {
    const pages = previewRef.current?.querySelectorAll(".nl-page");
    if (!pages || pages.length === 0) {
      alert("Nothing to export yet.");
      return;
    }

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.width = "210mm";
    container.style.background = "#fff";

    pages.forEach((p) => {
      const clone = p.cloneNode(true);
      clone.style.transform = "none";
      clone.style.boxShadow = "none";
      clone.style.margin = "0";
      container.appendChild(clone);
    });
    document.body.appendChild(container);

    try {
      const { default: html2pdf } = await import("html2pdf.js");
      await html2pdf()
        .set({
          margin: 0,
          filename: `SSPIT-Newsletter-${new Date().toISOString().slice(0, 10)}.pdf`,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            windowWidth: mmToPx(210),
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"], after: ".nl-page" },
        })
        .from(container)
        .save();
    } catch (err) {
      console.error(err);
      alert("PDF export failed. Falling back to browser Print → Save as PDF.");
      handlePrint();
    } finally {
      document.body.removeChild(container);
    }
  };

  const handlePrint = () => {
    setShowAllPages(true);
    setTimeout(() => window.print(), 120);
  };

  const visiblePages = useMemo(
    () => (showAllPages ? data.events : [selectedEvent]),
    [showAllPages, data.events, selectedEvent]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#ebe8df]">
      {/* Top bar */}
      <div className="app-topbar no-print sticky top-0 z-30 bg-navy text-ivory px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="p-1.5 rounded hover:bg-white/10"
            title="Toggle sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold font-semibold">
              Newsletter Generator &amp; Editor
            </p>
            <h1 className="text-sm font-semibold font-marathi leading-tight">
              श्रीमती शरच्चंद्रिका सुरेश पाटील इन्स्टिट्यूट ऑफ टेक्नॉलॉजी, चोपडा
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAllPages((v) => !v)}
            className="tb-btn !bg-white/10 !text-ivory !border-white/20"
          >
            <Eye className="w-4 h-4" />
            {showAllPages ? "Focus page" : "Show all"}
          </button>
          <button
            onClick={handlePrint}
            className="tb-btn !bg-white/10 !text-ivory !border-white/20"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={handleExportPdf}
            className="tb-btn !bg-gold !text-navy !border-gold font-bold"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Sidebar (event list) */}
        {sidebarOpen && (
          <aside className="app-sidebar no-print w-[260px] shrink-0 bg-[#fbfaf7] border-r border-charcoal/10 overflow-y-auto p-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold">
                Events — one A4 page each
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 text-[10.5px] font-bold text-navy hover:text-gold px-1.5 py-0.5 rounded hover:bg-white transition"
                title="Navin event add kara"
              >
                <Plus className="w-3 h-3" /> ADD
              </button>
            </div>

            <div className="space-y-2">
              {data.events.map((ev, i) => (
                <div key={ev.id} className="relative group">
                  <EventCard
                    event={ev}
                    active={i === selectedIdx}
                    onSelect={(id) => {
                      const idx = data.events.findIndex((e) => e.id === id);
                      setSelectedIdx(idx);
                      setShowAllPages(false);
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(ev.id);
                    }}
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition p-1 rounded bg-white shadow border border-charcoal/15 text-red-600 hover:bg-red-50"
                    title="He event delete kara"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Editor panel */}
        <aside className="app-sidebar no-print w-[340px] shrink-0 bg-white border-r border-charcoal/10 overflow-y-auto p-4">
          <div className="mb-3 pb-3 border-b border-charcoal/10 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold">
                Editing
              </p>
              <p className="text-xs font-semibold text-navy font-marathi line-clamp-1">
                {selectedEvent?.title.replace(/^"|"$/g, "")}
              </p>
            </div>
            <PageNavigation
              total={data.events.length}
              current={selectedIdx}
              onChange={(i) => {
                setSelectedIdx(i);
                setShowAllPages(false);
              }}
            />
          </div>

          <Toolbar
            event={selectedEvent}
            onEdit={handleEdit}
            onExportPdf={handleExportPdf}
            onPrint={handlePrint}
            onReset={handleReset}
            onLayoutChange={handleLayoutChange}
            onMoveImage={handleMoveImage}
            onRemoveImage={handleRemoveImage}
            onAddImage={handleAddImage}
            onDeleteEvent={handleDeleteEvent}
          />

          <div className="mt-6 pt-4 border-t border-charcoal/10">
            <p className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold mb-2">
              College header / footer
            </p>
            <label className="tb-label">Header note</label>
            <input
              value={data.college.headerNote}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  college: { ...d.college, headerNote: e.target.value },
                }))
              }
              className="tb-input font-marathi mb-3"
            />
            <label className="tb-label">Footer left</label>
            <input
              value={data.college.footerLeft}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  college: { ...d.college, footerLeft: e.target.value },
                }))
              }
              className="tb-input font-marathi mb-3"
            />
            <label className="tb-label">Footer right</label>
            <input
              value={data.college.footerRight}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  college: { ...d.college, footerRight: e.target.value },
                }))
              }
              className="tb-input font-marathi"
            />
          </div>
        </aside>

        {/* Preview */}
        <main
          className="flex-1 min-w-0 overflow-auto bg-[#ebe8df] p-4"
          ref={previewRef}
        >
          <div className="app-preview-wrap space-y-6 flex flex-col items-center">
            <div
              className="app-preview-scaler"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
              }}
            >
              <div className="flex flex-col gap-8">
                {visiblePages.map((ev) => (
                  <div
                    key={ev.id}
                    className="shadow-2xl"
                    onClick={() => {
                      const idx = data.events.findIndex((e) => e.id === ev.id);
                      setSelectedIdx(idx);
                    }}
                  >
                    <NewsletterPage college={data.college} event={ev} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ADD EVENT MODAL */}
      <AddEventModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddEvent}
      />
    </div>
  );
}

/* ---------- helpers ---------- */
function mmToPx(mm) {
  return (mm / 25.4) * 96;
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.events)) return null;
    return parsed;
  } catch {
    return null;
  }
}