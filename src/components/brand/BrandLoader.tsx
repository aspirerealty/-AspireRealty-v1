import Image from "next/image";
import { site } from "@/data/site";

// The Aspire emblem "being built": the towers rise from the ground up behind
// a gold scan line, with the wordmark and a progress bar underneath.
// Pure CSS animation (see globals.css, .brand-loader) so it plays before any
// JavaScript has loaded.
export default function BrandLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="brand-loader" role="status" aria-live="polite">
      <div className="brand-loader__mark">
        <Image src={site.logo.emblem} alt="" width={128} height={128} priority className="brand-loader__ghost" />
        <Image src={site.logo.emblem} alt="" width={128} height={128} priority className="brand-loader__fill" />
        <span className="brand-loader__scan" />
      </div>
      <p className="brand-loader__word">ASPIRE VENTURES</p>
      <p className="brand-loader__sub">REALTY</p>
      <div className="brand-loader__bar">
        <span />
      </div>
      <span className="sr-only">{label}…</span>
    </div>
  );
}
