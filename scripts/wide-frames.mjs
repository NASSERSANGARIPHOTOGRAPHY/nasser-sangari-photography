/**
 * Builds the wide variants of the opening sequence.
 *
 *   npm run wide
 *
 * The homepage shows the cover and the featured photographs full-bleed, so the
 * browser needs one pixel of image per device pixel of screen width. A retina
 * laptop is 3024 of those. The ordinary gallery files top out at 2400 on their
 * long edge, which for a portrait frame is only ~2000 across, so they were
 * being stretched. These variants are sized by WIDTH instead, and the site
 * offers both through srcset: phones keep downloading the small file.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const TARGET_WIDTH = 3200;
const SRC = path.resolve("Gallery");
const OUT = path.resolve("public/wide");

const site = fs.readFileSync("src/config/site.ts", "utf8");
const featured = [...site.matchAll(/^\s+"([^"]+\.(?:jpg|JPG|jpeg))",$/gm)].map((m) => m[1]);
const cover = (site.match(/coverImage:\s*"([^"]+)"/) || [])[1];
const wanted = [cover, ...featured].filter(Boolean);

const key = (s) => (s.split("/").pop() ?? "").replace(/\.[^.]+$/, "").toLowerCase();
const walk = (dir, base = "") =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.name.startsWith(".") ? [] :
    e.isDirectory() ? walk(path.join(dir, e.name), path.join(base, e.name)) : [path.join(base, e.name)]);

const originals = walk(SRC);
const manifest = [];

for (const want of wanted) {
  const orig = originals.find((o) => key(o) === key(want));
  if (!orig) { console.log(`  no original for ${want}`); continue; }
  const rel = orig.replace(/\.[^.]+$/, ".jpg").split(path.sep).join("/");
  const out = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const info = await sharp(path.join(SRC, orig))
    .rotate()
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toFile(out);
  manifest.push({ file: rel, w: info.width, h: info.height });
  console.log(`  ${rel.padEnd(28)} ${info.width}x${info.height}  ${(info.size / 1048576).toFixed(2)}MB`);
}

manifest.sort((a, b) => a.file.localeCompare(b.file));
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
const total = manifest.reduce((s, m) => s + fs.statSync(path.join(OUT, m.file)).size, 0);
console.log(`\n${manifest.length} wide frames, ${(total / 1048576).toFixed(1)}MB total.`);
