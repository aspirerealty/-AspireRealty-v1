"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// The project's real launch posters shown as a fanned stack of printed
// cards: they slide in and fan out, tilt with the cursor, and a click brings
// the back card forward. Displayed at (or below) native resolution so they
// stay sharp.

const POSTERS = [
  { src: "/assets/images/sarjapura-poster-2.jpg", alt: "Sarjapura G+47 launch poster — No Pre-EMI offer" },
  { src: "/assets/images/sarjapura-poster-1.jpg", alt: "Sarjapura G+47 launch poster — EOI offer" },
];

export default function PosterStack() {
  const [front, setFront] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });

  return (
    <div
      className="relative mx-auto aspect-[9/16] w-[min(72vw,330px)] [perspective:1400px] sm:w-[min(46vw,360px)] lg:w-[min(30vw,400px)]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* Warm glow behind the cards */}
      <div aria-hidden className="absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(214,180,122,0.45),transparent_65%)] blur-2xl" />

      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative size-full">
        {POSTERS.map((poster, i) => {
          const isFront = i === front;
          return (
            <motion.button
              key={poster.src}
              type="button"
              onClick={() => setFront(i)}
              aria-label={isFront ? poster.alt : `Show ${poster.alt}`}
              initial={{ opacity: 0, y: 120, rotate: 0, x: 0 }}
              animate={
                isFront
                  ? { opacity: 1, y: 0, x: 0, rotate: -2, scale: 1, zIndex: 2 }
                  : { opacity: 1, y: 18, x: "34%", rotate: 7, scale: 0.9, zIndex: 1 }
              }
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.5 + i * 0.15 }}
              whileHover={isFront ? { scale: 1.02 } : { x: "40%", rotate: 9 }}
              className="group absolute inset-0 cursor-pointer overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/25"
            >
              <Image src={poster.src} alt={poster.alt} fill priority sizes="(min-width: 1024px) 400px, (min-width: 640px) 360px, 72vw" className="object-cover" />
              {/* Glossy print sheen that sweeps across on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.28)_50%,transparent_65%)] transition-transform duration-1000 ease-luxe group-hover:translate-x-full"
              />
              {!isFront && <span aria-hidden className="absolute inset-0 bg-navy-950/25 transition-colors group-hover:bg-navy-950/5" />}
            </motion.button>
          );
        })}
      </motion.div>

      <p className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-[0.25em] whitespace-nowrap text-white/50 uppercase">
        Tap a poster to bring it forward
      </p>
    </div>
  );
}
