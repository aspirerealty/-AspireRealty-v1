import { site } from "@/data/site";

// Brand icons are inline because Lucide v1 no longer ships them.
const icons: Record<string, React.ReactNode> = {
  instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" />
  ),
  facebook: <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z" />,
  linkedin: (
    <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.6V9h3.5v11.5z" />
  ),
  youtube: (
    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3-5.8 3z" />
  ),
};

const labels: Record<string, string> = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", youtube: "YouTube" };

export default function SocialIcons({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const base =
    tone === "dark"
      ? "border-white/15 text-white/70 hover:border-gold-500 hover:bg-gold-500 hover:text-navy-950"
      : "border-navy-900/15 text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-white";

  return (
    <div className={`flex gap-3 ${className}`}>
      {Object.entries(site.social)
        .filter(([key]) => icons[key])
        .map(([key, href]) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} on ${labels[key]}`}
            className={`grid size-10 place-items-center rounded-full border transition-all duration-500 hover:-translate-y-0.5 ${base}`}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              {icons[key]}
            </svg>
          </a>
        ))}
    </div>
  );
}
