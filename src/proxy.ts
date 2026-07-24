import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Password wall for /admin.
 *
 * That page lists every enquiry: names, email addresses, phone numbers, event
 * dates. On localhost that was fine. On a public domain an unguarded /admin is
 * a leak of client data to anyone who tries the URL, so the page is closed by
 * default and only opens once a password is configured.
 *
 * Set ADMIN_PASSWORD (and optionally ADMIN_USER) in the hosting environment.
 * See .env.example.
 */

/** Compares without returning early on the first differing byte. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const askForPassword = () =>
  new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Booking requests", charset="UTF-8"' },
  });

export function proxy(request: NextRequest) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const expectedUser = process.env.ADMIN_USER ?? "admin";

  // No password set: keep the door shut rather than fall open. Better a broken
  // admin page than a public list of clients.
  if (!expectedPassword) {
    return new NextResponse(
      "The admin page is disabled because no ADMIN_PASSWORD is set.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return askForPassword();

  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return askForPassword();
  }

  // Only the first colon separates the two; passwords may contain colons.
  const split = decoded.indexOf(":");
  if (split === -1) return askForPassword();
  const user = decoded.slice(0, split);
  const password = decoded.slice(split + 1);

  if (!safeEqual(user, expectedUser) || !safeEqual(password, expectedPassword)) {
    return askForPassword();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
