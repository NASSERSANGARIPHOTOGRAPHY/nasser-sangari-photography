"use client";

import { useState } from "react";
import type { Film } from "@/lib/videos";

/**
 * A YouTube card that stays a still image until it's clicked.
 *
 * Nothing is loaded from YouTube on page load — seven embedded players would
 * pull in megabytes of third-party script before anyone presses play. The
 * thumbnail is a plain image; the real player only mounts on click.
 */
function VideoCard({ film, lead = false }: { film: Film; lead?: boolean }) {
  const [playing, setPlaying] = useState(false);

  const caption = (
    <div className="mt-5">
      <p className="text-[0.6rem] font-semibold tracking-[0.3em] text-white/40 uppercase">
        {film.kind}
      </p>
      <h3
        className={`mt-2.5 font-light text-white ${
          lead
            ? "text-[clamp(1.3rem,2.2vw,1.75rem)] tracking-[-0.02em]"
            : "text-[0.95rem] leading-snug"
        }`}
      >
        {film.title}
      </h3>
    </div>
  );

  if (playing) {
    return (
      <div className="reveal">
        <div className="relative aspect-video overflow-hidden bg-black">
          <iframe
            // nocookie host, and autoplay because the click *was* the play press.
            src={`https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&rel=0&modestbranding=1`}
            title={film.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        {caption}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${film.title}`}
      className="reveal group block w-full cursor-pointer text-left"
    >
      <div className="relative aspect-video overflow-hidden bg-white/[0.04]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={film.thumb}
          alt=""
          aria-hidden="true"
          loading="lazy"
          // The scale nudge hides the hairline seam some thumbnails carry.
          className="h-full w-full scale-[1.005] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />

        {/* Play mark. */}
        <span
          className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/20 text-white backdrop-blur-[2px] transition-all duration-500 group-hover:scale-110 group-hover:border-white group-hover:bg-white group-hover:text-black ${
            lead ? "h-[4.5rem] w-[4.5rem] md:h-24 md:w-24" : "h-14 w-14"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={lead ? "ml-1 h-6 w-6 md:h-8 md:w-8" : "ml-0.5 h-5 w-5"}
            aria-hidden="true"
          >
            <path d="M8 5.2v13.6L19 12 8 5.2z" />
          </svg>
        </span>
      </div>

      {caption}
    </button>
  );
}

/**
 * The film section.
 *
 * Deliberately the one dark band on the page: film is watched in the dark, and
 * after four white-and-grey sections the page needs the break. Fed entirely by
 * `videos` in the site config — empty list, no section.
 */
export function Videos({ films, channel }: { films: Film[]; channel: string }) {
  if (films.length === 0) return null;

  const [lead, ...rest] = films;

  return (
    <section id="film" className="scroll-mt-16 bg-[#0b0b0b] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-white/12 pb-8 md:mb-16">
          <div>
            <p className="text-[0.62rem] font-semibold tracking-[0.3em] text-white/40 uppercase">
              {films.length} films
            </p>
            <h2 className="statement mt-4 text-white">Film</h2>
          </div>
          <div className="max-w-xs">
            <p className="text-sm leading-[1.85] font-light text-white/55">
              Weddings, restaurants, concerts and short films, shot, cut and graded
              in house. Press play on any of them.
            </p>
            {channel && (
              <a
                href={channel}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line mt-6 inline-block text-white"
              >
                Watch on YouTube
              </a>
            )}
          </div>
        </div>

        <VideoCard film={lead} lead />

        {rest.length > 0 && (
          <div className="mt-14 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((film) => (
              <VideoCard key={film.id} film={film} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
