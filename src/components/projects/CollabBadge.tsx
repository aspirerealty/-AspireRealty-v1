import Image from "next/image";
import type { Developer } from "@/data/projects";

// "In collaboration with [developer logo]" — shown on every project page and card.
export default function CollabBadge({ developer, tone = "light", size = "md" }: { developer: Developer; tone?: "light" | "dark"; size?: "sm" | "md" }) {
  const onDark = tone === "dark";
  return (
    <div className={`inline-flex items-center gap-3 ${size === "md" ? "sm:gap-4" : ""}`}>
      <span className={`text-[0.6rem] font-semibold tracking-[0.28em] uppercase ${onDark ? "text-white/70" : "text-muted"} ${size === "md" ? "sm:text-[0.65rem]" : ""}`}>
        In collaboration with
      </span>
      <span className={`h-8 w-px ${onDark ? "bg-white/25" : "bg-navy-900/20"}`} />
      <Image
        src={onDark ? developer.logoWhite : developer.logo}
        alt={developer.name}
        width={640}
        height={655}
        className={`w-auto ${size === "md" ? "h-12 sm:h-14" : "h-9"}`}
      />
    </div>
  );
}
