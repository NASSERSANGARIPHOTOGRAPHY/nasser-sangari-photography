import fs from "node:fs";
import path from "node:path";

export type Booking = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  packageId: string;
  date: string;
  time: string;
  message: string;
};

export type BookingInput = Omit<Booking, "id" | "createdAt">;

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "bookings.json");

/**
 * Requests live in data/bookings.json — plain, greppable, easy to back up.
 * Swap this module for a real database later; nothing else needs to change.
 */
export function readBookings(): Booking[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    const parsed: unknown = JSON.parse(fs.readFileSync(FILE, "utf8"));
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    // A corrupt file must not take the site down.
    return [];
  }
}

/**
 * Thrown when the request could not be written to disk.
 *
 * This matters in production: most modern hosts (Vercel, Netlify, Cloudflare
 * and any container that rebuilds on deploy) give the app a read-only or
 * throwaway filesystem, so this write fails or is wiped by the next deploy.
 * The caller must surface it rather than tell the visitor everything is fine,
 * because a silently dropped enquiry is a lost booking.
 */
export class BookingStorageError extends Error {}

export function addBooking(input: BookingInput): Booking {
  const booking: Booking = {
    ...input,
    id: `bk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify([booking, ...readBookings()], null, 2));
  } catch (cause) {
    throw new BookingStorageError("Could not save the booking request.", { cause });
  }

  return booking;
}

const MAX = { name: 120, email: 200, phone: 40, message: 2000 } as const;

/** Returns a cleaned booking, or a list of problems to show the visitor. */
export function validateBooking(
  body: unknown,
): { ok: true; value: BookingInput } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const raw = (body ?? {}) as Record<string, unknown>;
  const str = (key: string) => (typeof raw[key] === "string" ? (raw[key] as string).trim() : "");

  const name = str("name");
  const email = str("email");
  const phone = str("phone");
  const packageId = str("packageId");
  const date = str("date");
  const time = str("time");
  const message = str("message");

  if (name.length < 2) errors.push("Please enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push("Please enter a valid email.");
  if (!packageId) errors.push("Please choose a session type.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("Please pick a date.");

  for (const [key, value] of Object.entries({ name, email, phone, message })) {
    if (value.length > MAX[key as keyof typeof MAX]) errors.push(`Your ${key} is too long.`);
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: { name, email, phone, packageId, date, time, message } };
}
