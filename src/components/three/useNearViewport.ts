"use client";

import { useEffect, useState, type RefObject } from "react";

// `mounted` turns true once the element first comes near the screen (so heavy
// 3D code only loads when needed); `active` tracks whether it is on screen now
// (so the render loop can pause when scrolled away).
export function useNearViewport(ref: RefObject<HTMLElement | null>) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          near.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    const visible = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    near.observe(el);
    visible.observe(el);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, [ref]);

  return { mounted, active };
}
