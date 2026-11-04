"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Maximize2, X } from "lucide-react";
import UnlockCard from "@/components/forms/UnlockCard";
import { useUnlocked } from "@/lib/unlock";
import type { Plan } from "@/data/projects";

// Master plan and unit plans from the developer's brochure. Blurred until the
// visitor unlocks (form or WhatsApp); then each plan opens full-size.
export default function PlansGallery({
  plans,
  project,
  source,
  whatsappMessage,
}: {
  plans: Plan[];
  project: string;
  source: string;
  whatsappMessage?: string;
}) {
  const unlocked = useUnlocked();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const plan = plans[active];

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  return (
    <div className="grid overflow-hidden border border-navy-900/10 bg-white lg:grid-cols-[1fr_300px]">
      <div className="relative min-h-[600px] overflow-hidden bg-[#f6f5f2] sm:min-h-[620px]">
        <AnimatePresence mode="wait">
          <motion.div key={plan.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-4 sm:inset-8">
            <Image src={plan.src} alt={plan.title} fill sizes="(min-width: 1024px) 65vw, 100vw" className={`object-contain ${unlocked ? "" : "scale-105 blur-md"}`} />
          </motion.div>
        </AnimatePresence>

        {unlocked ? (
          <button
            type="button"
            onClick={() => setZoom(true)}
            className="absolute top-4 right-4 inline-flex items-center gap-2 bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-navy-800"
          >
            <Maximize2 className="size-3.5" /> View full size
          </button>
        ) : (
          <div className="absolute inset-0 grid place-items-center overflow-y-auto bg-navy-950/35 p-4" data-lenis-prevent>
            <UnlockCard
              title="Unlock the floor plans"
              text="Share your details or message us on WhatsApp to view the master plan and unit plans."
              submitLabel="Unlock floor plans"
              project={project}
              source={`${source} — floor plans`}
              reason="Floor plans"
              whatsappMessage={whatsappMessage}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col border-t border-navy-900/10 p-6 lg:border-t-0 lg:border-l">
        <p className="text-[0.65rem] font-semibold tracking-[0.25em] text-muted uppercase">Plans</p>
        <ul className="mt-3 divide-y divide-navy-900/10 border-y border-navy-900/10">
          {plans.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={`w-full py-3 text-left transition-colors ${i === active ? "text-gold-600" : "text-navy-900 hover:text-gold-600"}`}
              >
                <span className="block font-display text-xl">{p.title}</span>
                {p.caption && <span className="mt-0.5 block text-xs text-muted">{p.caption}</span>}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          Plans from the developer&apos;s brochure. Dimensions and layouts may change as per approvals; refer to the sale agreement.
        </p>
      </div>

      <AnimatePresence>
        {zoom && unlocked && (
          <motion.div
            className="fixed inset-0 z-[80] overflow-auto bg-navy-950/90 p-4 backdrop-blur-sm sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            data-lenis-prevent
          >
            <button
              type="button"
              onClick={() => setZoom(false)}
              aria-label="Close"
              className="fixed top-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-white text-navy-900 shadow-lg"
            >
              <X className="size-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element -- full-resolution plan, scrollable on phones */}
            <img src={plan.src} alt={plan.title} onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-6xl min-w-[720px] bg-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
