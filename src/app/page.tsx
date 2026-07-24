import { Suspense } from "react";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Showcase } from "@/components/Showcase";
import { CategorySection } from "@/components/CategorySection";
import { Gallery } from "@/components/Gallery";
import { Socials } from "@/components/Socials";
import { Videos } from "@/components/Videos";
import { Story } from "@/components/Story";
import { getGallery, getCategories, getFeatured, type Photo } from "@/lib/gallery";
import { getFilms } from "@/lib/videos";
import { site, packages, process, reasons, testimonials } from "@/config/site";

const SHELL = "mx-auto max-w-6xl px-6";

export default async function Home() {
  const films = await getFilms();
  const { photos, isPlaceholder } = getGallery();
  const categories = getCategories(photos);

  const featured = getFeatured(photos, site.featured);

  const key = (s: string) => (s.split("/").pop() ?? "").replace(/\.[^.]+$/, "").toLowerCase();
  const cover = photos.find((p) => key(p.src) === key(site.coverImage)) ?? featured[0];

  // The two flagship categories get their own homepage sections.
  const byCategory = (name: string) => photos.filter((p) => p.category === name);
  const weddings = byCategory("Weddings");
  const food = byCategory("Food");

  /** An evenly-spaced pick, so a section isn't five frames from one shoot. */
  const spread = (list: Photo[], n: number) => {
    if (list.length <= n) return list;
    const stride = Math.floor(list.length / n);
    return Array.from({ length: n }, (_, i) => list[i * stride]);
  };

  // Two deliberate frames for the Photography / Film split: a still portrait
  // for Photography, a live-performance frame for Film. Chosen by filename so
  // the panels never fall back to a stray church or drinks shot.
  const byFile = (file: string) =>
    photos.find((p) => key(p.src) === key(file))?.src;
  const splitImages = [byFile("DSC08536.jpg"), byFile("NAS00273.jpg")];

  return (
    <>
      <Hero image={cover?.src} width={cover?.w} wide={cover?.wide} />
      <Showcase photos={featured} />

      {/* ── Who I am ─────────────────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className={`${SHELL} max-w-4xl text-center`}>
          <p className="eyebrow reveal">Who I am</p>

          <h2 className="statement reveal mt-7 !text-[clamp(1.6rem,3.6vw,2.9rem)]">
            Shot, cut and posted
          </h2>

          <p className="body-lg reveal mt-9 !text-[clamp(1.05rem,1.9vw,1.4rem)] !leading-[1.7] !font-light !text-fg">
            {site.intro}
          </p>

          {/* The four things, stated plainly. */}
          <ul className="reveal mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: "Events", detail: "Weddings, launches, corporate nights" },
              { name: "Food", detail: "Menus, hero dishes, interiors" },
              { name: "Film", detail: "Highlight edits and vertical reels" },
              { name: "Drone", detail: "Aerial stills and video" },
              { name: "Social", detail: "Planned, captioned, posted" },
            ].map((item) => (
              <li key={item.name} className="bg-bg px-6 py-8">
                <p className="headline !text-[1rem]">{item.name}</p>
                <p className="mt-2.5 text-sm leading-relaxed font-light text-fg-dim">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Weddings ─────────────────────────────────────── */}
      <CategorySection
        id="weddings"
        title="Weddings"
        blurb="Ceremony, reception and every quiet moment between. Shot the way the day actually felt, not the way a checklist says it should."
        photos={spread(weddings, 5)}
        total={weddings.length}
      />

      {/* ── Food ─────────────────────────────────────────── */}
      <CategorySection
        id="food"
        title="Food"
        blurb="Menus, hero dishes, drinks and desserts, lit to make people hungry and licensed for anywhere you need them."
        photos={spread(food, 5)}
        total={food.length}
        reverse
      />

      {/* ── Photography / Film ───────────────────────────── */}
      <section className="grid md:grid-cols-2">
        {[
          {
            title: "Photography",
            copy: "Stills that hold the room. The toast, the plate, the face mid-laugh.",
            href: "/#work",
            cta: "View photography",
            image: splitImages[0],
          },
          {
            title: "Film",
            copy: "Motion for events and menus. Highlight films and vertical cutdowns, ready to post.",
            href: "/#film",
            cta: "Watch the films",
            image: splitImages[1],
          },
        ].map((panel) => (
          <Link
            key={panel.title}
            href={panel.href}
            className="reveal group relative flex min-h-[62svh] items-end overflow-hidden"
          >
            {panel.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={panel.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            )}
            {/* A scrim, not a wash: darkening from the bottom keeps the
                photograph intact and gives the type real contrast. A flat
                white veil over the whole frame just made both look faded. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 transition-opacity duration-700 group-hover:opacity-85" />
            <div className="relative w-full p-10 md:p-14">
              <h2 className="statement !text-[clamp(2rem,4vw,3.25rem)] text-white">
                {panel.title}
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed font-light text-white/75">
                {panel.copy}
              </p>
              <span className="link-line mt-7 inline-block text-white">{panel.cta}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* ── Film ─────────────────────────────────────────── */}
      <Videos films={films} channel={site.socials.youtube} />

      {/* ── Services ─────────────────────────────────────── */}
      <section id="services" className="scroll-mt-16 bg-bg-alt py-24 md:py-32">
        <div className={SHELL}>
          <div className="reveal mb-16 text-center">
            <p className="eyebrow">What I cover</p>
            <h2 className="headline mt-5">Browse by</h2>
          </div>

          <div className="grid gap-px bg-line sm:grid-cols-2">
            {packages.map((pkg, i) => (
              <a
                key={pkg.id}
                href={`mailto:${site.email}?subject=${encodeURIComponent(`${pkg.name} enquiry`)}`}
                // An odd number of packages would leave the last card orphaned
                // beside an empty cell; let it run the full width instead.
                className={`reveal group flex flex-col bg-bg p-9 transition-colors duration-500 hover:bg-fg md:p-12 ${
                  packages.length % 2 === 1 && i === packages.length - 1
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                <h3 className="headline !text-[1.35rem] transition-colors duration-500 group-hover:text-bg">
                  {pkg.name}
                </h3>
                <p className="mt-2 text-xs tracking-[0.14em] text-fg-dim uppercase transition-colors duration-500 group-hover:text-bg/60">
                  {pkg.duration} · {pkg.price}
                </p>
                <p className="mt-6 flex-1 text-sm leading-relaxed font-light text-fg-dim transition-colors duration-500 group-hover:text-bg/80">
                  {pkg.blurb}
                </p>
                <span className="link-line mt-8 self-start transition-colors duration-500 group-hover:text-bg">
                  Enquire
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Work ─────────────────────────────────────────── */}
      <section id="work" className="scroll-mt-16 py-24 md:py-32">
        <div className={SHELL}>
          <div className="reveal mb-14 text-center">
            <p className="eyebrow">Portfolio</p>
            <h2 className="headline mt-5">Recent work</h2>
            <p className="body-lg mx-auto mt-6 max-w-md">
              Tap any frame to open it. {photos.length} photographs and counting.
            </p>
          </div>

          {isPlaceholder && (
            <div className="reveal mx-auto mb-10 max-w-xl bg-bg-alt px-6 py-4 text-center text-sm text-fg-dim">
              Placeholder images. Drop photos into{" "}
              <code className="text-fg">public/gallery/</code> to replace them.
            </div>
          )}

          {/* Gallery reads the ?c= filter from the URL, so it needs a boundary. */}
          <Suspense fallback={null}>
            <Gallery photos={photos} categories={categories} />
          </Suspense>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────── */}
      <section className="bg-bg-alt py-24 md:py-32">
        <div className={SHELL}>
          <div className="reveal mb-16 text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="headline mt-5">Our process</h2>
          </div>

          <ol className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
            {process.map((item, i) => (
              <li key={item.step} className="reveal bg-bg p-8">
                <span className="text-xs tracking-[0.2em] text-fg-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="headline mt-4 !text-[1.05rem]">{item.step}</h3>
                <p className="mt-3 text-sm leading-relaxed font-light text-fg-dim">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── About: the story ─────────────────────────────── */}
      <Story />

      {/* ── Why book — the closing argument of the story ─── */}
      <section className="pb-24 md:pb-32">
        <div className={SHELL}>
          {/* items-center: the heading is four lines against a six-item list,
              so aligning both to the top left the whole left column looking
              abandoned below the icons. */}
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="reveal">
              <p className="eyebrow">Why hire me</p>
              <h2 className="headline mt-5">
                One visit,
                <br />
                the whole job
              </h2>
              <Socials className="mt-10" />
            </div>

            <ul className="reveal divide-y divide-line border-y border-line">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-5 py-5">
                  <span aria-hidden="true" className="text-fg-dim">
                    —
                  </span>
                  <span className="text-sm leading-relaxed font-light">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Kind words — hidden until real quotes exist ──── */}
      {testimonials.length > 0 && (
        <section className="bg-bg-alt py-24 md:py-32">
          <div className={SHELL}>
            <div className="reveal mb-16 text-center">
              <p className="eyebrow">Testimonials</p>
              <h2 className="headline mt-5">Kind words</h2>
            </div>
            <div className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.name} className="reveal bg-bg p-9">
                  <blockquote className="text-sm leading-[1.9] font-light">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-7 text-xs tracking-[0.16em] text-fg-dim uppercase">
                    {t.name} · {t.context}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Closing ──────────────────────────────────────── */}
      <section className="py-28 md:py-40">
        <div className={`${SHELL} reveal max-w-3xl text-center`}>
          <p className="eyebrow">Available for commissions</p>
          <h2 className="statement mt-7">Let&apos;s talk about your date</h2>
          <p className="body-lg mx-auto mt-8 max-w-md">
            Tell me the date and what you need covered. You&apos;ll hear back within one
            business day.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              Email me
            </a>
            <a
              href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
              className="btn btn-secondary"
            >
              Call me
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
