# Photography Studio Website

A dark, cinematic Next.js site: full-bleed hero, filterable portfolio with a lightbox,
service packages, and a working appointment-request system.

---

## Running it

Node lives at `~/.local/node` (installed standalone — no admin rights needed). Add it to
your PATH first:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
npm run dev
```

Then open **http://localhost:3000**.

To make that PATH line permanent so you never type it again:

```bash
echo 'export PATH="$HOME/.local/node/bin:$PATH"' >> ~/.zshrc
```

| Page | URL | What it is |
| --- | --- | --- |
| Home | `/` | Hero, portfolio, studio, services |
| Book | `/book` | The appointment form |
| Admin | `/admin` | Every request that's come in |

---

## The two files you'll actually touch

### 1. `src/config/site.ts` — all your words

Studio name, tagline, email, phone, location, social links, and the service packages
with their prices. Change it here and it updates everywhere on the site.

Leave any social URL as `""` and that icon disappears.

### 2. `Gallery/` — your photographs

Put your **originals** in `Gallery/`. Then run:

```bash
npm run photos
```

That reads `Gallery/`, makes web-sized copies into `public/gallery/`, and writes a
manifest of each photo's dimensions. **Your originals are never modified.**

Why this step exists: straight off the camera your files run up to 19 MB each — 435 MB
for the current set. Serving those directly would make the site take minutes to load. The
script resizes to 2400px on the long edge at quality 82, which brought the same 94 photos
down to 32 MB with no visible loss on screen. It also honours EXIF rotation, so portraits
don't come out sideways.

Re-run it whenever you add photos; anything already processed is skipped.

**Categories** come from subfolders:

```
Gallery/weddings/anna-01.jpg     -> a "Weddings" filter button
Gallery/portraits/headshot.jpg   -> a "Portraits" filter button
Gallery/beach-sunset.jpg         -> filed under "Selected"
```

Right now everything sits in one flat folder, so there are no filter buttons. Sort them
into subfolders and re-run `npm run photos` and the filters appear on their own.

**Captions** come from filenames — but camera codes like `DSC06016` or `NAS04802` are
recognised as meaningless and print no caption at all, just the plate number. Rename a
file to something real (`morning-at-the-lake.jpg`) and that becomes its caption.

**The hero photograph** is the first wide/landscape frame by default. To choose it
yourself, set `heroImage` in `src/config/site.ts` to a filename, e.g. `"DSC01147.jpg"`.

The portfolio hangs 30 photographs, with a "View all" link for the rest.

**Placeholder art** only appears while `public/gallery/` is empty. It's gone now that
your photos are in. (Stand-ins live in `public/placeholders/` — safe to delete.)

---

## Bookings

A visitor submits the form → it's validated → saved to `data/bookings.json` → you read it
at `/admin`.

That file is gitignored, so real client details never end up in version control.

### Before this site goes public, two things must change

1. **`/admin` has no password on it.** Anyone who guesses the URL sees your clients'
   names, emails, and phone numbers. It's fine on localhost; it is not fine on the open
   internet. Add authentication before deploying.
2. **Nothing emails you.** A request just lands in the JSON file, so you have to check
   `/admin` to know it arrived. `src/app/api/bookings/route.ts` has the spot marked where
   an email, SMS, or calendar hook goes.

---

## Note on production builds

The home page is prerendered at build time, so `npm run build` bakes in whatever photos
existed at that moment. In development (`npm run dev`) photos are re-read on every
refresh, so adding one shows up instantly. If you deploy, re-run `npm run build` after
adding photos.

---

## Structure

```
src/
  config/site.ts          your name, contact, socials, packages
  lib/gallery.ts          reads public/gallery off disk
  lib/bookings.ts         reads/writes data/bookings.json, validates input
  app/
    page.tsx              home
    book/page.tsx         booking form page
    admin/page.tsx        request list
    api/bookings/route.ts POST endpoint
  components/             Nav, Hero, Gallery, BookingForm, Footer, Socials, Reveal
public/
  gallery/                >>> YOUR PHOTOS GO HERE <<<
  placeholders/           stand-in art, safe to delete
```

Design tokens (the near-black background, the cyan accent, the fonts) are CSS variables
at the top of `src/app/globals.css`. Change `--accent` to re-skin the whole site.
