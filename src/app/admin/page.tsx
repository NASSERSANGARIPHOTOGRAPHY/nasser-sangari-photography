import type { Metadata } from "next";
import { readBookings } from "@/lib/bookings";
import { packages } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking requests",
  robots: { index: false, follow: false },
};

const packageName = (id: string) => packages.find((p) => p.id === id)?.name ?? id;

/**
 * Your private list of incoming requests.
 *
 * NOTE: there is no login on this page. It's fine on localhost during
 * development, but add authentication before putting the site online.
 */
export default function AdminPage() {
  const bookings = readBookings();

  return (
    <section className="pt-36 pb-28 lg:pt-44">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <p className="eyebrow">Internal</p>
        <h1 className="headline mt-3">
          Requests
          <span className="ml-3 align-middle text-2xl font-semibold text-accent">
            {bookings.length}
          </span>
        </h1>

        <p className="mt-6 rounded-xl bg-bg-alt px-5 py-3 text-sm text-fg-dim">
          This page is unauthenticated — add a login before deploying publicly.
        </p>

        {bookings.length === 0 ? (
          <p className="mt-16 text-fg-dim">
            No requests yet. Submit the form at <code className="text-fg">/book</code> to see
            one land here.
          </p>
        ) : (
          <ul className="mt-14 border-t border-line">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="border-b border-line py-8 transition-colors hover:border-fg-dim/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold tracking-[-0.01em]">{booking.name}</p>
                    <p className="mt-1.5 text-sm text-fg-dim">
                      <a href={`mailto:${booking.email}`} className="hover:text-accent">
                        {booking.email}
                      </a>
                      {booking.phone && ` · ${booking.phone}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-accent">
                      {packageName(booking.packageId)}
                    </p>
                    <p className="mt-1.5 text-sm text-fg-dim">
                      {booking.date}
                      {booking.time && ` · ${booking.time}`}
                    </p>
                  </div>
                </div>

                {booking.message && (
                  <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed whitespace-pre-wrap text-fg-dim">
                    {booking.message}
                  </p>
                )}

                <p className="mt-5 text-[0.65rem] tracking-wider text-fg-dim/60">
                  {booking.id} · received {new Date(booking.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
