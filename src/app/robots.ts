import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Everything on this site is public; let the crawlers have all of it. */
export default function robots(): MetadataRoute.Robots {
  const base = (site.url || "").replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
