import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { projects } from "@/data/projects";
import SocialIcons from "@/components/ui/SocialIcons";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/70">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-azure-500/10 blur-3xl" />
      <div className="container-x relative grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src={site.logo.emblem} alt="" width={56} height={56} className="size-14" />
            <span className="leading-none">
              <span className="block font-display text-2xl font-semibold tracking-[0.08em] text-white">ASPIRE VENTURES</span>
              <span className="mt-1 block text-[0.6rem] font-semibold tracking-[0.55em] text-gold-500">REALTY</span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm leading-relaxed">{site.description}</p>
          <SocialIcons className="mt-8" />
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.3em] text-gold-500 uppercase">Explore</h3>
          <ul className="mt-6 space-y-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.3em] text-gold-500 uppercase">Collaborations</h3>
          <ul className="mt-6 space-y-3">
            {projects.slice(0, 5).map((p) => (
              <li key={p.slug}>
                <Link href={p.landingPage ?? `/projects/${p.slug}/`} className="transition-colors hover:text-white">
                  {p.type.split(" · ")[0]} · {p.locality}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.3em] text-gold-500 uppercase">Get in touch</h3>
          <ul className="mt-6 space-y-4">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" />
              <span>
                {site.address.line1}
                <br />
                {site.address.line2}
              </span>
            </li>
            <li>
              <a href={site.phoneHref} className="flex gap-3 transition-colors hover:text-white">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold-500" /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex gap-3 break-all transition-colors hover:text-white">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-500" /> {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy-policy/" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="hover:text-white">
              Terms of Use
            </Link>
            <Link href="/disclaimer/" className="hover:text-white">
              RERA Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
