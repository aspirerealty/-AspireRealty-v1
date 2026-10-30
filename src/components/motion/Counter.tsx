"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

// Counts up from 0 to `value` once the number scrolls into view.
export default function Counter({ value, decimals = 0, prefix = "", suffix = "" }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = prefix + v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  );
}
