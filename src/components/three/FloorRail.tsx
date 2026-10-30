"use client";

import { useRef } from "react";
import { FLOORS, METRES_PER_FLOOR } from "./towers-data";

// Slim vertical "lift" floor selector: drag along the rail (47 at the top,
// 1 at the bottom), click a tick, or use the arrow keys.
export default function FloorRail({
  value,
  onChange,
  night,
}: {
  value: number | null;
  onChange: (floor: number) => void;
  night: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const floor = value ?? 24;
  const pct = ((floor - 1) / (FLOORS - 1)) * 100;
  const zone = floor <= 12 ? "Lower" : floor <= 26 ? "Mid" : floor <= 40 ? "High" : "Sky";

  const pick = (clientY: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return;
    const t = 1 - Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    onChange(Math.round(1 + t * (FLOORS - 1)));
  };

  const text = night ? "text-white" : "text-navy-900";
  const soft = night ? "text-white/55" : "text-navy-900/55";

  return (
    <div className="rounded-2xl bg-gradient-to-b from-gold-400/90 via-white/40 to-gold-600/70 p-px shadow-[0_20px_50px_-20px_rgba(9,44,76,0.55)]">
      <div className={`relative flex h-full w-[92px] flex-col items-center overflow-hidden rounded-[15px] px-2 py-4 backdrop-blur-xl ${night ? "bg-navy-950/70" : "bg-white/80"}`}>
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/45 to-transparent opacity-60" />
        <p className="relative text-[9px] font-bold tracking-[0.25em] text-gold-600 uppercase">Floor</p>
        <p className={`relative font-display text-4xl leading-none tabular-nums ${text}`}>{String(floor).padStart(2, "0")}</p>
        <p className={`relative mt-1 text-[10px] tabular-nums ${soft}`}>≈ {Math.round(floor * METRES_PER_FLOOR)} m</p>
        <p className="relative text-[10px] font-semibold text-gold-600">{zone}</p>

        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Pick your floor"
          aria-orientation="vertical"
          aria-valuemin={1}
          aria-valuemax={FLOORS}
          aria-valuenow={floor}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            pick(e.clientY);
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) pick(e.clientY);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(Math.min(FLOORS, floor + 1));
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(Math.max(1, floor - 1));
          }}
          className="relative mt-4 w-full flex-1 cursor-ns-resize touch-none outline-none"
        >
          {/* rail */}
          <span className={`absolute top-0 bottom-0 left-1/2 w-1.5 -translate-x-1/2 rounded-full ${night ? "bg-white/15" : "bg-navy-900/10"}`} />
          <span className="absolute bottom-0 left-1/2 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-t from-gold-600 to-gold-400" style={{ height: `${pct}%` }} />
          {/* ticks */}
          {[47, 40, 30, 20, 10, 1].map((n) => (
            <button
              key={n}
              type="button"
              tabIndex={-1}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onChange(n)}
              className={`absolute right-0 -translate-y-1/2 text-[9px] tabular-nums hover:text-gold-600 ${soft}`}
              style={{ top: `${100 - ((n - 1) / (FLOORS - 1)) * 100}%` }}
            >
              {n}
            </button>
          ))}
          {/* thumb */}
          <span
            className="absolute left-1/2 size-5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white bg-[radial-gradient(circle_at_35%_30%,#fff,var(--color-gold-400)_45%,var(--color-gold-600))] shadow-[0_0_0_4px_rgba(196,154,82,0.25),0_4px_10px_rgba(9,44,76,0.35)]"
            style={{ bottom: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
