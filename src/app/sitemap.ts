import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** One page. Everything on the site is a section of it. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (site.url || "").replace(/\/$/, "");
  if (!base) return [];

  return [{ url: `${base}/`, changeFrequency: "monthly", priority: 1 }];
}
