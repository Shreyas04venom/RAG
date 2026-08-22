import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Camera,
  Maximize2,
  X,
  Sparkles,
} from "lucide-react";
import type { ConceptImage } from "@/lib/rag.types";

interface ConceptImageGalleryProps {
  images?: ConceptImage[];
  title?: string;
}

export function ConceptImageGallery({ images = [], title = "" }: ConceptImageGalleryProps) {
  // If no curated images exist for this query, do not render any gallery (clean text-only response for basic queries)
  if (!images || images.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [fullscreenModal, setFullscreenModal] = React.useState(false);
  const [loadedImages, setLoadedImages] = React.useState<Record<string, boolean>>({});

  // Reset index when images change
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const current = images[currentIndex] || images[0];
  if (!current) return null;

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  // Keyboard navigation for carousel and lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape" && fullscreenModal) setFullscreenModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenModal, images.length]);

  return (
    <div className="space-y-3 pt-2">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-1.5">
          <Camera className="h-3.5 w-3.5 text-cyan-400" />
          Verified Visual Evidence ({currentIndex + 1} of {images.length} Curated Perspectives)
        </span>

        <div className="flex items-center gap-2">
          {current.photographer && (
            <span className="text-[10px] text-muted-foreground hidden sm:flex items-center gap-1">
              <span>Photo by</span>
              <span className="font-semibold text-white">{current.photographer}</span>
            </span>
          )}
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-400">
            Pexels Grounded
          </span>
        </div>
      </div>

      {/* Main Visual Box */}
      <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[#060918] shadow-2xl min-h-[16rem] md:min-h-[22rem] flex items-center justify-center p-2">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-[80px]" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/15 blur-[80px]" />

        {/* Hero Photo Viewport */}
        <div className="relative h-full w-full flex items-center justify-center">
          <img
            key={current.url}
            src={current.url}
            alt={current.alt || current.caption}
            onLoad={() => setLoadedImages((prev) => ({ ...prev, [current.url]: true }))}
            className={`h-64 md:h-[22rem] w-full object-cover md:object-contain rounded-xl select-none transition-all duration-500 cursor-pointer ${
              loadedImages[current.url] ? "opacity-100 scale-100" : "opacity-40 scale-95 blur-sm"
            }`}
            onClick={() => setFullscreenModal(true)}
            loading="eager"
          />

          {/* Fullscreen Expand Icon on Hover */}
          <button
            onClick={() => setFullscreenModal(true)}
            title="Expand to Fullscreen"
            className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/75 border border-white/15 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer z-20 shadow-lg"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/85 border border-white/20 text-white backdrop-blur-md transition-all opacity-85 hover:opacity-100 hover:scale-110 hover:bg-black cursor-pointer z-20 shadow-xl"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/85 border border-white/20 text-white backdrop-blur-md transition-all opacity-85 hover:opacity-100 hover:scale-110 hover:bg-black cursor-pointer z-20 shadow-xl"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Bottom Floating Caption & Attribution */}
          <div className="absolute bottom-3 inset-x-3 flex flex-col md:flex-row md:items-center justify-between gap-2 z-20 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 backdrop-blur-md bg-black/85 px-4 py-2 rounded-full border border-white/15 shadow-xl max-w-xl">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="text-xs font-semibold text-white line-clamp-1">
                {current.alt || current.caption}
              </span>
              {current.sourceUrl && (
                <a
                  href={current.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="View on Pexels"
                  className="text-[10px] text-cyan-300 hover:text-white flex items-center gap-0.5 ml-1 transition-colors shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Carousel Dot Indicators */}
            {images.length > 1 && (
              <div className="pointer-events-auto flex items-center gap-1.5 backdrop-blur-md bg-black/80 px-3.5 py-2 rounded-full border border-white/15 self-start md:self-auto shadow-lg">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === currentIndex ? "w-6 bg-gradient-to-r from-primary to-accent" : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Strip for Multi-Image Collections */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {images.map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={img.url + idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 overflow-hidden rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-accent ring-2 ring-accent/50 scale-105"
                    : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="h-12 w-20 object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setFullscreenModal(false)} />

          <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-4">
            {/* Top Close Button */}
            <div className="flex items-center justify-between w-full text-white px-2">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-semibold">{current.alt || current.caption}</span>
              </div>
              <button
                onClick={() => setFullscreenModal(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close fullscreen view"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Large Modal Image */}
            <div className="relative w-full max-h-[75vh] flex items-center justify-center">
              <img
                src={current.url}
                alt={current.alt || current.caption}
                className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/15"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-black/80 text-white border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-black/80 text-white border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Attribution Bar */}
            <div className="flex items-center justify-between w-full text-xs text-muted-foreground px-2">
              <span>
                {current.photographer ? `Photographer: ${current.photographer}` : "Verified Authentic Visual"}
              </span>
              {current.sourceUrl && (
                <a
                  href={current.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:text-white transition-colors"
                >
                  Inspect Source on Pexels <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
