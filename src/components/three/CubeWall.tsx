"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { MousePointer2 } from "lucide-react";
import SplitText from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { useNearViewport } from "./useNearViewport";

const CubeWallScene = dynamic(() => import("./CubeWallScene"), { ssr: false });

// Interactive "built block by block" band: a wall of cubes that reacts to the
// cursor, with the brand statement laid over it.
export default function CubeWall() {
  const ref = useRef<HTMLElement>(null);
  const { mounted, active } = useNearViewport(ref);

  return (
    <section ref={ref} className="relative h-[78svh] max-h-[820px] min-h-[540px] overflow-hidden bg-[#eef1f5]">
      {/* Static cube pattern shown until the 3D wall loads */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(#dfe4eb_2px,transparent_2px),linear-gradient(90deg,#dfe4eb_2px,transparent_2px)] bg-[size:38px_38px]" />
      {mounted && (
        <div className="absolute inset-0">
          <CubeWallScene active={active} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(238,241,245,0.92)_0%,rgba(238,241,245,0.55)_32%,transparent_62%)]" />

      <div className="pointer-events-none relative flex h-full flex-col items-center justify-center px-5 text-center">
        <Reveal y={16}>
          <span className="eyebrow justify-center">Built block by block</span>
        </Reveal>
        <h2 className="heading-xl mt-5 max-w-3xl">
          <SplitText delay={0.1}>
            Every landmark starts with a <em className="text-gold-600">single block.</em>
          </SplitText>
        </h2>
        <Reveal delay={0.3} className="mt-6 max-w-xl">
          <p className="prose-body">
            We bring together the right land, the right developer and the right design — then build trust into every floor.
          </p>
        </Reveal>
        <Reveal delay={0.45} className="pointer-events-auto mt-9">
          <ButtonLink href="/about/" variant="navy">
            Our story
          </ButtonLink>
        </Reveal>
      </div>

      <p className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-[11px] text-navy-900/50">
        <MousePointer2 className="size-3" />
        <span className="pointer-coarse:hidden">Move your cursor across the wall</span>
        <span className="pointer-fine:hidden">Tap the wall</span>
      </p>
    </section>
  );
}
