"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, MousePointer2, RotateCcw, Sun, X } from "lucide-react";
import BrandLoader from "@/components/brand/BrandLoader";
import { FLOORS, HOTSPOT_INFO, METRES_PER_FLOOR, type HotspotId } from "./towers-data";
import { useNearViewport } from "./useNearViewport";

const TowersScene = dynamic(() => import("./TowersScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <BrandLoader label="Loading 3D view" />
    </div>
  ),
});


// "Watch it rise" — cinematic 3D model of the twin G+47 towers with a floor
// picker, hotspots and a dusk/night switch.
export default function TowersShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { mounted, active } = useNearViewport(ref);
  const hotspotsRef = useRef<(HTMLElement | null)[]>([]);

  const [floor, setFloor] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [night, setNight] = useState(false);
  const [pickedFloor, setPickedFloor] = useState<number | null>(null);
  const [hotspot, setHotspot] = useState<HotspotId | null>(null);
  const toppedOut = floor === FLOORS;

  // Frosted panels: white by day, dark at night.
  const glass = night
    ? "border border-white/10 bg-navy-950/50 text-white backdrop-blur-md"
    : "border border-navy-900/10 bg-white/75 text-navy-900 shadow-sm backdrop-blur-md";
  const soft = night ? "text-white/60" : "text-navy-900/60";

  const replay = () => {
    setFloor(0);
    setNight(false);
    setPickedFloor(null);
    setHotspot(null);
    setReplayKey((k) => k + 1);
  };

  const info = HOTSPOT_INFO.find((h) => h.id === hotspot);

  return (
    <div ref={ref} className="relative h-[78svh] max-h-[880px] min-h-[560px] overflow-hidden bg-[#e4e9f0] select-none">
      {mounted && (
        <TowersScene
          active={active}
          replayKey={replayKey}
          night={night}
          selectedFloor={pickedFloor}
          onProgress={setFloor}
          hotspotsRef={hotspotsRef}
        />
      )}

      {/* Annotations (anchored every frame by the 3D scene), drawn like an
          architectural presentation board: dot → leader line → spec label */}
      {HOTSPOT_INFO.map((h, i) => {
        const right = h.side === "right";
        const ink = night ? "text-white" : "text-navy-900";
        const line = night ? "bg-white/60" : "bg-navy-900/45";
        return (
          <button
            key={h.id}
            ref={(el) => void (hotspotsRef.current[i] = el)}
            type="button"
            onClick={() => setHotspot(h.id === hotspot ? null : h.id)}
            style={{ opacity: 0 }}
            className="group absolute top-0 left-0 z-10 size-0 transition-opacity duration-700"
            aria-label={h.title}
          >
            <span className="absolute -top-2 -left-2 size-4 animate-ping rounded-full bg-gold-400/40" />
            <span className={`absolute -top-1.5 -left-1.5 size-3 rounded-full border-2 border-gold-500 transition-colors ${hotspot === h.id ? "bg-gold-500" : "bg-white"}`} />
            <span className="hidden sm:block">
              {/* diagonal leader */}
              <span className={`absolute top-0 h-px w-12 ${line} ${right ? "left-0 origin-left -rotate-45" : "right-0 origin-right rotate-45"}`} />
              {/* label sitting on a horizontal leader */}
              <span
                className={`absolute -top-[42px] block border-b pb-1 whitespace-nowrap transition-transform duration-500 group-hover:-translate-y-0.5 ${
                  night ? "border-white/60" : "border-navy-900/45"
                } ${right ? "left-[33px] pr-6 text-left" : "right-[33px] pl-6 text-right"}`}
              >
                <span className={`block text-[10px] font-bold tracking-[0.22em] uppercase ${ink}`}>{h.title}</span>
                <span className="block text-[11px] text-gold-600">{h.spec}</span>
              </span>
            </span>
          </button>
        );
      })}

      {/* Floor counter */}
      <div className={`pointer-events-none absolute top-5 left-5 w-44 p-4 sm:top-6 sm:left-6 ${glass}`}>
        <p className="text-[0.6rem] font-semibold tracking-[0.3em] text-gold-600 uppercase">{toppedOut ? "Topped out" : "Rising"}</p>
        <p className="mt-1 font-display text-5xl leading-none tabular-nums">
          {String(floor).padStart(2, "0")}
          <span className={`text-xl ${soft}`}> / {FLOORS}</span>
        </p>
        <div className={`mt-3 h-px ${night ? "bg-white/15" : "bg-navy-900/10"}`}>
          <div className="h-px bg-gold-400 transition-[width] duration-300" style={{ width: `${(floor / FLOORS) * 100}%` }} />
        </div>
      </div>

      {/* Dusk / Night + Replay */}
      <div className="absolute top-5 right-5 flex items-center gap-2 sm:top-6 sm:right-6">
        <div className={`flex p-1 ${glass}`} role="group" aria-label="Time of day">
          {[
            { value: false, label: "Dusk", icon: Sun },
            { value: true, label: "Night", icon: Moon },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setNight(value);
              }}
              aria-pressed={night === value}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${night === value ? "text-navy-950" : `${soft} hover:opacity-100`}`}
            >
              {night === value && <motion.span layoutId="tod" className="absolute inset-0 bg-gold-400" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <Icon className="relative size-3.5" />
              <span className="relative hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={replay} aria-label="Replay" className={`grid size-9 place-items-center transition-colors hover:bg-gold-500 hover:text-navy-950 ${glass}`}>
          <RotateCcw className="size-4" />
        </button>
      </div>

      {/* Hotspot detail */}
      <AnimatePresence>
        {info && (
          <motion.div
            key={info.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`absolute top-36 left-5 z-20 max-w-xs p-5 sm:top-40 sm:left-6 ${glass}`}
          >
            <button type="button" onClick={() => setHotspot(null)} aria-label="Close" className={`absolute top-3 right-3 ${soft} hover:opacity-100`}>
              <X className="size-4" />
            </button>
            <p className="pr-6 font-display text-2xl">{info.title}</p>
            <p className={`mt-2 text-sm leading-relaxed ${soft}`}>{info.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floor picker */}
      <AnimatePresence>
        {toppedOut && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className={`absolute inset-x-5 bottom-5 mx-auto max-w-xl p-5 sm:bottom-6 ${glass}`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold-600 uppercase">Pick your floor</p>
              <p className="text-sm tabular-nums">
                {pickedFloor === null ? (
                  <span className={soft}>Slide to explore</span>
                ) : (
                  <>
                    <span className="font-display text-2xl text-gold-600">Floor {pickedFloor}</span>
                    <span className={soft}> · ≈ {Math.round(pickedFloor * METRES_PER_FLOOR)} m up</span>
                  </>
                )}
              </p>
            </div>
            <input
              type="range"
              min={1}
              max={FLOORS}
              value={pickedFloor ?? Math.round(FLOORS / 2)}
              onChange={(e) => setPickedFloor(Number(e.target.value))}
              aria-label="Floor"
              className="mt-3 w-full cursor-pointer accent-gold-500"
            />
            <p className={`mt-2 text-xs ${soft}`}>EOI offer: the first 200 customers can choose any floor — with no floor rise charges.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className={`pointer-events-none absolute right-6 bottom-6 hidden items-center gap-1.5 text-[11px] lg:flex ${night ? "text-white/50" : "text-navy-900/50"}`}>
        <MousePointer2 className="size-3" /> Drag to orbit · Illustrative 3D model
      </p>
    </div>
  );
}
