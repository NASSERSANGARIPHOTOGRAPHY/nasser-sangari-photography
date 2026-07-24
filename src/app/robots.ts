import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Keeps the booking list out of search results; lets everything else in. */
export default function robots(): MetadataRoute.Robots {
  const base = (site.url || "").replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
