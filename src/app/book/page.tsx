import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { Socials } from "@/components/Socials";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `Book a shoot · ${site.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}`,
  description: `Reserve a date. ${site.tagline}`,
};

export default function BookPage() {
  return (
    <section className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="reveal mb-14 text-center">
          <p className="eyebrow">Booking</p>
          <h1 className="statement mt-4">Book a shoot.</h1>
          <p className="body-lg mx-auto mt-6 max-w-lg">
            Takes a minute. I&apos;ll confirm availability within one business day.
          </p>
        </div>

        <div className="reveal">
          <Suspense fallback={<p className="text-center text-fg-dim">Loading…</p>}>
            <BookingForm />
          </Suspense>
        </div>

        <div className="reveal mt-20 bg-bg-alt px-8 py-12 text-center">
          <h2 className="headline !text-[1.2rem]">
            Rather talk it through?
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
              className="btn btn-secondary"
            >
              {site.phone}
            </a>
          </div>
          <div className="mt-8 flex justify-center">
            <Socials />
          </div>
        </div>
      </div>
    </section>
  );
}
