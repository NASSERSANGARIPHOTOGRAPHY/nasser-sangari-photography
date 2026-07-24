import Link from "next/link";
import { site } from "@/config/site";

export const metadata = {
  title: `Page not found · ${site.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}`,
};

/**
 * A dead link is still a first impression. Next's stock 404 is a bare line of
 * system text on black, which reads like the site fell over; this one stays in
 * the site's own voice and gives the visitor somewhere to go.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[78svh] items-center py-24">
      <div className="mx-auto w-full max-w-2xl px-6 text-center">
        <p className="eyebrow">Error 404</p>

        <h1 className="statement mt-7 !text-[clamp(1.9rem,4.4vw,3.4rem)]">
          This page isn&apos;t here
        </h1>

        <p className="body-lg mx-auto mt-8 max-w-md">
          The link may be old, or the address slightly off. The work is all still
          where it should be.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/#work" className="btn btn-primary">
            View the portfolio
          </Link>
          <a href={`mailto:${site.email}`} className="btn btn-secondary">
            Enquire about a shoot
          </a>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="text-sm font-light text-fg-dim">
            Looking for something specific?{" "}
            <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">
              Email me
            </a>{" "}
            and I&apos;ll send you straight to it.
          </p>
        </div>
      </div>
    </section>
  );
}
