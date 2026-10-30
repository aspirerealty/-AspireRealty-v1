"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import EnquiryForm from "./EnquiryForm";

// A button that opens the enquiry form in a popup — used for brochure,
// price breakup, floor plan and site-visit requests.
export default function EnquireButton({
  children,
  title,
  reason,
  project,
  source,
  className,
}: {
  children: React.ReactNode;
  title: string;
  reason: string;
  project?: string;
  source: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  // True only in the browser, so the portal never renders during prerendering.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-end justify-center bg-navy-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                data-lenis-prevent
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={title}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-h-[92svh] w-full max-w-xl overflow-y-auto bg-cream p-6 sm:p-10"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-navy-900 transition-colors hover:bg-navy-900/5"
                  >
                    <X className="size-5" />
                  </button>
                  <span className="eyebrow">Enquire</span>
                  <h2 className="mt-3 pr-10 font-display text-3xl text-navy-900">{title}</h2>
                  <div className="mt-6">
                    <EnquiryForm source={source} project={project} defaultReason={reason} />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
