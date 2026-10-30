"use client";

import { useEffect, useState } from "react";
import BrandLoader from "./BrandLoader";

const MIN_VISIBLE_MS = 1400; // long enough for one full "build" of the logo
const EXIT_MS = 900; // matches the .preloader--done transition in globals.css

// Full-screen brand intro shown on every full page load. It's in the
// server-rendered HTML, so it covers the page instantly; once the page has
// loaded it lifts away like a curtain. A CSS failsafe hides it after a few
// seconds even if JavaScript never runs.
export default function Preloader() {
  const [phase, setPhase] = useState<"visible" | "leaving" | "gone">("visible");

  useEffect(() => {
    const start = performance.now();
    let exitTimer: ReturnType<typeof setTimeout>;
    let goneTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      exitTimer = setTimeout(() => {
        setPhase("leaving");
        goneTimer = setTimeout(() => setPhase("gone"), EXIT_MS);
      }, wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(exitTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`preloader ${phase === "leaving" ? "preloader--done" : ""}`} aria-hidden={phase === "leaving"}>
      <BrandLoader label="Loading Aspire Ventures Realty" />
    </div>
  );
}
