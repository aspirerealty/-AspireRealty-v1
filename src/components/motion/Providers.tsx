"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis } from "lenis/react";

// Smooth scrolling (Lenis) + global Motion settings. Both respect the
// visitor's "reduce motion" OS preference.
export default function Providers({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      {reduce ? children : <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -120 } }}>{children}</ReactLenis>}
    </MotionConfig>
  );
}
