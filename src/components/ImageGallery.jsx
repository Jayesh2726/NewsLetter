import SafeImage from "./SafeImage";

export default function ImageGallery({ images, layout = "auto" }) {
  if (!images || images.length === 0) return null;

  const chosen = layout === "auto" ? pickAuto(images) : layout;

  if (chosen === "single" || images.length === 1) {
    return (
      <div className="nl-gallery nl-gallery-single">
        {images.map((img, i) => (
          <figure key={i} className={`nl-fig ${images.length === 1 ? "nl-fig-full" : ""}`}>
            <SafeImage src={img.src} alt={img.alt} missing={img.missing} className="nl-img" />
          </figure>
        ))}
      </div>
    );
  }

  if (chosen === "hero") {
    const [hero, ...rest] = images;
    return (
      <div className="nl-gallery nl-gallery-hero">
        <figure className="nl-fig nl-fig-hero">
          <SafeImage src={hero.src} alt={hero.alt} missing={hero.missing} className="nl-img" />
        </figure>
        {rest.length > 0 && (
          <div className={`nl-hero-rest nl-rest-${Math.min(rest.length, 4)}`}>
            {rest.slice(0, 4).map((img, i) => (
              <figure key={i} className="nl-fig">
                <SafeImage src={img.src} alt={img.alt} missing={img.missing} className="nl-img" />
              </figure>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (chosen === "strip") {
    return (
      <div className="nl-gallery nl-gallery-strip">
        {images.slice(0, 4).map((img, i) => (
          <figure key={i} className="nl-fig">
            <SafeImage src={img.src} alt={img.alt} missing={img.missing} className="nl-img" />
          </figure>
        ))}
      </div>
    );
  }

  if (chosen === "mosaic") {
    return (
      <div className="nl-gallery nl-gallery-mosaic">
        {images.map((img, i) => (
          <figure
            key={i}
            className={`nl-fig nl-mosaic-cell nl-mosaic-${i % 6} ratio-${img.ratio} ${
              img.featured ? "nl-featured" : ""
            }`}
          >
            <SafeImage src={img.src} alt={img.alt} missing={img.missing} className="nl-img" />
          </figure>
        ))}
      </div>
    );
  }

  // default grid
  return (
    <div className={`nl-gallery nl-gallery-grid cols-${Math.min(images.length, 3)}`}>
      {images.map((img, i) => (
        <figure
          key={i}
          className={`nl-fig ratio-${img.ratio} ${img.featured ? "nl-featured" : ""}`}
        >
          <SafeImage src={img.src} alt={img.alt} missing={img.missing} className="nl-img" />
        </figure>
      ))}
    </div>
  );
}

function pickAuto(images) {
  const n = images.length;
  const anyPortrait = images.some((i) => i.ratio === "portrait");
  const anyLandscape = images.some((i) => i.ratio === "landscape");

  if (n === 1) return "single";
  if (n >= 8) return anyPortrait ? "mosaic" : "grid";
  if (n >= 5) return anyPortrait ? "mosaic" : "hero";
  if (anyLandscape && anyPortrait) return "hero";
  if (n === 2 && anyLandscape) return "strip";
  return "grid";
}