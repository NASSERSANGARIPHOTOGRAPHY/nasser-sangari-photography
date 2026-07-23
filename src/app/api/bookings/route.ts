import { NextResponse } from "next/server";
import { addBooking, validateBooking } from "@/lib/bookings";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ errors: ["Malformed request."] }, { status: 400 });
  }

  const result = validateBooking(body);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  const booking = addBooking(result.value);

  // Hook up email/SMS/calendar here later — the request is already saved.
  console.log(`[booking] ${booking.name} <${booking.email}> — ${booking.date} ${booking.time}`);

  return NextResponse.json({ id: booking.id }, { status: 201 });
}
