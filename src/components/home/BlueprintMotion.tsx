"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { twoBhk } from "@/data/flat-layouts";

// "From blueprint to building" motion background for the home hero:
// a floor plate is drawn line by line on blueprint paper while the camera
// drifts over it, then it dissolves into the real tower with warm bokeh
// lights — and loops.

const PX = 34; // pixels per metre
const FLAT_W = 10 * PX;
const FLAT_D = 9.6 * PX;
const CORRIDOR = 3 * PX;
const ORIGIN = { x: 180, y: 120 };

// Four flats around a central core: top row mirrored left/right, bottom row
// flipped front/back.
const FLATS = [
  { dx: 0, dy: 0, mx: false, my: false },
  { dx: FLAT_W + CORRIDOR, dy: 0, mx: true, my: false },
  { dx: 0, dy: FLAT_D + CORRIDOR, mx: false, my: true },
  { dx: FLAT_W + CORRIDOR, dy: FLAT_D + CORRIDOR, mx: true, my: true },
];

function place(flat: (typeof FLATS)[number], x: number, z: number, w: number, d: number) {
  const lx = flat.mx ? 10 - x - w : x;
  const lz = (flat.my ? 9.6 - (z + 1.6) - d : z + 1.6) as number; // shift so the balcony sits inside 0..9.6
  return { x: ORIGIN.x + flat.dx + lx * PX, y: ORIGIN.y + flat.dy + lz * PX, w: w * PX, h: d * PX };
}

const BLUEPRINT_SECONDS = 7.5;
const TOWER_SECONDS = 6.5;

export default function BlueprintMotion() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"plan" | "tower">("plan");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(
      () => {
        setPhase((p) => (p === "plan" ? "tower" : "plan"));
        if (phase === "tower") setCycle((c) => c + 1);
      },
      (phase === "plan" ? BLUEPRINT_SECONDS : TOWER_SECONDS) * 1000,
    );
    return () => clearTimeout(id);
  }, [phase, reduce]);

  if (reduce) {
    return <Image src="/assets/images/sarjapura-tower-dusk.jpg" alt="" fill priority sizes="100vw" className="object-cover" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a2340]">
      <AnimatePresence>
        {phase === "plan" ? (
          <motion.div key={`plan-${cycle}`} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4 }}>
            <BlueprintPlan />
          </motion.div>
        ) : (
          <motion.div key={`tower-${cycle}`} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4 }}>
            <TowerReveal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BlueprintPlan() {
  const draw = (delay: number, duration = 1.6) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { delay, duration, ease: [0.65, 0, 0.35, 1] as const }, opacity: { delay, duration: 0.2 } },
  });

  const planW = FLAT_W * 2 + CORRIDOR;
  const planH = FLAT_D * 2 + CORRIDOR;
  const core = { x: ORIGIN.x + FLAT_W, y: ORIGIN.y + FLAT_D, w: CORRIDOR, h: CORRIDOR };

  return (
    <div className="absolute inset-0 [perspective:1400px]">
      {/* Slow camera drift over the drawing table */}
      <motion.div
        className="absolute -inset-[20%]"
        initial={{ rotateX: 48, rotateZ: -14, x: "6%", y: "4%", scale: 1.05 }}
        animate={{ rotateX: 38, rotateZ: -8, x: "-4%", y: "-2%", scale: 1.15 }}
        transition={{ duration: BLUEPRINT_SECONDS + 1.5, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg viewBox="0 0 1200 1000" className="size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <pattern id="bp-grid" width="34" height="34" patternUnits="userSpaceOnUse">
              <path d="M34 0H0V34" fill="none" stroke="#8fc0ff" strokeOpacity="0.12" strokeWidth="1" />
            </pattern>
            <radialGradient id="bp-light" cx="45%" cy="45%" r="70%">
              <stop offset="0" stopColor="#1d4f86" />
              <stop offset="1" stopColor="#0a2340" />
            </radialGradient>
          </defs>
          <rect width="1200" height="1000" fill="url(#bp-light)" />
          <rect width="1200" height="1000" fill="url(#bp-grid)" />

          <g fill="none" stroke="#bfe0ff" strokeLinecap="round" strokeLinejoin="round">
            {/* Outer walls of the floor plate */}
            <motion.rect x={ORIGIN.x} y={ORIGIN.y} width={planW} height={planH} strokeWidth={5} {...draw(0.1, 2)} />
            {/* Rooms of each flat */}
            {FLATS.map((flat, fi) =>
              twoBhk.rooms.map((room, ri) => {
                const r = place(flat, room.x, room.z, room.w, room.d);
                return <motion.rect key={`${fi}-${room.id}`} x={r.x} y={r.y} width={r.w} height={r.h} strokeWidth={room.type === "balcony" ? 1.2 : 2} strokeDasharray={room.type === "balcony" ? "6 5" : undefined} {...draw(0.6 + fi * 0.35 + ri * 0.08, 1.2)} />;
              }),
            )}
            {/* Core: lifts with crossed boxes and a stair */}
            <motion.rect x={core.x + 8} y={core.y + 8} width={core.w / 2 - 12} height={core.h / 2 - 12} strokeWidth={1.5} {...draw(2.4)} />
            <motion.path d={`M${core.x + 8} ${core.y + 8} L${core.x + core.w / 2 - 4} ${core.y + core.h / 2 - 4} M${core.x + core.w / 2 - 4} ${core.y + 8} L${core.x + 8} ${core.y + core.h / 2 - 4}`} strokeWidth={1} {...draw(2.8, 0.8)} />
            <motion.rect x={core.x + core.w / 2 + 4} y={core.y + 8} width={core.w / 2 - 12} height={core.h - 16} strokeWidth={1.5} {...draw(2.6)} />
            {Array.from({ length: 9 }, (_, i) => (
              <motion.path key={i} d={`M${core.x + core.w / 2 + 4} ${core.y + 14 + i * 9} h${core.w / 2 - 12}`} strokeWidth={0.8} {...draw(2.9 + i * 0.05, 0.4)} />
            ))}
            {/* Door swings */}
            {FLATS.map((flat, fi) =>
              twoBhk.openings
                .filter((o) => o.width < 1.2)
                .map((o, oi) => {
                  const p = o.axis === "x" ? place(flat, o.center - o.width / 2, o.at, 0, 0) : place(flat, o.at, o.center - o.width / 2, 0, 0);
                  const r = o.width * PX;
                  const d = o.axis === "x" ? `M${p.x} ${p.y} l0 ${-r} A${r} ${r} 0 0 1 ${p.x + r} ${p.y}` : `M${p.x} ${p.y} l${r} 0 A${r} ${r} 0 0 1 ${p.x} ${p.y + r}`;
                  return <motion.path key={`${fi}-${oi}`} d={d} strokeWidth={0.9} strokeOpacity={0.8} {...draw(3 + fi * 0.2 + oi * 0.05, 0.6)} />;
                }),
            )}
            {/* Dimension line along the top */}
            <motion.path d={`M${ORIGIN.x} ${ORIGIN.y - 40} H${ORIGIN.x + planW} M${ORIGIN.x} ${ORIGIN.y - 50} v20 M${ORIGIN.x + planW} ${ORIGIN.y - 50} v20 M${ORIGIN.x + FLAT_W} ${ORIGIN.y - 48} v16 M${ORIGIN.x + FLAT_W + CORRIDOR} ${ORIGIN.y - 48} v16`} strokeWidth={1} {...draw(3.6, 1.2)} />
            <motion.path d={`M${ORIGIN.x - 40} ${ORIGIN.y} V${ORIGIN.y + planH} M${ORIGIN.x - 50} ${ORIGIN.y} h20 M${ORIGIN.x - 50} ${ORIGIN.y + planH} h20`} strokeWidth={1} {...draw(3.8, 1.2)} />
          </g>

          {/* Labels appear once the lines are drawn */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.2, duration: 1.2 }} fill="#d8ecff" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="2">
            {FLATS.map((flat, fi) =>
              twoBhk.rooms
                .filter((r) => r.w * r.d > 7)
                .map((room) => {
                  const r = place(flat, room.x, room.z, room.w, room.d);
                  return (
                    <text key={`${fi}-${room.id}`} x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" opacity={0.85}>
                      {room.name.toUpperCase()}
                    </text>
                  );
                }),
            )}
            <text x={ORIGIN.x + planW / 2} y={ORIGIN.y - 52} textAnchor="middle" fontSize="13">
              {(planW / PX).toFixed(1)} M
            </text>
            <text x={ORIGIN.x + planW + 40} y={ORIGIN.y + planH + 46} fontSize="13" fill="#e9c98f" letterSpacing="4">
              TYPICAL FLOOR PLAN · G+47
            </text>
          </motion.g>
        </svg>
      </motion.div>
      {/* Light sweep across the paper */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(191,224,255,0.12)_50%,transparent_65%)]"
        initial={{ x: "-60%" }}
        animate={{ x: "60%" }}
        transition={{ duration: BLUEPRINT_SECONDS, ease: "easeInOut" }}
      />
    </div>
  );
}

// Seeded so server and client agree.
const BOKEH = Array.from({ length: 22 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { left: r(1) * 100, top: 20 + r(2) * 75, size: 30 + r(3) * 110, delay: r(4) * 2, drift: (r(5) - 0.5) * 60, opacity: 0.25 + r(6) * 0.45 };
});

// The tower rises into frame like a model on a desk at dusk, shown at its
// native resolution (the source poster is narrow) and blended into a
// matching sunset backdrop.
function TowerReveal() {
  return (
    <div className="absolute inset-0 bg-[#0b2240]">
      {/* Blurred copy of the same image so the backdrop matches the tower's sky */}
      <Image src="/assets/images/sarjapura-tower-tall.jpg" alt="" fill sizes="10vw" className="scale-125 object-cover blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_85%,rgba(255,190,120,0.35),transparent_55%)]" />
      <motion.div
        className="absolute right-[4%] bottom-0 h-[96%] [aspect-ratio:340/1470] [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent),linear-gradient(0deg,transparent,black_12%)] [mask-composite:intersect] sm:right-[10%] lg:right-[14%]"
        initial={{ y: "14%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src="/assets/images/sarjapura-tower-tall.jpg" alt="" fill sizes="(min-width: 1024px) 26vw, 40vw" className="object-cover" />
      </motion.div>
      {/* Warm out-of-focus city lights */}
      {BOKEH.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[radial-gradient(circle,rgba(255,206,140,0.9),rgba(255,180,100,0.25)_45%,transparent_70%)] mix-blend-screen blur-[2px]"
          style={{ left: `${b.left}%`, top: `${b.top}%`, width: b.size, height: b.size }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: b.opacity, scale: 1, x: b.drift, y: -20 }}
          transition={{ delay: 0.4 + b.delay, duration: TOWER_SECONDS, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
