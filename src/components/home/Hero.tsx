"use client";

import BlueprintMotion from "./BlueprintMotion";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const words = ["Where", "Aspirations", "turn", "into", "Reality"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-svh items-center overflow-hidden bg-navy-950">
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        {/* "From blueprint to building" motion background */}
        <BlueprintMotion />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/40" />

      <motion.div style={{ y: textY, opacity: fade }} className="container-x relative pt-28 pb-24">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="eyebrow text-gold-400">
          Aspire Ventures Realty
        </motion.span>
        <h1 className="mt-6 max-w-4xl font-display text-[3.2rem] leading-[0.98] font-medium text-white sm:text-7xl lg:text-8xl">
          {words.map((word, i) => (
            <span key={word} className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom">
              <motion.span
                className={`inline-block ${word === "Reality" ? "text-gold-400 italic" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 0.45 + i * 0.09 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/75"
        >
          We collaborate with Bengaluru&apos;s trusted developers to bring you homes designed for the way you live — with honest advice from first visit to final handover.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.3 }} className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/projects/">Explore projects</ButtonLink>
          <ButtonLink href="#enquire" variant="outline-light">
            Book a site visit
          </ButtonLink>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.3em] text-white/60 uppercase sm:flex"
      >
        Scroll <ChevronDown className="size-4" />
      </motion.a>
    </section>
  );
}
