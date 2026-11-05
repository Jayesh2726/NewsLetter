import Header from "./Header";
import ImageGallery from "./ImageGallery";
import { useImageDimensions } from "../hooks/useImageDimensions";

export default function NewsletterPage({ college, event }) {
  const images = useImageDimensions(event.images);

  return (
    <article className="nl-page" data-event-id={event.id}>
      <Header college={college} />

      <section className="nl-body">
        {/* Title block */}
        <div className="nl-title-block">
          <h2 className="nl-event-title">{event.title}</h2>
          <p className="nl-event-date">{event.date}</p>
        </div>

        {/* PARAGRAPH FIRST — always above photos */}
        <div className="nl-description">
          {event.description.split(/\n+/).map((p, i) => (
            <p key={i} className="nl-para">
              {p}
            </p>
          ))}
        </div>

        {/* PHOTOS BELOW — take remaining space only */}
        {images.length > 0 && (
          <div className="nl-photos">
            <ImageGallery images={images} layout={event.layout} />
          </div>
        )}
      </section>

      <footer className="nl-footer">
        <div className="nl-footer-rule" />
        <div className="nl-footer-row">
          <span>{college.footerLeft}</span>
          <span className="nl-footer-dot">•</span>
          <span>{college.footerRight}</span>
        </div>
      </footer>
    </article>
  );
}