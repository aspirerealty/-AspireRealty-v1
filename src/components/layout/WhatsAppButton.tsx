"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { whatsappLink } from "@/data/site";
import { projects } from "@/data/projects";

export default function WhatsAppButton() {
  const pathname = usePathname();
  // On a project landing page, prefill that project's message and hide on
  // phones (the page has its own bottom action bar with WhatsApp).
  const landing = projects.find((p) => p.page === pathname);

  return (
    <motion.a
      href={whatsappLink(landing?.whatsappMessage)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed right-5 bottom-5 z-40 size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 sm:right-8 sm:bottom-8 ${landing ? "hidden lg:grid" : "grid"}`}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
      <svg viewBox="0 0 24 24" className="relative size-7" fill="currentColor" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6zm0-21.6A11.8 11.8 0 0 0 1.9 17.8L.2 24l6.4-1.7A11.8 11.8 0 1 0 12 .2z" />
      </svg>
    </motion.a>
  );
}
