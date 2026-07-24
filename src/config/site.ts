/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE TO MAKE THE SITE YOURS.
 *  Everything the visitor reads comes from here.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  /** Studio name shown in the nav, hero, and browser tab. */
  name: "NASSER SANGARI",
  /** Small word next to the name. Set to "" to hide. */
  suffix: "PHOTOGRAPHY",

  /** The big statement on the opening screen. Set in caps on the page. */
  headline: "We see your night from every angle",
  /** The line under the statement. */
  tagline:
    "Photography, film and social media for events and restaurants across California and the USA.",
  /** Your pitch. Shown in the "Who I am" section. */
  intro:
    "I shoot the moments a room remembers and the plates people order twice, and then I run the accounts they live on. Fifteen years behind the camera, with stills and film captured on the same visit by the same pair of eyes. What comes back isn't a folder of files: it's a month of posts, cut and scheduled, still working long after the night ends.",

  /**
   * The cover photograph — the full-screen image the site opens on.
   * Filename only; the category folder is found automatically.
   */
  coverImage: "DSC00458.jpg",

  /**
   * THE MOST IMPORTANT SETTING ON THIS SITE.
   *
   * The photographs shown full-screen, one per scroll, at the top of the
   * homepage — in this exact order. This is what a client judges you on.
   *
   * Just the filename; the category folder is found automatically.
   * Left empty, the site auto-picks wide frames from Weddings and Food.
   */
  featured: [
    "DSC02288.jpg",
    "DSC05850.jpg",
    "DSC06016.jpg",
    "NAS01369-2.jpg",
    "NAS01472.jpg",
    "NAS09841.jpg",
    "NAS09148-2.jpg",
    "DSC08018.jpg",
    "_DSC6648.jpg",
    "DSC00383.jpg",
    "DSC01528.jpg",
    "DSC04386.jpg",
    "NAS00022.JPG",
    "NAS00194.JPG",
    "NAS04924.jpg",
    "NAS05204.JPG",
    "NAS04802.jpg",
  ] as string[],

  /**
   * The live domain, once there is one — e.g. "https://nassersangari.com".
   * Only used to build absolute links for Google and for the preview card
   * that appears when someone shares the site. Safe to leave empty.
   */
  url: "",

  email: "nasser.sangari94@gmail.com",
  phone: "+1 (562) 504-8854",

  location: "California, available nationwide",

  /** Social links. Set any to "" to hide that icon. */
  socials: {
    instagram: "https://www.instagram.com/nasser_sangari/",
    // Not active on Facebook — left blank so the icon stays hidden.
    facebook: "",
    youtube: "https://www.youtube.com/@NasserSangariphotography",
  },
} as const;

/** The services shown on the homepage. Add, remove, rename freely. */
export const packages = [
  {
    id: "events",
    name: "Events",
    duration: "Half or full day",
    price: "from $350",
    blurb:
      "Weddings, corporate evenings, parties and launches. I work the room quietly and come back with the night as it actually felt.",
  },
  {
    id: "food",
    name: "Food & Restaurants",
    duration: "Half day",
    price: "on request",
    blurb:
      "Menus, hero dishes, interiors and drinks, lit to make people hungry. Full commercial licensing included.",
  },
  {
    id: "video",
    name: "Video & Motion",
    duration: "Half or full day",
    price: "on request",
    blurb:
      "Event films, restaurant reels and social cutdowns. Shot alongside the stills, delivered ready to post.",
  },
  {
    id: "drone",
    name: "Drone & Aerial",
    duration: "Half or full day",
    price: "on request",
    blurb:
      "Aerial stills and video: the venue from above, the coastline, the estate, the scale of a room no ground camera can show. Graded to match the rest of the coverage.",
  },
  {
    id: "social",
    name: "Social Media",
    duration: "Monthly",
    price: "on request",
    blurb:
      "The shooting is half of it. I plan the grid, cut the reels, write the captions and post on schedule, so the work you paid for keeps earning.",
  },
] as const;

export type PackageId = (typeof packages)[number]["id"];

/**
 * The films shown in the "Film" section, in this order — the first one is
 * given the big frame.
 *
 * `id` is the YouTube video ID: the part after `watch?v=` in the URL.
 * Everything else (thumbnail, player) is built from it. Delete a line to
 * drop a film; leave the list empty and the whole section disappears.
 */
export const videos: { id: string; title: string; kind: string }[] = [
  {
    id: "nujRCIcfdYo",
    title: "Ghaliaa — Ana El Bent",
    kind: "Music video",
  },
  {
    id: "c2HGuoK2phA",
    title: "Wedding Cinematics | Portfolio Piece",
    kind: "Weddings",
  },
  {
    id: "7UQtqiKZ4iE",
    title: "GATE 69 | Official Oscar Winner",
    kind: "Short film",
  },
  {
    id: "km7HOGDFPlY",
    title: "Restaurant Food Commercial",
    kind: "Food",
  },
  {
    id: "thw9zEb8w-w",
    title: "Beautiful Baptism Ceremony Film",
    kind: "Family",
  },
  {
    id: "y5S9UcpvnCo",
    title: "Emotional Piano Concert | Omar Harfouch",
    kind: "Live performance",
  },
  {
    id: "NJWMBJE8Wvo",
    title: "My Wedding Video Portfolio",
    kind: "Weddings",
  },
];

/**
 * Where to anchor a photograph when it gets cropped to fill the screen.
 *
 * Full-screen frames crop from the centre by default. When the subject sits
 * off-centre — a dish low in a tall frame, a face near the top — name the file
 * here and give it a CSS object-position.
 *
 *   "center 70%"  pushes the crop down, showing more of the lower half
 *   "center 25%"  pulls it up
 *   "30% center"  favours the left
 */
export const focalPoints: Record<string, string> = {
  // Cover: the couple sits left of the frame's true centre (groom + bride
  // midpoint ~43% across), so a plain centre crop reads as drifting left.
  // Anchor the crop on the couple so they hold the middle of the screen.
  "DSC00458.jpg": "43% center",
  // Yule log sits across the bottom half of a tall frame.
  "NAS01472.jpg": "center 68%",
  // Couple lying in the surf, low in a tall frame; everything above is sea.
  "DSC01528.jpg": "center 72%",
  // Couple walking through the field. It's a tall frame losing half its height
  // on a wide screen, and a centre crop took the top of her head off. Pull the
  // crop up so both faces and their held hands stay in.
  "DSC04386.jpg": "center 25%",
  // Burger and board occupy the lower third; above is dark pool-table felt.
  "NAS00022.jpg": "center 64%",
  // Drummer's face and glasses sit high — centre crop landed on his chest.
  "NAS04802.jpg": "center 35%",
  // Salmon bowl sits low; above it is a leather banquette.
  "NAS09841.jpg": "center 64%",
  // Caesar bowl is low — keeps some falling parmesan without losing the dish.
  "NAS00194.jpg": "center 70%",
};

/** The object-position for a photo, defaulting to a centre crop. */
export function focusFor(src: string): string {
  const key = (s: string) => (s.split("/").pop() ?? "").replace(/\.[^.]+$/, "").toLowerCase();
  const wanted = key(src);
  const match = Object.keys(focalPoints).find((file) => key(file) === wanted);
  return match ? focalPoints[match] : "center";
}

/**
 * The story told in the About section — three movements: the hobby, the
 * training, the life it turned into. Every line here is yours to rewrite; the
 * layout adapts to however long or short you make them.
 */
export const story = {
  eyebrow: "The story",
  headline: "The camera never went back in the bag",

  /** Lives in public/ — swap the file to change the portrait. */
  portrait: "/about/nasser.jpg",
  portraitAlt: "Nasser Sangari with his camera",
  portraitCaption: "Fifteen years, and it still doesn't feel like work.",

  chapters: [
    {
      label: "The hobby",
      text: "It started with a camera in my hands that wasn't even mine, and an evening spent behind it instead of in it. I wasn't good yet. I just couldn't put it down. Everyone else went home remembering that night. I went home with it.",
    },
    {
      label: "The training",
      text: "So I stopped calling it a hobby and went to study it properly: a bachelor's degree in filmmaking. That's where pictures stopped being about pretty and started being about time. Where to stand. When to breathe. What to leave out. Film teaches you that an evening has a rhythm. Learn to hear it and you stop taking photographs. You start catching them.",
    },
    {
      label: "The life",
      text: "Fifteen years on, this isn't something I go and do. The camera rides in the passenger seat. It comes to dinner. Weddings, restaurants, concerts, short films: different rooms, same hunt. The half-second before someone remembers they're being watched. That's the frame. That's the one I'll wait all night for.",
    },
  ],

  closing: "Tell me your date, and I'll give that night back to you exactly as it felt.",
  signature: "Nasser Sangari",
  signatureRole: "Photographer & filmmaker",
} as const;

/** The five steps shown in the "How it works" section. */
export const process = [
  { step: "Enquire", detail: "Tell me the date, the venue and what you need covered." },
  { step: "Book", detail: "I confirm availability and hold the date. Deposit only once you're sure." },
  { step: "Plan", detail: "We agree the shot list, timings and the look before the day arrives." },
  { step: "Shoot", detail: "Stills and film on the same visit. You barely notice I'm there." },
  { step: "Deliver", detail: "Edited gallery, reels and captions, posted for you if you want." },
] as const;

/** The reasons-to-hire list. Keep every line true. */
export const reasons = [
  "Fifteen years shooting events and food across California",
  "Photo, video and drone from one visit, not three separate hires",
  "Social media handled end to end: shot, cut, captioned, posted",
  "Vertical reels and stories built for the feed, not cropped for it",
  "Full commercial licensing on restaurant and product work",
  "Available for travel anywhere in the USA",
] as const;

/**
 * Client quotes. This section stays hidden until you add one — better an
 * absent section than an invented review.
 *
 * Add like: { quote: "…", name: "Sara M.", context: "Wedding, Pasadena" }
 */
export const testimonials: { quote: string; name: string; context: string }[] = [];
