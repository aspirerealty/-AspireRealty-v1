"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Vertical project reel: autoplays muted on loop, tap to turn sound on.
export default function VideoReel({ src, poster, title }: { src: string; poster: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  return (
    <div className="relative mx-auto aspect-[478/850] w-full max-w-[340px] overflow-hidden rounded-2xl bg-navy-950 shadow-[0_40px_80px_-30px_rgba(9,44,76,0.6)] ring-1 ring-navy-900/10">
      <video ref={ref} src={src} poster={poster} autoPlay muted={muted} loop playsInline preload="metadata" aria-label={title} className="size-full object-cover" />
      <button
        type="button"
        onClick={() => {
          setMuted((m) => !m);
          void ref.current?.play().catch(() => {});
        }}
        aria-label={muted ? "Turn sound on" : "Mute"}
        className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-navy-950/60 text-white backdrop-blur transition-colors hover:bg-gold-500 hover:text-navy-950"
      >
        {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </button>
    </div>
  );
}
