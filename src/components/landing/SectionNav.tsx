"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

// Sticky in-page menu that highlights the section currently on screen.
export default function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Project sections" className="sticky top-0 z-30 border-b border-navy-900/10 bg-cream/90 backdrop-blur-md">
      <div className="container-x flex gap-1 overflow-x-auto [scrollbar-width:none]">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`relative shrink-0 px-4 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${active === s.id ? "text-navy-900" : "text-muted hover:text-navy-900"}`}
          >
            {s.label}
            {active === s.id && <motion.span layoutId="section-nav" className="absolute inset-x-3 bottom-0 h-0.5 bg-gold-500" />}
          </a>
        ))}
      </div>
    </nav>
  );
}
