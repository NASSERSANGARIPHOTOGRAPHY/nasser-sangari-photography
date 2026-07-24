import Link from "next/link";
import { site, focusFor } from "@/config/site";

/**
 * The cover. A single photograph filling the screen, type laid over it.
 * A photographer's site should open with a photograph, not a paragraph.
 */
export function Hero({
  image,
  width,
  wide,
}: {
  image?: string;
  width?: number;
  wide?: { src: string; w: number };
}) {
  return (
    <section className="relative flex h-[100svh] flex-col justify-end overflow-hidden">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          // The first thing anyone sees, at full screen. Same reasoning as the
          // sequence below it: offer both widths and let the device choose.
          {...(wide && width && wide.w > width
            ? { srcSet: `${image} ${width}w, ${wide.src} ${wide.w}w`, sizes: "100vw" }
            : {})}
          alt="Wedding photography by Nasser Sangari"
          fetchPriority="high"
          style={{ objectPosition: focusFor(image) }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Scrims: darken top for the nav, bottom for the headline. The middle
          of the frame — where the couple is — stays untouched. */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="relative px-6 pb-16 md:px-12 md:pb-20">
        <div className="mx-auto w-full max-w-7xl">
          <p className="reveal text-[0.62rem] font-semibold tracking-[0.34em] text-white/70 uppercase">
            {site.location}
          </p>

          <h1 className="reveal mt-6 max-w-4xl text-[clamp(2.2rem,6.5vw,5.5rem)] leading-[1.02] font-extralight tracking-[-0.035em] text-white">
            {site.headline}
          </h1>

          <div className="mt-10 flex flex-col gap-8 border-t border-white/25 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="reveal max-w-sm text-sm leading-[1.8] font-light text-white/75">
              {site.tagline}
            </p>

            <div className="reveal flex flex-wrap items-center gap-9">
              <a href={`mailto:${site.email}`} className="link-line text-white">
                Enquire now
              </a>
              <Link href="/#work" className="link-line text-white/70 hover:text-white">
                Full portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
