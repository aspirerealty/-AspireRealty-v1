"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Mail, Menu, Phone, X } from "lucide-react";
import { navLinks, site } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Solid background after leaving the hero; hide while scrolling down, reveal on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 400 && y > prev && !open);
  });

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = scrolled && !open;

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.45 }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? "bg-cream/90 shadow-[0_1px_0_rgba(9,44,76,0.08)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
            <Image src={site.logo.emblem} alt="" width={52} height={52} priority className="size-12 sm:size-13" />
            <span className="leading-none">
              <span className={`block font-display text-xl font-semibold tracking-[0.08em] transition-colors duration-500 sm:text-2xl ${solid ? "text-navy-900" : "text-white"}`}>
                ASPIRE VENTURES
              </span>
              <span className="mt-1 block text-[0.6rem] font-semibold tracking-[0.55em] text-gold-500">REALTY</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition-colors duration-300 ${
                  solid ? "text-navy-900/80 hover:text-navy-900" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-px bg-gold-500" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.phoneHref}
              className={`hidden items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition-all duration-500 sm:flex ${
                solid ? "border-navy-900/20 text-navy-900 hover:bg-navy-900 hover:text-white" : "border-white/30 text-white hover:bg-white hover:text-navy-900"
              }`}
            >
              <Phone className="size-4" /> {site.phone}
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={`grid size-11 place-items-center transition-colors lg:hidden ${solid ? "text-navy-900" : "text-white"}`}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-40 flex flex-col bg-navy-950 px-6 pt-28 pb-10 lg:hidden"
            data-lenis-prevent
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}>
                  <Link
                    href={link.href}
                    className={`block py-2 font-display text-4xl ${isActive(link.href) ? "text-gold-400" : "text-white"}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-auto space-y-3 text-white/70">
              <a href={site.phoneHref} className="flex items-center gap-3">
                <Phone className="size-4 text-gold-500" /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3">
                <Mail className="size-4 text-gold-500" /> {site.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
