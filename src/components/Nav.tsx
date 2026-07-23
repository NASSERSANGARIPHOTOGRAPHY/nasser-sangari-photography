"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/config/site";

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#film", label: "Film" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // At the top of the homepage the nav sits over the dark cover photograph,
  // so it has to invert or it simply disappears.
  const onCover = !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        onCover
          ? "border-b border-transparent text-white"
          : open
            ? // Fully opaque while the menu is open. Frosted glass over a photo
              // left the lower links sitting on a bride's white dress, and the
              // panel's bottom edge dissolved into the picture.
              "border-b border-line/60 bg-bg text-fg"
            : "border-b border-line/60 bg-bg/72 text-fg backdrop-blur-2xl backdrop-saturate-150"
      }`}
    >
      <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6 md:h-14">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 text-[0.78rem] font-semibold tracking-[0.24em] uppercase transition-opacity hover:opacity-70"
        >
          {/* The monogram, in both colourways at once. Swapping the src when
              the nav inverts would flash white on the first scroll; crossfading
              two already-loaded images never does. */}
          <span className="relative block h-[28px] w-[27px] shrink-0">
            {[
              { src: "/brand/monogram.png", shown: !onCover },
              { src: "/brand/monogram-white.png", shown: onCover },
            ].map((mark) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={mark.src}
                src={mark.src}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                  mark.shown ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </span>
          {site.name.toLowerCase()}
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-55"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className={`border px-5 py-2 text-[0.7rem] font-semibold tracking-[0.2em] uppercase transition-colors ${onCover ? "border-white text-white hover:bg-white hover:text-black" : "border-fg bg-fg text-bg hover:bg-transparent hover:text-fg"}`}
          >
            Book
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={`h-[1.5px] w-[17px] transition-transform duration-300 ${onCover ? "bg-white" : "bg-fg"} ${
              open ? "translate-y-[3.25px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-[17px] transition-transform duration-300 ${onCover ? "bg-white" : "bg-fg"} ${
              open ? "-translate-y-[3.25px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 px-6 pb-10 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-line/60 py-5 text-lg font-semibold tracking-[0.14em] uppercase"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-7 w-full"
          >
            Book a shoot
          </Link>
        </div>
      )}
    </header>
  );
}
