import Link from "next/link";
import { site } from "@/config/site";
import { Socials } from "@/components/Socials";

const COLUMNS = [
  {
    heading: "Work",
    links: [
      { href: "/#work", label: "Portfolio" },
      { href: "/#film", label: "Film" },
      { href: "/#services", label: "Services" },
      { href: "/#about", label: "About" },
    ],
  },
  {
    heading: "Book",
    links: [
      { href: "/book", label: "Reserve a date" },
      { href: "/book?package=events", label: "Events" },
      { href: "/book?package=food", label: "Food & restaurants" },
      { href: "/book?package=video", label: "Video & motion" },
      { href: "/book?package=drone", label: "Drone & aerial" },
      { href: "/book?package=social", label: "Social media" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-bg-alt">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            {/* The full lockup exactly as drawn: mark, name, "Photography".
                The header carries the compact mark-and-name version; the
                footer is where the identity is stated in full. Sized so the
                "Photography" line stays readable. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.png"
              alt={`${site.name} ${site.suffix}`.trim()}
              width={900}
              height={621}
              loading="lazy"
              className="h-auto w-[168px]"
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-fg-dim">
              {site.tagline}
            </p>
            <Socials className="mt-6" />
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-fg-dim uppercase">{column.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-fg-dim transition-colors hover:text-fg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-7">
          <div className="flex flex-col gap-2 text-xs text-fg-dim sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()}{" "}
              {site.name.toLowerCase()}
              {site.suffix ? ` ${site.suffix.toLowerCase()}` : ""}. All rights reserved.
            </p>
            <p className="flex flex-wrap gap-x-4">
              <a href={`mailto:${site.email}`} className="hover:text-fg">
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                className="hover:text-fg"
              >
                {site.phone}
              </a>
              <span>{site.location}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
