import Link from "next/link";
import type { Photo } from "@/lib/gallery";
import { focusFor } from "@/config/site";

/**
 * A flagship category on the homepage — a title, a short line, and an
 * asymmetric spread of frames. Deliberately not a uniform grid: unequal
 * sizes read as curated rather than dumped.
 */
export function CategorySection({
  id,
  title,
  blurb,
  photos,
  total,
  reverse = false,
}: {
  id: string;
  title: string;
  blurb: string;
  photos: Photo[];
  total: number;
  reverse?: boolean;
}) {
  if (photos.length === 0) return null;

  const [lead, ...rest] = photos;

  return (
    <section id={id} className="scroll-mt-16 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <p className="text-[0.62rem] font-semibold tracking-[0.3em] text-fg-dim uppercase">
              {total} photographs
            </p>
            <h2 className="statement mt-4">{title}</h2>
          </div>
          <div className="max-w-xs">
            <p className="text-sm leading-[1.85] font-light text-fg-dim">{blurb}</p>
            <Link
              href={`/?c=${encodeURIComponent(title)}#work`}
              className="link-line mt-6 inline-block"
            >
              View all {title.toLowerCase()}
            </Link>
          </div>
        </div>

        <div
          className={`grid gap-3 md:grid-cols-2 ${reverse ? "md:[direction:rtl] md:[&>*]:[direction:ltr]" : ""}`}
        >
          {/* Lead frame, tall. */}
          <Link
            href={`/?c=${encodeURIComponent(title)}#work`}
            className="reveal group relative block aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[70svh]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lead.src}
              alt={lead.alt}
              loading="lazy"
              style={{ objectPosition: focusFor(lead.src) }}
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
            />
          </Link>

          {/* Four supporting frames. */}
          <div className="grid grid-cols-2 gap-3">
            {rest.slice(0, 4).map((photo) => (
              <Link
                key={photo.src}
                href={`/?c=${encodeURIComponent(title)}#work`}
                // 4:5 rather than square — most of these are portrait frames,
                // and a square crop lops off heads and plated food alike.
                className="reveal group relative block aspect-[4/5] overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  style={{ objectPosition: focusFor(photo.src) }}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
