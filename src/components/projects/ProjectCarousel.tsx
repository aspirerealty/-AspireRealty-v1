"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/data/projects";

const AUTOPLAY_MS = 5000;
const PARALLAX = 14; // % the image drifts as a card slides across

// Horizontally scrolling project cards with transitions:
// - cards rise and unveil one after another when the section scrolls in
// - while sliding, each card's image drifts (parallax) and side cards ease
//   back slightly so the leading card stands out
// - the active dot fills as a timer until the next autoplay slide
export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: true }, [
    Autoplay({ delay: AUTOPLAY_MS, stopOnInteraction: true, stopOnMouseEnter: true }),
  ]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const slides = useRef<(HTMLDivElement | null)[]>([]);

  // Per-slide parallax + depth, driven by the carousel's scroll position.
  const tween = useCallback(
    (api: EmblaCarouselType) => {
      if (reduce) return;
      const progress = api.scrollProgress();
      const snaps = api.scrollSnapList();
      const engine = api.internalEngine();
      snaps.forEach((snap, i) => {
        let diff = snap - progress;
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((lp) => {
            const target = lp.target();
            if (lp.index === i && target !== 0) diff = snap - (progress + Math.sign(target) * -1);
          });
        }
        const el = slides.current[i];
        if (!el) return;
        const d = Math.max(-1, Math.min(1, diff * snaps.length));
        el.style.setProperty("--parallax", `${(-d * PARALLAX).toFixed(2)}%`);
        const depth = Math.min(1, Math.abs(diff * snaps.length) / Math.max(1, snaps.length - 1));
        el.style.opacity = String(1 - depth * 0.15);
      });
    },
    [reduce],
  );

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => {
      setIndex(embla.selectedScrollSnap());
    };
    const autoplay = embla.plugins().autoplay;
    const onStop = () => setPlaying(false);
    embla.on("select", onSelect).on("scroll", tween).on("reInit", tween).on("autoplay:stop", onStop);
    tween(embla);
    return () => {
      embla.off("select", onSelect).off("scroll", tween).off("reInit", tween).off("autoplay:stop", onStop);
      void autoplay;
    };
  }, [embla, tween]);

  const go = (fn: () => void) => {
    embla?.plugins().autoplay?.stop();
    fn();
  };

  return (
    <div>
      <motion.div
        className="overflow-hidden"
        ref={emblaRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.15 } } }}
      >
        <div className="flex gap-6 py-3 sm:gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              ref={(el) => void (slides.current[i] = el)}
              variants={{
                hidden: { opacity: 0, y: 60, clipPath: "inset(18% 0% 0% 0%)" },
                show: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="min-w-0 flex-[0_0_85%] transition-opacity duration-300 sm:flex-[0_0_calc(50%-16px)] lg:flex-[0_0_calc(33.333%-22px)]"
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-label={`Show ${p.name}`}
              onClick={() => go(() => embla?.scrollTo(i))}
              className={`relative h-1 overflow-hidden bg-navy-900/15 transition-all duration-500 ${i === index ? "w-14" : "w-5 hover:bg-navy-900/30"}`}
            >
              {i === index && (
                <span
                  key={`${index}-${playing}`}
                  className={`absolute inset-0 origin-left bg-gold-500 ${playing && !reduce ? "animate-[carousel-progress_linear_forwards]" : ""}`}
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => go(() => embla?.scrollPrev())}
            className="group grid size-12 place-items-center rounded-full border border-navy-900/20 text-navy-900 transition-all duration-500 hover:border-navy-900 hover:bg-navy-900 hover:text-white"
          >
            <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => go(() => embla?.scrollNext())}
            className="group grid size-12 place-items-center rounded-full border border-navy-900/20 text-navy-900 transition-all duration-500 hover:border-navy-900 hover:bg-navy-900 hover:text-white"
          >
            <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
