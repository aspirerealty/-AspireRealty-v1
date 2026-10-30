"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export type Feature = { icon: React.ReactNode; title: string; text: string };

// Feature grid with scroll and hover motion:
// - divider lines grow in, cards rise in a stagger and their icons draw on
// - on hover, a gold spotlight follows the cursor, the card tilts in 3D, a
//   gold rule sweeps across the top and the icon badge fills gold.
export default function FeatureCards({ items, columns = 4 }: { items: Feature[]; columns?: 3 | 4 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      className={`grid gap-0 [perspective:1200px] sm:grid-cols-2 ${columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
    >
      {items.map((item, i) => (
        <Card key={item.title} item={item} index={i} />
      ))}
    </motion.div>
  );
}

function Card({ item, index }: { item: Feature; index: number }) {
  const [drawn, setDrawn] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
      }}
      onAnimationComplete={() => setDrawn(true)}
      className="relative"
    >
      {/* Divider line that grows from the top */}
      {index > 0 && (
        <motion.span
          aria-hidden
          variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } } }}
          className="absolute top-0 bottom-0 left-0 hidden w-px origin-top bg-navy-900/10 sm:block"
        />
      )}
      <motion.article
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
          e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        data-drawn={drawn}
        className="group feature-card relative h-full overflow-hidden p-8 sm:p-10"
      >
        <span aria-hidden className="feature-card__spotlight" />
        <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gold-500 transition-transform duration-700 ease-luxe group-hover:scale-x-100" />
        <span aria-hidden className="pointer-events-none absolute top-5 right-6 font-display text-6xl leading-none text-navy-900/[0.06] transition-colors duration-500 group-hover:text-gold-500/25">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative grid size-16 place-items-center rounded-full border border-gold-500/40 text-gold-500 transition-all duration-500 ease-luxe group-hover:-translate-y-1 group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-navy-950">
          <span className="draw-icon" style={{ transitionDelay: `${index * 0.12}s` }}>
            {item.icon}
          </span>
        </div>
        <h3 className="relative mt-7 font-display text-2xl text-navy-900">{item.title}</h3>
        <p className="relative mt-3 leading-relaxed text-muted">{item.text}</p>
      </motion.article>
    </motion.div>
  );
}
