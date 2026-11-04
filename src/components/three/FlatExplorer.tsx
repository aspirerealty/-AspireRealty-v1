"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Maximize2, MousePointerClick } from "lucide-react";
import BrandLoader from "@/components/brand/BrandLoader";
import EnquireButton from "@/components/forms/EnquireButton";
import UnlockCard from "@/components/forms/UnlockCard";
import { LAYOUTS } from "@/data/flat-layouts";
import type { Unit } from "@/data/projects";
import { useUnlocked } from "@/lib/unlock";
import { useNearViewport } from "./useNearViewport";

const FlatScene = dynamic(() => import("./FlatScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-navy-950">
      <BrandLoader label="Loading 3D home" />
    </div>
  ),
});

// Interactive 3D 2 BHK / 3 BHK homes. Click a room (in 3D or the list) to fly into it.
export default function FlatExplorer({
  project,
  source,
  units,
  whatsappMessage,
}: {
  project: string;
  source: string;
  units: Unit[];
  whatsappMessage?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { mounted, active } = useNearViewport(ref);
  const unlocked = useUnlocked();
  const [layoutId, setLayoutId] = useState(LAYOUTS[0].id);
  const [selected, setSelected] = useState<string | null>(null);
  const layout = LAYOUTS.find((l) => l.id === layoutId) ?? LAYOUTS[0];
  const room = layout.rooms.find((r) => r.id === selected);
  const unit = units.find((u) => u.config.replace(/\s/g, "").toLowerCase() === layout.label.replace(/\s/g, "").toLowerCase());

  return (
    <div className="grid overflow-hidden border border-navy-900/10 bg-white lg:grid-cols-[1fr_340px]">
      <div ref={ref} className="relative h-[600px] overflow-hidden bg-[#e4e9f0] sm:h-[620px]">
        {unlocked ? (
          <>
            {mounted && <FlatScene key={layout.id} layout={layout} active={active} selected={selected} onSelect={setSelected} />}
            <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy-900 shadow-sm">
              <MousePointerClick className="size-3.5 text-gold-600" /> Drag to rotate · <span className="pointer-coarse:hidden">Scroll</span>
              <span className="pointer-fine:hidden">Pinch</span> to zoom · Tap a room
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
                  <p className="mt-2 text-sm text-white/70">{room.blurb}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="absolute inset-0">
            <Image src="/assets/images/flat-3d-preview.jpg" alt="" fill sizes="(min-width: 1024px) 70vw, 100vw" className="scale-110 object-cover blur-md" />
            <div className="absolute inset-0 bg-navy-950/45" />
            <div className="relative grid h-full place-items-center overflow-y-auto p-4" data-lenis-prevent>
              <UnlockCard
                title="Unlock the 3D home tour"
                text="Share your details or message us on WhatsApp to walk through the 2 BHK and 3 BHK homes in 3D."
                submitLabel="Unlock 3D tour"
                project={project}
                source={`${source} — 3D tour`}
                reason="3D home tour"
                whatsappMessage={whatsappMessage}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col border-t border-navy-900/10 p-6 lg:border-t-0 lg:border-l">
        <div role="tablist" className="grid grid-cols-2 gap-1 bg-cream p-1">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              role="tab"
              aria-selected={l.id === layoutId}
              onClick={() => {
                setLayoutId(l.id);
                setSelected(null);
              }}
              className={`relative py-2.5 font-display text-xl transition-colors ${l.id === layoutId ? "text-navy-950" : "text-muted hover:text-navy-900"}`}
            >
              {l.id === layoutId && <motion.span layoutId="bhk-tab" className="absolute inset-0 bg-gold-500" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{l.label}</span>
            </button>
          ))}
        </div>

        <dl className="mt-6 divide-y divide-navy-900/10 border-y border-navy-900/10">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-sm text-muted">Super built-up area</dt>
            <dd className="text-sm font-semibold text-navy-900">{unit?.sbua ?? "On request"}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-sm text-muted">Carpet area</dt>
            <dd className="text-sm font-semibold text-navy-900">{unit?.carpet ?? "On request"}</dd>
          </div>
        </dl>

        <p className="mt-6 text-[0.65rem] font-semibold tracking-[0.25em] text-muted uppercase">Explore the rooms</p>
        <div className="mt-3 flex flex-1 flex-wrap content-start gap-2">
          {layout.rooms.map((r) => (
            <button
              key={r.id}
              type="button"
              disabled={!unlocked}
              onClick={() => setSelected(r.id === selected ? null : r.id)}
              className={`border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                r.id === selected ? "border-gold-500 bg-gold-500 text-navy-950" : "border-navy-900/15 text-navy-900 hover:border-gold-500"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          Illustrative layout for visualisation only. Actual floor plans and specifications are shared on request.
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
