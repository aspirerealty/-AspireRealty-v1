"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/data/projects";

// Horizontally scrolling row of project cards (swipe, drag or arrows).
export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]);
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => embla && setIndex(embla.selectedScrollSnap()), [embla]);
  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 sm:gap-8">
          {projects.map((p) => (
            <div key={p.slug} className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_calc(50%-16px)] lg:flex-[0_0_calc(33.333%-22px)]">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-label={`Show ${p.name}`}
              onClick={() => embla?.scrollTo(i)}
              className={`h-1 transition-all duration-500 ${i === index ? "w-10 bg-gold-500" : "w-5 bg-navy-900/20"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous project" onClick={() => embla?.scrollPrev()} className="grid size-12 place-items-center rounded-full border border-navy-900/20 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white">
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" aria-label="Next project" onClick={() => embla?.scrollNext()} className="grid size-12 place-items-center rounded-full border border-navy-900/20 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white">
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
