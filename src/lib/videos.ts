import { videos } from "@/config/site";

export type Film = {
  id: string;
  title: string;
  kind: string;
  /** The sharpest thumbnail YouTube actually holds for this video. */
  thumb: string;
};

const thumbUrl = (id: string, size: string) =>
  `https://i.ytimg.com/vi/${id}/${size}.jpg`;

/**
 * YouTube only generates the large thumbnails for some uploads. Ask for one it
 * doesn't have and it answers 404 — but with a decodable 120×90 grey "no
 * thumbnail" JPEG in the body, which a browser renders happily without ever
 * firing an error. Guessing in the browser therefore leaves grey boxes on the
 * page, and probing there floods the console with 404s.
 *
 * So the guessing happens here, on the server, once per build: ask for the big
 * ones, keep the first that really exists, and fall back to `hqdefault` — the
 * one size YouTube always generates. The browser is handed a URL that works.
 */
async function bestThumb(id: string): Promise<string> {
  for (const size of ["maxresdefault", "sddefault"]) {
    const url = thumbUrl(id, size);
    try {
      const res = await fetch(url, {
        method: "HEAD",
        next: { revalidate: 86400 },
      });
      if (res.ok) return url;
    } catch {
      // Offline build, DNS failure, YouTube down — hqdefault still renders.
      break;
    }
  }
  return thumbUrl(id, "hqdefault");
}

/** The configured films, each with a thumbnail URL known to resolve. */
export async function getFilms(): Promise<Film[]> {
  return Promise.all(
    videos.map(async (video) => ({ ...video, thumb: await bestThumb(video.id) })),
  );
}
