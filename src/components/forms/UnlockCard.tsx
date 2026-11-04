"use client";

import { LockKeyhole, MessageCircle } from "lucide-react";
import EnquiryForm from "./EnquiryForm";
import { unlock } from "@/lib/unlock";
import { whatsappLink } from "@/data/site";

// "Share your details or WhatsApp us to unlock" card shown over gated content.
export default function UnlockCard({
  title,
  text,
  submitLabel,
  project,
  source,
  reason,
  whatsappMessage,
}: {
  title: string;
  text: string;
  submitLabel: string;
  project: string;
  source: string;
  reason: string;
  whatsappMessage?: string;
}) {
  return (
    <div className="w-full max-w-md bg-white/95 p-6 shadow-2xl backdrop-blur sm:p-8">
      <span className="grid size-12 place-items-center rounded-full bg-gold-500 text-navy-950">
        <LockKeyhole className="size-5" />
      </span>
      <h3 className="mt-4 font-display text-3xl text-navy-900">{title}</h3>
      <p className="mt-2 text-sm text-muted">{text}</p>
      <div className="mt-5">
        <EnquiryForm variant="quick" source={source} project={project} defaultReason={reason} submitLabel={submitLabel} onSuccess={unlock} />
      </div>
      <a
        href={whatsappLink(whatsappMessage)}
        target="_blank"
        rel="noreferrer"
        onClick={unlock}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <MessageCircle className="size-4" /> Unlock via WhatsApp
      </a>
    </div>
  );
}
