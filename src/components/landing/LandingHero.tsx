"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Download } from "lucide-react";
import EnquireButton from "@/components/forms/EnquireButton";

const chips = [
  { value: "G + 47", label: "Floors" },
  { value: "2", label: "Signature towers" },
  { value: "2 & 3", label: "BHK homes" },
  { value: "₹1.10 Cr", label: "Onwards" },
];

export default function LandingHero({ name, partner, source }: { name: string; partner: string; source: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const towerY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section ref={ref} className="relative min-h-svh overflow-hidden bg-gradient-to-b from-[#2b4f7d] via-[#b98a6a] to-[#f0b27a]">
      {/* Blurred copy of the tower image so the backdrop matches its sky */}
      <Image src="/assets/images/sarjapura-tower-tall.jpg" alt="" fill sizes="10vw" className="scale-125 object-cover opacity-80 blur-3xl" />
      {/* Tower from the launch poster, shown near its native size so it stays sharp */}
      <motion.div style={{ y: towerY }} className="absolute right-[6%] bottom-0 h-[94%] [aspect-ratio:340/1470] sm:right-[12%] lg:right-[16%]">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6 }}
          className="absolute inset-0 [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)]"
        >
          <Image src="/assets/images/sarjapura-tower-tall.jpg" alt="" fill priority sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/10" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950 to-transparent" />

      <motion.div style={{ y: textY }} className="container-x relative flex min-h-svh flex-col justify-center pt-32 pb-20">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex flex-wrap items-center gap-3">
          <span className="bg-gold-500 px-3 py-1 text-[0.65rem] font-bold tracking-[0.25em] text-navy-950 uppercase">EOI Open</span>
          <span className="text-xs font-semibold tracking-[0.3em] text-white/70 uppercase">In collaboration with {partner}</span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1 }}
          className="mt-6 font-display text-6xl leading-[0.95] font-medium text-white sm:text-7xl lg:text-8xl"
        >
          {name}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.9 }} className="mt-6 max-w-lg text-xl text-white/80 sm:text-2xl">
          The next big address in Sarjapura is <em className="font-display text-gold-400">about to rise.</em>
        </motion.p>

        <motion.dl
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.8 } } }}
          className="mt-10 grid max-w-2xl grid-cols-2 gap-px bg-white/10 sm:grid-cols-4"
        >
          {chips.map((c) => (
            <motion.div key={c.label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="bg-navy-950/60 px-5 py-4 backdrop-blur">
              <dt className="sr-only">{c.label}</dt>
              <dd className="font-display text-3xl text-gold-400">{c.value}</dd>
              <dd className="mt-1 text-[0.65rem] tracking-[0.2em] text-white/60 uppercase">{c.label}</dd>
            </motion.div>
          ))}
        </motion.dl>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="mt-10 flex flex-wrap gap-4">
          <EnquireButton
            title="Download the e-brochure"
            reason="Brochure"
            project={name}
            source={source}
            className="group inline-flex items-center gap-2 bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-950 transition-all duration-500 hover:bg-gold-400"
          >
            <Download className="size-4" /> Download brochure
          </EnquireButton>
          <EnquireButton
            title="Book a free site visit"
            reason="Site visit"
            project={name}
            source={source}
            className="inline-flex items-center gap-2 border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:bg-white hover:text-navy-900"
          >
            Book a site visit
          </EnquireButton>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-8 text-xs tracking-[0.2em] text-white/50 uppercase">
          Sarjapura Main Road · Opposite DMart · RERA: Coming soon
        </motion.p>
      </motion.div>
    </section>
  );
}
