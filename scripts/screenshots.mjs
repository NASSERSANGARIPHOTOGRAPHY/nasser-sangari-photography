/** Screenshots the site at iPhone size so the design can actually be reviewed. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import puppeteer from "puppeteer";

// A temp folder, so screenshots never end up committed alongside the site.
const OUT = path.join(os.tmpdir(), "nasser-sangari-shots");
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const BASE = process.env.SITE_URL ?? "http://localhost:3210";

const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();

// iPhone 14 Pro
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
await page.setUserAgent(
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
);

const settle = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(name, url, scrollY = 0) {
  if (page.url() !== url) {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await settle(900);
  }
  if (scrollY > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await settle(1400); // let lazy images and reveal animations finish
  }
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`  ${name}.png`);
}

const H = 852;

console.log("capturing:");
await shot("01-hero", BASE, 0);
await shot("02-frame1", BASE, H * 1.05);
await shot("03-frame2", BASE, H * 2.05);
await shot("04-frame5-cake", BASE, H * 5.05);
await shot("05-frame06-salmon", BASE, H * 6.05);
await shot("06-frame14-parmesan", BASE, H * 14.05);
await shot("07-frame17-drummer", BASE, H * 17.05);

// Everything after the sequence.
const afterSequence = await page.evaluate(() => {
  const el = document.querySelector("#weddings");
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});
await shot("08-whoiam", BASE, afterSequence - H * 1.15);
await shot("09-weddings", BASE, afterSequence);
await shot("10-weddings-grid", BASE, afterSequence + H * 0.8);

const foodTop = await page.evaluate(() => {
  const el = document.querySelector("#food");
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});
await shot("11-food", BASE, foodTop);

const workTop = await page.evaluate(() => {
  const el = document.querySelector("#work");
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});
await shot("12-portfolio", BASE, workTop);
await shot("13-portfolio-grid", BASE, workTop + H * 0.75);

await shot("14-book", `${BASE}/book`, 0);
await shot("15-book-form", `${BASE}/book`, H * 0.9);

await browser.close();
console.log(`\nwrote to ${OUT}`);
