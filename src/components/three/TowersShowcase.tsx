"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import BrandLoader from "@/components/brand/BrandLoader";
import { useNearViewport } from "./useNearViewport";

const TowersScene = dynamic(() => import("./TowersScene"), { ssr: false, loading: () => <SceneLoading /> });

function SceneLoading() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <BrandLoader label="Loading 3D view" />
    </div>
  );
}

// "Watch it rise" — interactive 3D model of the two G+47 towers.
export default function TowersShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { mounted, active } = useNearViewport(ref);
  const [floor, setFloor] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div ref={ref} className="relative h-[520px] overflow-hidden bg-gradient-to-b from-[#1d3a5f] via-[#7a5a5e] to-[#e8a774] sm:h-[620px]">
      {/* Night sky fades in over the sunset as the windows light up */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-[#3b3550] transition-opacity duration-[2500ms]" style={{ opacity: floor === 47 ? 0.85 : 0 }} />
      {mounted && <TowersScene active={active} replayKey={replayKey} onProgress={setFloor} />}

      <div className="pointer-events-none absolute top-6 left-6 text-white">
        <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold-400 uppercase">Floor</p>
        <p className="font-display text-5xl leading-none tabular-nums">
          {String(floor).padStart(2, "0")}
          <span className="text-2xl text-white/50"> / 47</span>
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          setFloor(0);
          setReplayKey((k) => k + 1);
        }}
        className="absolute top-6 right-6 inline-flex items-center gap-2 border border-white/30 bg-navy-950/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white hover:text-navy-900"
      >
        <RotateCcw className="size-3.5" /> Replay
      </button>
      <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-xs text-white/70">
        <span className="pointer-coarse:hidden">Drag to rotate · </span>Illustrative 3D model
      </p>
    </div>
  );
}
