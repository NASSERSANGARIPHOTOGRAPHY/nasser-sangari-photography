"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Photo } from "@/lib/gallery";
import { focusFor } from "@/config/site";

/** How many frames load before the visitor asks for more. */
const INITIAL = 24;
const STEP = 24;

export function Gallery({
  photos,
  categories,
}: {
  photos: Photo[];
  categories: string[];
}) {
  // A "View all weddings" link arrives as /?c=Weddings#work — open on that filter.
  const requested = useSearchParams().get("c");
  const initial =
    categories.find((c) => c.toLowerCase() === requested?.toLowerCase()) ??
    categories[0] ??
    "All";

  const [active, setActive] = useState(initial);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [limit, setLimit] = useState(INITIAL);

  // Following another category link while already on the page must re-filter.
  // Adjusting during render (rather than in an effect) avoids a wasted paint
  // showing the previous category.
  const [lastRequested, setLastRequested] = useState(requested);
  if (requested !== lastRequested) {
    setLastRequested(requested);
    setActive(initial);
    setLimit(INITIAL);
  }

  const showFilters = categories.length > 1;

  const visible = useMemo(
    () => (active === "All" ? photos : photos.filter((p) => p.category === active)),
    [photos, active],
  );

  const shown = visible.slice(0, limit);

  const step = useCallback(
    (delta: number) =>
      setLightbox((i) => (i === null ? null : (i + delta + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, step]);

  const current = lightbox === null ? null : visible[lightbox];

  return (
    <>
      {showFilters && (
        <div className="reveal mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActive(category);
                setLightbox(null);
                setLimit(INITIAL);
              }}
              className={`px-5 py-2 text-[0.68rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 ${
                active === category
                  ? "bg-fg text-bg"
                  : "border border-line text-fg-dim hover:border-fg hover:text-fg"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* An even grid — uniform tiles read calmer than a ragged masonry wall. */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setLightbox(i)}
            className="group relative aspect-square overflow-hidden bg-bg-alt outline-offset-4 focus-visible:outline-2 focus-visible:outline-fg"
            aria-label={`Open photograph ${i + 1}${photo.caption ? `: ${photo.caption}` : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              // All lazy. The portfolio sits thousands of pixels below the
              // fold, so eager-loading the first tiles pulled ~5MB of
              // photographs before the visitor had scrolled past the cover.
              // Browsers begin fetching lazy images well before they appear.
              loading="lazy"
              decoding="async"
              style={{ objectPosition: focusFor(photo.src) }}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          </button>
        ))}
      </div>

      {visible.length > limit && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + STEP)}
            className="btn btn-secondary"
          >
            Load more
          </button>
          <p className="mt-4 text-sm text-fg-dim">
            Showing {shown.length} of {visible.length}
          </p>
        </div>
      )}

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-xl"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute top-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white transition-colors hover:bg-white/20"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photograph"
            className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/20 md:left-8"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photograph"
            className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/20 md:right-8"
          >
            ›
          </button>

          <figure
            className="w-full max-w-6xl px-14 md:px-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              className="mx-auto max-h-[80svh] w-auto object-contain"
            />
            <figcaption className="mt-4 text-center text-sm text-white/60">
              {current.caption ? `${current.caption} · ` : ""}
              {(lightbox ?? 0) + 1} of {visible.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
