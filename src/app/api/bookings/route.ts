import { NextResponse } from "next/server";
import { addBooking, validateBooking } from "@/lib/bookings";
import { site } from "@/config/site";

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

  let booking;
  try {
    booking = addBooking(result.value);
  } catch (error) {
    // Never answer "sent" when it wasn't. Log the whole request so the enquiry
    // survives in the host's logs, and tell the visitor how to reach us
    // directly instead of leaving them thinking they have booked.
    console.error("[booking] FAILED TO SAVE", error);
    console.error("[booking] lost request:", JSON.stringify(result.value));
    return NextResponse.json(
      {
        errors: [
          `Sorry, the form could not save your request. Please email ${site.email} and it will be picked up straight away.`,
        ],
      },
      { status: 503 },
    );
  }

  // Hook up email/SMS/calendar here later; the request is already saved.
  console.log(`[booking] ${booking.name} <${booking.email}> ${booking.date} ${booking.time}`);

  return NextResponse.json({ id: booking.id }, { status: 201 });
}
