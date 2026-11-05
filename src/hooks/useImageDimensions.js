import { useEffect, useState } from "react";

/**
 * Resolves each image's intrinsic aspect ratio from its declared w/h,
 * with a runtime probe as a fallback for missing files.
 * Returns an array of { ...img, ratio: "landscape" | "portrait" | "square", missing }
 */
export function useImageDimensions(images) {
  const [resolved, setResolved] = useState(() => images.map((i) => ({ ...i, ratio: classify(i), missing: false })));

  useEffect(() => {
    let cancelled = false;
    const next = images.map((img) => ({ ...img, ratio: classify(img), missing: false }));
    setResolved(next);

    next.forEach((img, idx) => {
      const probe = new Image();
      probe.onerror = () => {
        if (cancelled) return;
        setResolved((prev) => prev.map((p, i) => (i === idx ? { ...p, missing: true } : p)));
      };
      probe.src = img.src;
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  return resolved;
}

function classify({ w, h }) {
  if (!w || !h) return "square";
  const r = w / h;
  if (r >= 1.15) return "landscape";
  if (r <= 0.87) return "portrait";
  return "square";
}