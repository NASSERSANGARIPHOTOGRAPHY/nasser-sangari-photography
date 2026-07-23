import Link from "next/link";
import { story } from "@/config/site";

/**
 * The About section: a portrait held against three short movements of the
 * story — hobby, training, life.
 *
 * The photograph is a night frame, so it reads best the way a print does:
 * hung on white, given room, and kept in view. On desktop it stays pinned
 * while the text scrolls past it, so you're looking at the person the whole
 * way through rather than at a picture that left the screen a paragraph ago.
 */
export function Story() {
  return (
    <section id="about" className="scroll-mt-16 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-24">
          {/* Portrait column. KEEP THE IMAGE SMALL. The source is a phone-sized
              original (1048px wide), so the displayed width has to stay well
              under a third of that once screen density is counted: a 3x phone
              asks for three device pixels per CSS pixel, and the moment it asks
              for more than the file holds the browser stretches it and it goes
              soft. At 190/220px it is always downscaled, which reads sharp.

              The column is sized to the photograph and carries the byline
              underneath it, so it reads as a considered plate rather than a
              small picture stranded in a wide empty column. */}
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[3/4] max-w-[190px] overflow-hidden sm:max-w-[220px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.portrait}
                alt={story.portraitAlt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            {story.portraitCaption && (
              <p className="mt-5 max-w-[240px] text-sm leading-relaxed font-light text-fg-dim">
                {story.portraitCaption}
              </p>
            )}

            <div className="mt-7 max-w-[240px] border-t border-line pt-5">
              <p className="text-[0.62rem] font-semibold tracking-[0.28em] uppercase">
                {story.signature}
              </p>
              {story.signatureRole && (
                <p className="mt-2 text-sm font-light text-fg-dim">{story.signatureRole}</p>
              )}
            </div>
          </div>

          {/* Story. */}
          <div>
            <p className="eyebrow reveal">{story.eyebrow}</p>

            <h2 className="statement reveal mt-6 !text-[clamp(1.75rem,3.4vw,3rem)]">
              {story.headline}
            </h2>

            <ol className="mt-12 md:mt-14">
              {story.chapters.map((chapter, i) => (
                <li
                  key={chapter.label}
                  className="reveal border-t border-line py-8 md:py-10"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="text-xs tracking-[0.2em] text-fg-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.62rem] font-semibold tracking-[0.3em] text-fg-dim uppercase">
                      {chapter.label}
                    </span>
                  </div>
                  <p className="mt-5 text-[1.02rem] leading-[1.95] font-light">
                    {chapter.text}
                  </p>
                </li>
              ))}
            </ol>

            {/* The byline lives under the portrait; this closes on the offer. */}
            <div className="reveal border-t border-line pt-10">
              <p className="max-w-2xl text-[clamp(1.2rem,2.1vw,1.6rem)] leading-[1.5] font-light tracking-[-0.015em]">
                {story.closing}
              </p>
              <Link href="/book" className="link-line mt-8 inline-block">
                Check your date
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
