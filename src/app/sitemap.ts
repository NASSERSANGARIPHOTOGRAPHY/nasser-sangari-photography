import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * The two public pages. Google can find everything else by following links
 * from the homepage, and /admin is deliberately left out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (site.url || "").replace(/\/$/, "");
  if (!base) return [];

  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/book`, changeFrequency: "yearly", priority: 0.8 },
  ];
}
