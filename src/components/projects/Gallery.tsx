"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Gallery({ images }: { images: { src: string; alt: string }[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" }, [Autoplay({ delay: 4500, stopOnInteraction: true })]);
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => embla && setIndex(embla.selectedScrollSnap()), [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-6">
          {images.map((img) => (
            <div key={img.src} className="relative aspect-[4/5] min-w-0 flex-[0_0_82%] overflow-hidden bg-navy-900 sm:flex-[0_0_46%] lg:flex-[0_0_31%]">
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 82vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={() => embla?.scrollTo(i)}
              className={`h-1 transition-all duration-500 ${i === index ? "w-10 bg-gold-500" : "w-5 bg-navy-900/20"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous" onClick={() => embla?.scrollPrev()} className="grid size-12 place-items-center rounded-full border border-navy-900/20 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white">
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" aria-label="Next" onClick={() => embla?.scrollNext()} className="grid size-12 place-items-center rounded-full border border-navy-900/20 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white">
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
