import { site } from "@/config/site";

const ICONS = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5V6.8c0-.8.3-1.3 1.3-1.3H17V2.6h-2.4c-2.6 0-3.7 1.6-3.7 3.9v2H9v3h1.9V22h3.6v-10.5H17l.5-3h-3z" />
  ),
  youtube: (
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="4.5" />
      <path d="M10.2 9.1v5.8l5-2.9-5-2.9z" fill="currentColor" stroke="none" />
    </>
  ),
} as const;

const LABELS = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
} as const;

/** Social icon row. Hides any platform whose URL is blank in site config. */
export function Socials({ className = "" }: { className?: string }) {
  const links = (Object.keys(ICONS) as (keyof typeof ICONS)[]).filter(
    (key) => site.socials[key],
  );

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((key) => (
        <a
          key={key}
          href={site.socials[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={LABELS[key]}
          className="flex h-10 w-10 items-center justify-center border border-line text-fg-dim transition-all duration-300 hover:border-fg hover:bg-fg hover:text-bg"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[17px] w-[17px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICONS[key]}
          </svg>
        </a>
      ))}
    </div>
  );
}
