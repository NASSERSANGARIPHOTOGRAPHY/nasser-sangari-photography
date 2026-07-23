import fs from "node:fs";
import path from "node:path";

export type Photo = {
  src: string;
  category: string;
  /** Always present — used for screen readers. */
  alt: string;
  /** Only set when the filename is actually meaningful. Printed on the wall card. */
  caption?: string;
  /** Real pixel dimensions, so the layout can reserve space before loading. */
  w?: number;
  h?: number;
  /**
   * A wider cut of the same photograph, for the frames the homepage shows
   * full-bleed. Only the cover and the featured sequence have one; see
   * `npm run wide`. Offered through srcset, so phones never download it.
   */
  wide?: { src: string; w: number };
};

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);

/**
 * Camera-generated names carry no meaning — DSC06016, NAS04802, _DSC7970, IMG_1234,
 * or a bare number. These get no printed caption; the plate number speaks instead.
 */
const CAMERA_CODE = /^(_?(dsc|dscf|dscn|img|nas|pxl|p|gopr|dji)[-_]?\d+|\d+)([-_.]\w+)*$/i;

function titleFromFilename(file: string): string {
  const base = path.parse(file).name.replace(/[-_]+/g, " ").trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/** A caption, or undefined when the filename is just a camera code. */
function captionFromFilename(file: string): string | undefined {
  const base = path.parse(file).name;
  return CAMERA_CODE.test(base) ? undefined : titleFromFilename(file);
}

function readImages(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => !f.startsWith(".") && IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort();
}

/** Dimensions written by `npm run photos`, keyed by path relative to /gallery. */
function readManifest(): Map<string, { w: number; h: number }> {
  const file = path.join(GALLERY_DIR, "manifest.json");
  const map = new Map<string, { w: number; h: number }>();
  try {
    if (!fs.existsSync(file)) return map;
    const entries: { file: string; w: number; h: number }[] = JSON.parse(
      fs.readFileSync(file, "utf8"),
    );
    for (const e of entries) map.set(e.file, { w: e.w, h: e.h });
  } catch {
    // A missing or broken manifest only costs us layout hints.
  }
  return map;
}

/** Widths of the full-bleed variants written by `npm run wide`. */
function readWideManifest(): Map<string, number> {
  const map = new Map<string, number>();
  try {
    const file = path.join(process.cwd(), "public", "wide", "manifest.json");
    if (!fs.existsSync(file)) return map;
    const entries: { file: string; w: number }[] = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const e of entries) map.set(e.file, e.w);
  } catch {
    // No wide variants just means the ordinary files get used everywhere.
  }
  return map;
}

/**
 * Reads every photograph out of /public/gallery.
 *
 * Files directly in the folder    -> category "Selected"
 * Files in /public/gallery/weddings -> category "Weddings"
 */
export function getPhotos(): Photo[] {
  if (!fs.existsSync(GALLERY_DIR)) return [];

  const sizes = readManifest();
  const wide = readWideManifest();
  const photos: Photo[] = [];

  const build = (relPath: string, file: string, category: string): Photo => {
    const wideWidth = wide.get(relPath);
    return {
      src: `/gallery/${relPath}`,
      category,
      alt: captionFromFilename(file) ?? `Photograph — ${category}`,
      caption: captionFromFilename(file),
      ...sizes.get(relPath),
      ...(wideWidth ? { wide: { src: `/wide/${relPath}`, w: wideWidth } } : {}),
    };
  };

  for (const file of readImages(GALLERY_DIR)) {
    photos.push(build(file, file, "Selected"));
  }

  const subdirs = fs
    .readdirSync(GALLERY_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();

  for (const dir of subdirs) {
    const label = titleFromFilename(dir);
    for (const file of readImages(path.join(GALLERY_DIR, dir))) {
      photos.push(build(`${dir}/${file}`, file, label));
    }
  }

  return photos;
}

/**
 * Strongest work first. Folders sort alphabetically on disk, which would open
 * the portfolio on Events and bury 50 weddings past the fold.
 */
const CATEGORY_ORDER = ["Weddings", "Food", "Portraits", "Events", "Products"];

function categoryRank(name: string): number {
  const i = CATEGORY_ORDER.indexOf(name);
  return i === -1 ? CATEGORY_ORDER.length : i;
}

/** Photos grouped by that same order, so "All" leads with the best work. */
export function sortByCategory(photos: Photo[]): Photo[] {
  return [...photos].sort((a, b) => {
    const rank = categoryRank(a.category) - categoryRank(b.category);
    return rank !== 0 ? rank : a.src.localeCompare(b.src);
  });
}

/** Category names in display order, "All" first. */
export function getCategories(photos: Photo[]): string[] {
  const names = Array.from(new Set(photos.map((p) => p.category))).sort(
    (a, b) => categoryRank(a) - categoryRank(b),
  );
  // A lone "Selected" category isn't worth a filter bar.
  if (names.length <= 1) return names;
  return ["All", ...names];
}

/** Bare numbers as filenames — 12.jpg, 123.jpg — read as throwaway exports. */
const THROWAWAY = /^\d+([-_]\d+)*$/;

/**
 * The photographs shown full-screen at the top of the homepage.
 *
 * Uses the explicit list from site config when there is one. Otherwise guesses:
 * wide frames first, skipping anything numerically named, spread across the
 * set rather than clustered at the front of the alphabet.
 */
export function getFeatured(photos: Photo[], configured: readonly string[], count = 6): Photo[] {
  if (configured.length > 0) {
    // Match on the bare name, ignoring case and extension: the processed copy
    // is always .jpg, so a config entry of "NAS00022.JPG" must still resolve.
    const key = (src: string) =>
      (src.split("/").pop() ?? "").replace(/\.[^.]+$/, "").toLowerCase();

    const picked = configured
      .map((file) => photos.find((p) => key(p.src) === key(file)))
      .filter((p): p is Photo => Boolean(p));
    if (picked.length > 0) return picked;
  }

  const usable = photos.filter((p) => {
    const base = p.src.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
    return !THROWAWAY.test(base);
  });

  // The headline sequence should come from the two flagship categories.
  const flagship = usable.filter((p) => ["Weddings", "Food"].includes(p.category));
  const candidates = flagship.length >= count ? flagship : usable;

  const wide = candidates.filter((p) => p.w && p.h && p.w / p.h > 1.2);
  const pool = wide.length >= count ? wide : candidates;
  if (pool.length <= count) return pool;

  // Even spread, so the selection isn't all consecutive frames from one shoot.
  const stride = Math.floor(pool.length / count);
  return Array.from({ length: count }, (_, i) => pool[i * stride]);
}

/** Stand-in art used only while /public/gallery is still empty. */
function placeholderPhotos(): Photo[] {
  const categories = ["Weddings", "Portraits", "Editorial"];
  return readImages(path.join(process.cwd(), "public", "placeholders")).map((file, i) => ({
    src: `/placeholders/${file}`,
    category: categories[i % categories.length],
    alt: "Placeholder image — replace with your photography",
  }));
}

/**
 * What the site renders: your photographs if you have any,
 * otherwise placeholders so the layout is never empty.
 */
export function getGallery(): { photos: Photo[]; isPlaceholder: boolean } {
  const photos = getPhotos();
  return photos.length > 0
    ? { photos: sortByCategory(photos), isPlaceholder: false }
    : { photos: placeholderPhotos(), isPlaceholder: true };
}
