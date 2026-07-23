/**
 * Turns full-resolution camera files into web-sized photographs.
 *
 *   npm run photos
 *
 * Reads   ./Gallery          (your originals — never modified)
 * Writes  ./public/gallery   (what the website actually serves)
 *
 * Subfolders in Gallery/ are preserved and become filter categories on the site.
 * Re-run it any time you add photos; files already processed are skipped.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve(process.argv[2] ?? "Gallery");
const OUT = path.resolve("public/gallery");

/** Long edge in pixels. Plenty for full-screen viewing on a retina display. */
const MAX_EDGE = 2400;
const QUALITY = 82;

const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif"]);

function findImages(dir, base = "") {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".")) return [];
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) return findImages(path.join(dir, entry.name), rel);
    return SOURCE_EXT.has(path.extname(entry.name).toLowerCase()) ? [rel] : [];
  });
}

const images = findImages(SRC);

if (images.length === 0) {
  console.error(`No images found in ${SRC}`);
  process.exit(1);
}

console.log(`Found ${images.length} photographs in ${SRC}\n`);

const manifest = [];
let processed = 0;
let skipped = 0;

for (const rel of images) {
  // Everything becomes .jpg on the way out, whatever it started as.
  const outRel = rel.replace(/\.[^.]+$/, ".jpg");
  const srcPath = path.join(SRC, rel);
  const outPath = path.join(OUT, outRel);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  // Skip anything already processed and still newer than its source.
  if (
    fs.existsSync(outPath) &&
    fs.statSync(outPath).mtimeMs >= fs.statSync(srcPath).mtimeMs
  ) {
    const { width, height } = await sharp(outPath).metadata();
    manifest.push({ file: outRel.split(path.sep).join("/"), w: width, h: height });
    skipped++;
    continue;
  }

  const { width, height } = await sharp(srcPath)
    .rotate() // honour the EXIF orientation flag so portraits aren't sideways
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(outPath);

  manifest.push({ file: outRel.split(path.sep).join("/"), w: width, h: height });
  processed++;

  const before = fs.statSync(srcPath).size;
  const after = fs.statSync(outPath).size;
  console.log(
    `  ${outRel.padEnd(34)} ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(2)}MB`,
  );
}

// Dimensions let the site reserve each frame's space before the photo loads,
// so the gallery doesn't jump around while scrolling.
manifest.sort((a, b) => a.file.localeCompare(b.file));
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

const total = manifest.reduce(
  (sum, m) => sum + fs.statSync(path.join(OUT, m.file)).size,
  0,
);

console.log(
  `\nDone. ${processed} processed, ${skipped} already current.` +
    `\nThe site now serves ${(total / 1048576).toFixed(0)}MB across ${manifest.length} photographs.`,
);
