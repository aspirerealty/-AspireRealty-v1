import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Variant = "gold" | "navy" | "outline" | "outline-light";

const variants: Record<Variant, string> = {
  gold: "bg-gold-500 text-navy-950 hover:bg-gold-400",
  navy: "bg-navy-900 text-white hover:bg-navy-800",
  outline: "border border-navy-900/25 text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-white",
  "outline-light": "border border-white/40 text-white hover:border-white hover:bg-white hover:text-navy-900",
};

export const buttonClass = (variant: Variant = "gold") =>
  `group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-500 ease-luxe ${variants[variant]}`;

export function ButtonLink({
  href,
  children,
  variant = "gold",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const content = (
    <>
      {children}
      <ArrowUpRight className="size-4 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );
  return external ? (
    <a href={href} className={`${buttonClass(variant)} ${className}`} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href} className={`${buttonClass(variant)} ${className}`}>
      {content}
    </Link>
  );
}
