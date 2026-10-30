"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// Inner-page banner with a slow parallax background and breadcrumb.
export default function PageHero({
  title,
  eyebrow,
  image,
  crumbs,
}: {
  title: string;
  eyebrow: string;
  image: string;
  crumbs: { href?: string; label: string }[];
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={ref} className="relative flex min-h-[60vh] items-end overflow-hidden bg-navy-950 pt-32 pb-16 sm:min-h-[66vh]">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image src={image} alt="" fill priority className="object-cover opacity-55" sizes="100vw" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/30" />
      <div className="container-x relative">
        <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="eyebrow text-gold-400">
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-4 max-w-4xl font-display text-5xl leading-[1.02] font-medium text-white sm:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center gap-2 text-sm text-white/60"
        >
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-2">
              {i > 0 && <span className="text-gold-500">/</span>}
              {c.href ? (
                <Link href={c.href} className="transition-colors hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </motion.nav>
      </div>
    </section>
  );
}
