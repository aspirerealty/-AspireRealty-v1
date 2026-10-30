"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Maximize2, MousePointerClick } from "lucide-react";
import BrandLoader from "@/components/brand/BrandLoader";
import EnquireButton from "@/components/forms/EnquireButton";
import { sqft, toFeet, twoBhk } from "@/data/flat-layouts";
import { useNearViewport } from "./useNearViewport";

const FlatScene = dynamic(() => import("./FlatScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-navy-950">
      <BrandLoader label="Loading 3D home" />
    </div>
  ),
});

// Interactive 3D apartment with a room list. Click a room (in 3D or the list)
// to fly into it.
export default function FlatExplorer({ project, source }: { project: string; source: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { mounted, active } = useNearViewport(ref);
  const [selected, setSelected] = useState<string | null>(null);
  const layout = twoBhk;
  const rooms = layout.rooms;
  const room = rooms.find((r) => r.id === selected);
  const carpet = rooms.filter((r) => r.type !== "balcony").reduce((sum, r) => sum + r.w * r.d, 0);

  return (
    <div className="grid overflow-hidden border border-navy-900/10 bg-white lg:grid-cols-[1fr_340px]">
      <div ref={ref} className="relative h-[460px] bg-[#e4e9f0] sm:h-[560px]">
        {mounted && <FlatScene layout={layout} active={active} selected={selected} onSelect={setSelected} />}
        <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy-900 shadow-sm">
          <MousePointerClick className="size-3.5 text-gold-600" /> Drag to rotate · <span className="pointer-coarse:hidden">Scroll</span><span className="pointer-fine:hidden">Pinch</span> to zoom · Tap a room
        </div>
        {selected && (
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 inline-flex items-center gap-2 bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-navy-800"
          >
            <Maximize2 className="size-3.5" /> Full home
          </button>
        )}
        <AnimatePresence>
          {room && (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="absolute right-4 bottom-4 left-4 max-w-sm bg-navy-950/90 p-5 text-white backdrop-blur sm:right-auto"
            >
              <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold-400 uppercase">{layout.label}</p>
              <p className="mt-1 font-display text-2xl">{room.name}</p>
              <p className="mt-1 text-sm text-gold-400">
                {toFeet(room.w)} × {toFeet(room.d)} · approx. {sqft(room.w * room.d)} sq. ft.
              </p>
              <p className="mt-2 text-sm text-white/70">{room.blurb}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col border-t border-navy-900/10 p-6 lg:border-t-0 lg:border-l">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-3xl text-navy-900">{layout.label}</p>
          <p className="text-sm text-muted">≈ {sqft(carpet).toLocaleString("en-IN")} sq. ft. carpet</p>
        </div>
        <ul className="mt-5 flex-1 divide-y divide-navy-900/10" data-lenis-prevent>
          {rooms.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelected(r.id === selected ? null : r.id)}
                className={`flex w-full items-center justify-between gap-4 py-2.5 text-left text-sm transition-colors ${
                  r.id === selected ? "font-semibold text-gold-600" : "text-navy-900 hover:text-gold-600"
                }`}
              >
                <span>{r.name}</span>
                <span className="text-muted tabular-nums">
                  {toFeet(r.w)} × {toFeet(r.d)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Illustrative layout for visualisation only. Actual floor plans, dimensions and specifications are shared on request.
        </p>
        <EnquireButton
          title="Get the actual floor plans"
          reason="Floor plans"
          project={project}
          source={source}
          className="mt-5 inline-flex items-center justify-center gap-2 bg-gold-500 px-6 py-3.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
        >
          Get actual floor plans
        </EnquireButton>
      </div>
    </div>
  );
}
