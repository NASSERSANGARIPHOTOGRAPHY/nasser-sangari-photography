"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { packages } from "@/config/site";

const TIMES = ["Morning", "Midday", "Afternoon", "Golden hour", "Evening", "Flexible"];

/** Filled, rounded, generous tap target — Apple's form language. */
const FIELD =
  "w-full border border-line bg-bg px-4 py-3.5 text-fg placeholder:text-fg-dim/70 transition-colors duration-200 focus:border-fg focus:outline-none";
const LABEL = "mb-2 block text-[0.68rem] font-semibold tracking-[0.2em] text-fg uppercase";

export function BookingForm() {
  const params = useSearchParams();
  const preselected = params.get("package");

  const [packageId, setPackageId] = useState(
    packages.some((p) => p.id === preselected) ? preselected! : packages[0].id,
  );
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<string[]>([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors([]);

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, packageId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setErrors(payload.errors ?? ["Something went wrong. Please try again."]);
        setStatus("idle");
        return;
      }

      setStatus("done");
    } catch {
      setErrors(["Couldn't reach the server. Please try again."]);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-bg-alt px-8 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-fg text-2xl text-bg">
          ✓
        </div>
        <h2 className="headline mt-8">Request sent.</h2>
        <p className="body-lg mx-auto mt-4 max-w-sm">
          Your date is pencilled in. You&apos;ll get a reply with availability and next
          steps within one business day.
        </p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} className="space-y-12" noValidate>
      <fieldset>
        <legend className={LABEL}>What do you need?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {packages.map((pkg) => {
            const selected = packageId === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setPackageId(pkg.id)}
                aria-pressed={selected}
                className={`border p-5 text-left transition-all duration-300 ${
                  selected
                    ? "border-fg bg-bg-alt"
                    : "border-line hover:border-fg-dim"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-semibold tracking-[-0.01em]">{pkg.name}</span>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-bg transition-colors ${
                      selected ? "bg-fg" : "bg-line"
                    }`}
                  >
                    {selected ? "✓" : ""}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-fg-dim">
                  {pkg.duration} · {pkg.price}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL}>
            Name
          </label>
          <input id="name" name="name" required className={FIELD} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className={LABEL}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={FIELD}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className={LABEL}>
            Phone <span className="font-normal text-fg-dim">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={FIELD}
            placeholder="+1 555 000 0000"
          />
        </div>
        <div>
          <label htmlFor="date" className={LABEL}>
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            min={today}
            className={`${FIELD} [color-scheme:light]`}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="time" className={LABEL}>
            Time of day
          </label>
          <select id="time" name="time" defaultValue={TIMES[0]} className={FIELD}>
            {TIMES.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={LABEL}>
          Tell me about it
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`${FIELD} resize-y`}
          placeholder="Venue, guest count, dishes, the vibe you're after. Anything that helps me prepare."
        />
      </div>

      {errors.length > 0 && (
        <ul
          role="alert"
          className="space-y-1 border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-col items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary w-full sm:w-auto sm:px-16 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send request"}
        </button>
        <p className="text-center text-sm text-fg-dim">
          No deposit needed yet. I&apos;ll confirm availability first.
        </p>
      </div>
    </form>
  );
}
