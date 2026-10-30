"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Phone, RotateCw } from "lucide-react";
import { site } from "@/data/site";

// Branded error screen shared by app/error.tsx and app/global-error.tsx.
export default function ErrorState({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="grid min-h-svh place-items-center bg-navy-950 px-5 py-24 text-center text-white">
      <div className="flex flex-col items-center">
        <div className="brand-loader__mark brand-mark--float">
          <Image src={site.logo.emblem} alt="" width={128} height={128} priority />
        </div>
        <p className="mt-8 text-xs font-semibold tracking-[0.3em] text-gold-400 uppercase">Something went wrong</p>
        <h1 className="mt-4 max-w-xl font-display text-4xl leading-tight sm:text-5xl">We hit a snag while building this page.</h1>
        <p className="mt-4 max-w-md text-white/70">Please try again. If it keeps happening, our team is just a call away.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex items-center gap-2 bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-950 transition-colors duration-500 hover:bg-gold-400"
          >
            <RotateCw className="size-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-white/40 px-7 py-3.5 text-sm font-semibold transition-all duration-500 hover:bg-white hover:text-navy-900"
          >
            Back to home
          </Link>
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 border border-white/40 px-7 py-3.5 text-sm font-semibold transition-all duration-500 hover:bg-white hover:text-navy-900"
          >
            <Phone className="size-4" /> Call us
          </a>
        </div>
      </div>
    </section>
  );
}
