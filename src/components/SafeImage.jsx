import { ImageOff } from "lucide-react";

export default function SafeImage({ src, alt, className, style, missing }) {
  if (missing) {
    return (
      <div
        className={`flex items-center justify-center bg-ivory text-charcoal/40 ${className || ""}`}
        style={style}
      >
        <ImageOff className="w-6 h-6" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      draggable={false}
    />
  );
}