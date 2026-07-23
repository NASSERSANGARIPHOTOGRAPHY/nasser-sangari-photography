"use client";

import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/gallery";
import { focusFor } from "@/config/site";

/**
 * The cinematic sequence: one photograph per screen, snapping as you scroll,
 * with a live counter and a progress rule. The interface gets out of the way
 * and the photographs do the talking.
 */
export function Showcase({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState(0);
  const frames = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = frames.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setActive(index);
          }
        }
      },
      // Fire when a frame owns the middle of the screen.
      { threshold: 0.55 },
    );

    frames.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <section
      aria-label="Featured photographs"
      className="relative snap-y snap-mandatory"
    >
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          ref={(el) => {
            frames.current[i] = el;
          }}
          className="relative h-[100svh] snap-start overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            // These fill the screen, so the browser needs one image pixel per
            // device pixel of screen width — 3024 of them on a retina laptop.
            // Offering both widths lets it take the big file only when the
            // screen can actually show it; phones stay on the small one.
            {...(photo.wide && photo.w && photo.wide.w > photo.w
              ? {
                  srcSet: `${photo.src} ${photo.w}w, ${photo.wide.src} ${photo.wide.w}w`,
                  sizes: "100vw",
                }
              : {})}
            alt={photo.alt}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            style={{ objectPosition: focusFor(photo.src) }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Veils kept tight and low-opacity: enough to hold the type, not so
              much that they haze the lower third of a dark photograph. */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/80 via-white/35 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-12 md:pb-10">
            <div className="mx-auto flex max-w-7xl items-end justify-between gap-8">
              <div>
                <p className="text-[0.62rem] font-semibold tracking-[0.3em] text-fg/60 uppercase">
                  {photo.category}
                </p>
                {photo.caption && (
                  <p className="mt-3 max-w-md text-[clamp(1.1rem,2.4vw,1.9rem)] leading-tight font-extralight tracking-tight">
                    {photo.caption}
                  </p>
                )}
              </div>

              <p className="shrink-0 text-[0.62rem] font-semibold tracking-[0.3em] tabular-nums">
                {String(i + 1).padStart(2, "0")}
                <span className="text-fg/40"> / {String(photos.length).padStart(2, "0")}</span>
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Progress rule, fixed at the foot of the sequence. */}
      <div
        aria-hidden="true"
        className="pointer-events-none sticky bottom-0 z-10 h-px w-full bg-fg/10"
      >
        <div
          className="h-px bg-fg transition-[width] duration-700 ease-out"
          style={{ width: `${((active + 1) / photos.length) * 100}%` }}
        />
      </div>
    </section>
  );
}
