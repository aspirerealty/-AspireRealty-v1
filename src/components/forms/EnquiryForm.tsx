"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { submitLead } from "@/lib/leads";
import { site } from "@/data/site";

const reasons = ["Site visit", "Pricing & offers", "Brochure", "Home loan assistance", "Channel partnership", "Careers", "Other"];

// "quick" = name + mobile only (call-back popup, 3D tour unlock).
type Variant = "enquiry" | "contact" | "quick";

export const LEAD_SUBMITTED_KEY = "aspire-lead-submitted";

export default function EnquiryForm({
  variant = "enquiry",
  project,
  source,
  dark = false,
  defaultReason,
  submitLabel = "Submit",
  onSuccess,
}: {
  variant?: Variant;
  project?: string;
  source: string;
  dark?: boolean;
  defaultReason?: string;
  submitLabel?: string;
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const quick = variant === "quick";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\D/g, "").slice(-10))) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setStatus("sending");
    try {
      await submitLead({
        name: data.name,
        phone: data.phone,
        email: data.email ?? "",
        message: data.message,
        reason: data.reason,
        project,
        source,
        website: data.website,
      });
      try {
        localStorage.setItem(LEAD_SUBMITTED_KEY, "1");
      } catch {}
      setStatus("done");
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  }

  const field = `field ${dark ? "border-white/20 text-white placeholder:text-white/40" : ""}`;
  const label = `text-xs font-semibold tracking-[0.2em] uppercase ${dark ? "text-white/50" : "text-muted"}`;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col items-start gap-4 ${quick ? "py-4" : "py-10"} ${dark ? "text-white" : "text-navy-900"}`}
          >
            <span className="grid size-14 place-items-center rounded-full bg-gold-500 text-navy-950">
              <Check className="size-7" />
            </span>
            <h3 className="font-display text-3xl">Thank you!</h3>
            <p className={dark ? "text-white/70" : "text-muted"}>We&apos;ve received your details. Our team will connect with you shortly.</p>
          </motion.div>
        ) : (
          <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit} className={`grid gap-6 ${quick ? "" : "sm:grid-cols-2"}`}>
            {/* Honeypot: hidden from people, filled in by bots */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <label className="grid gap-1">
              <span className={label}>Full name</span>
              <input name="name" required autoComplete="name" className={field} placeholder="Full name" />
            </label>
            <label className="grid gap-1">
              <span className={label}>Mobile number</span>
              <input name="phone" type="tel" required autoComplete="tel" className={field} placeholder="10-digit mobile" />
            </label>

            {!quick && (
              <label className={`grid gap-1 ${variant === "contact" ? "" : "sm:col-span-2"}`}>
                <span className={label}>Email</span>
                <input name="email" type="email" required autoComplete="email" className={field} placeholder="name@example.com" />
              </label>
            )}

            {variant === "contact" && (
              <label className="grid gap-1">
                <span className={label}>Reason</span>
                <select name="reason" defaultValue={defaultReason ?? ""} required className={`${field} cursor-pointer`}>
                  <option value="" disabled>
                    Select a reason
                  </option>
                  {reasons.map((r) => (
                    <option key={r} value={r} className="text-ink">
                      {r}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {variant !== "contact" && defaultReason && <input type="hidden" name="reason" value={defaultReason} />}

            {!quick && (
              <label className="grid gap-1 sm:col-span-2">
                <span className={label}>Message (optional)</span>
                <textarea name="message" rows={3} className={`${field} resize-none`} placeholder="Tell us what you're looking for" />
              </label>
            )}

            {quick && (
              <label className={`flex items-start gap-2 text-xs ${dark ? "text-white/50" : "text-muted"}`}>
                <input type="checkbox" required defaultChecked className="mt-0.5 accent-gold-600" />
                I consent to be contacted by {site.shortName} via call, SMS, email or WhatsApp, in line with the privacy policy.
              </label>
            )}

            <div className={`flex flex-col gap-4 ${quick ? "" : "sm:col-span-2 sm:flex-row sm:items-center sm:justify-between"}`}>
              {!quick && (
                <p className={`text-xs ${dark ? "text-white/40" : "text-muted"}`}>
                  By submitting, you agree to be contacted by {site.shortName} via call, SMS, email or WhatsApp.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex shrink-0 items-center justify-center gap-2 bg-gold-500 px-8 py-4 text-sm font-semibold text-navy-950 transition-all duration-500 hover:bg-gold-400 disabled:opacity-60"
              >
                {status === "sending" ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <>
                    {submitLabel} <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </div>

            {(error || status === "error") && (
              <p role="alert" className={`text-sm text-red-500 ${quick ? "" : "sm:col-span-2"}`}>
                {error || (
                  <>
                    Something went wrong. Please call us on{" "}
                    <a href={site.phoneHref} className="underline">
                      {site.phone}
                    </a>
                    .
                  </>
                )}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
