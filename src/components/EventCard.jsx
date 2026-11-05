export default function EventCard({ event, active, onSelect }) {
  return (
    <button
      onClick={() => onSelect(event.id)}
      className={`w-full text-left p-3 rounded-lg border transition ${
        active
          ? "bg-navy text-ivory border-navy shadow"
          : "bg-white text-charcoal border-charcoal/15 hover:border-gold"
      }`}
    >
      <div className="text-[11px] uppercase tracking-wider opacity-70 font-sans">
        {event.date}
      </div>
      <div className="font-marathi font-semibold text-sm leading-snug mt-1 line-clamp-2">
        {event.title.replace(/^"|"$/g, "")}
      </div>
      <div className={`text-[11px] mt-1 ${active ? "text-ivory/70" : "text-charcoal/60"}`}>
        {event.images.length} image{event.images.length !== 1 ? "s" : ""}
      </div>
    </button>
  );
}