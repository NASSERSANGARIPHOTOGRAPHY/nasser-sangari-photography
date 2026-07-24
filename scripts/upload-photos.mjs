/**
 * Pushes the web-sized photographs up to Vercel Blob and writes the manifest
 * the site reads at build time.
 *
 * The originals live in /Gallery and the web copies in /public/gallery, and
 * neither belongs in git — 50MB of JPEGs would make every clone and every
 * deploy drag. Instead they live in Blob storage, served from Vercel's CDN,
 * and the repository carries only src/config/photos.json: a small list of
 * URLs and dimensions.
 *
 *   1. npm run photos     resize the originals into /public/gallery
 *   2. npm run wide       build the full-bleed variants
 *   3. npm run upload     this script — push them up, rewrite the manifest
 *   4. commit photos.json and push
 *
 * Needs BLOB_READ_WRITE_TOKEN. `vercel env pull .env.local` fetches it once
 * the project is linked.
 */

import fs from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";

const ROOT = process.cwd();
const GALLERY_DIR = path.join(ROOT, "public", "gallery");
const WIDE_DIR = path.join(ROOT, "public", "wide");
const OUT = path.join(ROOT, "src", "config", "photos.json");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

/** Reads .env.local by hand; this script runs outside Next, which loads it for you. */
function loadEnv() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}

/** Every image under dir, as paths relative to it. One level of nesting. */
function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      for (const file of fs.readdirSync(path.join(dir, entry.name)).sort()) {
        if (!file.startsWith(".") && IMAGE_EXT.has(path.extname(file).toLowerCase())) {
          out.push(`${entry.name}/${file}`);
        }
      }
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push(entry.name);
    }
  }
  return out;
}

/** Dimensions written by `npm run photos` / `npm run wide`, keyed by relative path. */
function readSizes(dir) {
  const map = new Map();
  const file = path.join(dir, "manifest.json");
  if (!fs.existsSync(file)) return map;
  try {
    for (const e of JSON.parse(fs.readFileSync(file, "utf8"))) {
      map.set(e.file, { w: e.w, h: e.h });
    }
  } catch {
    // A broken manifest only costs the layout its size hints.
  }
  return map;
}

/**
 * Camera-generated names carry no meaning — DSC06016, IMG_1234, or a bare
 * number. These get no printed caption; the plate number speaks instead.
 * Kept in step with the same rule in src/lib/gallery.ts.
 */
const CAMERA_CODE = /^(_?(dsc|dscf|dscn|img|nas|pxl|p|gopr|dji)[-_]?\d+|\d+)([-_.]\w+)*$/i;

function titleFrom(name) {
  const base = path.parse(name).name.replace(/[-_]+/g, " ").trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function captionFrom(file) {
  return CAMERA_CODE.test(path.parse(file).name) ? undefined : titleFrom(file);
}

async function upload(prefix, dir, rel, token) {
  const blob = await put(`${prefix}/${rel}`, fs.createReadStream(path.join(dir, rel)), {
    access: "public",
    token,
    // Stable paths: re-running this script replaces a photo in place rather
    // than littering the store with copies under randomised names.
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob.url;
}

async function main() {
  loadEnv();
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error(
      "BLOB_READ_WRITE_TOKEN is not set.\n" +
        "Create a Blob store on the project, then run: vercel env pull .env.local",
    );
    process.exit(1);
  }

  const files = listImages(GALLERY_DIR);
  if (files.length === 0) {
    console.error(`No images in ${GALLERY_DIR}. Run \`npm run photos\` first.`);
    process.exit(1);
  }

  const sizes = readSizes(GALLERY_DIR);
  const wideSizes = readSizes(WIDE_DIR);
  const wideFiles = new Set(listImages(WIDE_DIR));

  const photos = [];
  let done = 0;

  for (const rel of files) {
    const url = await upload("gallery", GALLERY_DIR, rel, token);

    let wide;
    if (wideFiles.has(rel)) {
      const wideUrl = await upload("wide", WIDE_DIR, rel, token);
      wide = { src: wideUrl, w: wideSizes.get(rel)?.w ?? 0 };
    }

    const file = path.basename(rel);
    const category = rel.includes("/") ? titleFrom(rel.split("/")[0]) : "Selected";
    const caption = captionFrom(file);

    photos.push({
      src: url,
      category,
      alt: caption ?? `Photograph — ${category}`,
      ...(caption ? { caption } : {}),
      ...sizes.get(rel),
      ...(wide ? { wide } : {}),
    });

    done += 1;
    process.stdout.write(`\r  uploaded ${done}/${files.length}`);
  }

  fs.writeFileSync(OUT, `${JSON.stringify(photos, null, 2)}\n`);
  console.log(`\n✓ ${photos.length} photographs → ${path.relative(ROOT, OUT)}`);
  console.log("  Commit that file and push; the site reads it at build time.");
}

main().catch((error) => {
  console.error("\nUpload failed:", error.message);
  process.exit(1);
});
