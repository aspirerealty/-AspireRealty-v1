"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";

// Lenis keeps its own scroll position, which overrides Next.js's
// scroll-to-top on navigation — so jump to the top on every page change
// (unless the link targets an anchor on the new page).
function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}

// Smooth scrolling (Lenis) + global Motion settings. Both respect the
// visitor's "reduce motion" OS preference.
export default function Providers({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      {reduce ? (
        <>
          <ScrollToTopOnNavigate />
          {children}
        </>
      ) : (
        <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -120 } }}>
          <ScrollToTopOnNavigate />
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
