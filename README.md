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

### `/admin` is password-protected

`src/proxy.ts` puts a password prompt in front of it. **It stays switched off (503) until
you set `ADMIN_PASSWORD`** — it fails closed on purpose, so a missing setting can never
expose your client list. Copy `.env.example` to `.env.local` for local use, and set the
same value in your host's environment settings before deploying.

### Nothing emails you yet

A request lands in the JSON file, so you have to open `/admin` to know it arrived.
`src/app/api/bookings/route.ts` has the spot marked where an email, SMS, or calendar hook
goes.

---

## Going live

### Read this first: where enquiries are stored

Requests are written to `data/bookings.json` **on the server's own disk**. That works on a
machine with a real, persistent filesystem — a VPS, a Raspberry Pi, a Docker host with a
mounted volume.

It does **not** work on Vercel, Netlify, Cloudflare Pages, or any host that rebuilds the
app on deploy. Those give the app a read-only or throwaway disk, so the write either fails
or is wiped by the next deploy. **Enquiries would be lost.**

The form no longer pretends otherwise: if the write fails it returns a 503 and tells the
visitor to email you instead, and it logs the full request so it survives in your host's
logs. But that's a safety net, not a solution.

So pick one before launch:

| If you host on | Do this |
| --- | --- |
| A VPS or any box with a real disk | Nothing. It works as-is. Back up `data/bookings.json`. |
| Vercel / Netlify / Cloudflare | Replace the storage in `src/lib/bookings.ts` with a database or an email send. Only that one file needs changing. |

The simplest fix for a photographer is to **email each enquiry to yourself** instead of
storing it. One call to a service like Resend or Postmark inside
`src/app/api/bookings/route.ts` and you get a message the moment someone books, with no
database and no `/admin` to check.

### Checklist

1. **Set your domain.** Put it in `url` in `src/config/site.ts`, e.g.
   `"https://nassersangari.com"`. This makes Google's canonical link and the preview card
   that appears when the site is shared on WhatsApp or Instagram point at the right place.
   On Vercel this is auto-detected if you leave it blank, but setting it is better.
2. **Set `ADMIN_PASSWORD`** in your host's environment settings. Long and random.
3. **Decide the storage question above.**
4. **Rebuild after adding photos** — `npm run photos`, then `npm run wide`, then
   `npm run build`. The home page is prerendered, so new photos need a rebuild.
5. **Check it.** `npm run build && npm start`, then open the site, submit a test enquiry,
   and confirm it appears at `/admin`. Delete the test afterwards.

### Deploying to Vercel

```bash
npx vercel            # first run links the project
npx vercel --prod     # publish
```

Set `ADMIN_PASSWORD` under Project → Settings → Environment Variables, and remember the
storage caveat above.

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
