"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { BadgeIndianRupee, Car, Headset, Phone, X } from "lucide-react";
import EnquiryForm, { LEAD_SUBMITTED_KEY } from "./EnquiryForm";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

// Timed "instant call back" popup: first shown FIRST_DELAY after landing,
// then again REPEAT_DELAY after each close, at most MAX_PER_SESSION times.
// Never shown again once the visitor has submitted any form.
const FIRST_DELAY = 20_000;
const REPEAT_DELAY = 75_000;
const MAX_PER_SESSION = 3;
const SHOWN_KEY = "aspire-popup-shown";

const PROMISES = [
  { icon: Headset, label: "Instant Call Back" },
  { icon: Car, label: "Free Site Visit" },
  { icon: BadgeIndianRupee, label: "Unmatched Price" },
];

const read = (store: Storage, key: string) => {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
};

export default function LeadPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // True only in the browser, so the portal never renders during prerendering.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [cycle, setCycle] = useState(0);
  const project = projects.find((p) => p.page === pathname);
  const hidden = pathname.startsWith("/contact");

  useEffect(() => {
    if (open || hidden) return;
    const shown = Number(read(sessionStorage, SHOWN_KEY) ?? 0);
    if (shown >= MAX_PER_SESSION || read(localStorage, LEAD_SUBMITTED_KEY)) return;
    const id = setTimeout(
      () => {
        if (read(localStorage, LEAD_SUBMITTED_KEY) || document.querySelector('[role="dialog"]')) return setCycle((c) => c + 1);
        try {
          sessionStorage.setItem(SHOWN_KEY, String(shown + 1));
        } catch {}
        setOpen(true);
      },
      shown === 0 ? FIRST_DELAY : REPEAT_DELAY,
    );
    return () => clearTimeout(id);
  }, [open, hidden, cycle]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-navy-950/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Get an instant call back"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full text-navy-900/60 transition-colors hover:bg-navy-900/5 hover:text-navy-900"
            >
              <X className="size-5" />
            </button>

            <div className="grid md:grid-cols-[210px_1fr]">
              {/* We promise */}
              <div className="bg-cream px-6 py-6 md:py-10">
                <p className="text-center font-display text-2xl text-navy-900 md:text-3xl">We Promise</p>
                <ul className="mt-5 grid grid-cols-3 gap-3 md:mt-8 md:grid-cols-1 md:gap-8">
                  {PROMISES.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex flex-col items-center gap-2 text-center text-xs text-navy-900 md:text-sm">
                      <span className="grid size-12 place-items-center rounded-full border border-gold-500/50 text-gold-600 md:size-14">
                        <Icon className="size-6 md:size-7" strokeWidth={1.4} />
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Form */}
              <div className="px-6 py-8 sm:px-10">
                <div className="flex justify-center">
                  {project?.logo ? (
                    <Image src={project.logo.dark} alt={project.name} width={640} height={480} className="h-14 w-auto" />
                  ) : (
                    <span className="flex items-center gap-3">
                      <Image src={site.logo.emblem} alt="" width={48} height={48} className="size-12" />
                      <span className="leading-none">
                        <span className="block font-display text-xl font-semibold tracking-[0.08em] text-navy-900">ASPIRE VENTURES</span>
                        <span className="mt-1 block text-[0.6rem] font-semibold tracking-[0.55em] text-gold-600">REALTY</span>
                      </span>
                    </span>
                  )}
                </div>
                <p className="mt-6 text-center text-lg text-navy-900">
                  Register here and avail the <span className="font-semibold text-gold-600">BEST OFFERS!</span>
                </p>
                <div className="mt-6">
                  <EnquiryForm
                    variant="quick"
                    source={`Call-back popup${project ? ` — ${project.name}` : ""}`}
                    project={project?.name}
                    defaultReason="Instant call back"
                    submitLabel="Get Instant Call Back"
                  />
                </div>
              </div>
            </div>

            <a
              href={site.phoneHref}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 py-4 text-lg font-semibold text-white transition-opacity hover:opacity-95"
            >
              <Phone className="size-5" /> {site.phone}
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
