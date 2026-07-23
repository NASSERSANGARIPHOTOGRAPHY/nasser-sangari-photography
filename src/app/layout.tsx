import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { site } from "@/config/site";
import { getGallery } from "@/lib/gallery";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import "./globals.css";

/** Poppins — the geometric sans used by the reference site. */
const sans = Poppins({
  variable: "--font-sans-stack",
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"],
});

// Title-case the display name; skip the suffix if it just repeats "photography".
const fullName = [site.name, site.suffix]
  .filter(Boolean)
  .join(" ")
  .toLowerCase()
  .replace(/\b\w/g, (c) => c.toUpperCase());

const pageTitle = /photograph/i.test(fullName) ? fullName : `${fullName} — Photography`;

// The share card. Without an image, a link pasted into WhatsApp, Messenger or
// a Slack DM previews as a blank rectangle — a bad first impression for a
// photographer. Reuse the cover photograph.
const key = (s: string) => (s.split("/").pop() ?? "").replace(/\.[^.]+$/, "").toLowerCase();
const shareImage =
  getGallery().photos.find((p) => key(p.src) === key(site.coverImage))?.src;

// A one-line summary reads better in search results and link previews than the
// full pitch, which gets truncated mid-sentence.
const summary = `${site.tagline} Fifteen years behind the camera, with stills and film from the same visit.`;

/**
 * Share cards need an absolute image URL — a relative one previews as blank.
 * Prefer the domain set in the site config; otherwise take the one the host
 * hands us, so a deploy is correct before anyone remembers to fill it in.
 */
const deployed = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const origin = site.url || (deployed ? `https://${deployed}` : "");

export const metadata: Metadata = {
  title: pageTitle,
  description: summary,
  ...(origin ? { metadataBase: new URL(origin) } : {}),
  alternates: origin ? { canonical: "/" } : undefined,
  openGraph: {
    title: pageTitle,
    description: summary,
    type: "website",
    siteName: fullName,
    locale: "en_US",
    ...(shareImage ? { images: [{ url: shareImage, alt: fullName }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: summary,
    ...(shareImage ? { images: [shareImage] } : {}),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below adds a `js` class to
    // <html> before React hydrates, which React would otherwise flag as a
    // mismatch. The difference is deliberate and only ever additive.
    <html
      lang="en"
      className={`${sans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-bg text-fg">
        {/*
          Enables the scroll-reveal animation, and guarantees it can never hide
          the site permanently: if the app hasn't hydrated within 3 seconds — a
          broken bundle, a slow phone, a JS error — the class is dropped and
          everything becomes visible. Photographs must survive a script failure.
          Must live inside <body>; a <script> child of <html> breaks hydration.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');setTimeout(function(){if(!document.documentElement.dataset.hydrated){document.documentElement.classList.remove('js')}},3000)`,
          }}
        />
        <Reveal />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
