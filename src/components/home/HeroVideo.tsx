"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

// Cinematic hero background: short clips play in sequence — design, model,
// city, delivery — crossfading into each other with a slow push-in, plus a
// story-style chapter indicator.
// Footage: Mixkit (mixkit.co) stock video, free for commercial use.

const CLIPS = [
  { src: "/assets/video/hero-blueprint.mp4", poster: "/assets/video/hero-blueprint.jpg", label: "Design" },
  { src: "/assets/video/hero-model.mp4", poster: "/assets/video/hero-model.jpg", label: "Model" },
  { src: "/assets/video/hero-skyline.mp4", poster: "/assets/video/hero-skyline.jpg", label: "City" },
  { src: "/assets/video/hero-developer.mp4", poster: "/assets/video/hero-developer.jpg", label: "Delivery" },
];

export default function HeroVideo() {
  const reduce = useReducedMotion();
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const [current, setCurrent] = useState(0);

  // Play the active clip from the start; pause the rest.
  useEffect(() => {
    if (reduce) return;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === current) {
        v.currentTime = 0;
        void v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [current, reduce]);

  // Drive the chapter progress bars from the playing clip.
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const tick = () => {
      const v = videos.current[current];
      bars.current.forEach((bar, i) => {
        if (!bar) return;
        const p = i < current ? 1 : i > current ? 0 : v && v.duration ? v.currentTime / v.duration : 0;
        bar.style.transform = `scaleX(${p})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current, reduce]);

  if (reduce) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={CLIPS[0].poster} alt="" className="absolute inset-0 size-full object-cover" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-950">
      {CLIPS.map((clip, i) => (
        <video
          key={clip.src}
          ref={(el) => void (videos.current[i] = el)}
          src={clip.src}
          poster={clip.poster}
          muted
          playsInline
          preload={i < 2 ? "auto" : "metadata"}
          autoPlay={i === 0}
          onEnded={() => setCurrent((c) => (c + 1) % CLIPS.length)}
          className={`hero-clip absolute inset-0 size-full object-cover transition-opacity duration-[1400ms] ease-in-out ${i === current ? "is-active opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Story-style chapters */}
      <div className="absolute right-28 bottom-9 z-10 hidden w-72 gap-3 lg:flex">
        {CLIPS.map((clip, i) => (
          <button key={clip.src} type="button" onClick={() => setCurrent(i)} className="flex-1 text-left" aria-label={`Play ${clip.label}`}>
            <span className="block h-0.5 overflow-hidden bg-white/25">
              <span ref={(el) => void (bars.current[i] = el)} className="block h-full origin-left scale-x-0 bg-gold-400" />
            </span>
            <span className={`mt-2 block text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors ${i === current ? "text-white" : "text-white/45"}`}>
              {String(i + 1).padStart(2, "0")} {clip.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
