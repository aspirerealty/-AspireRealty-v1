import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/data/site";

// "Let's talk" block placed at the bottom of most pages.
export default function ContactSection({ source, project }: { source: string; project?: string }) {
  return (
    <section id="enquire" className="relative overflow-hidden bg-navy-900 py-24 sm:py-32">
      <Image src="/assets/images/interior-open.jpg" alt="" fill className="object-cover opacity-10" sizes="100vw" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal>
          <span className="eyebrow text-gold-400">Let&apos;s talk</span>
          <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Find your dream home. <em className="text-gold-400">We&apos;ll guide the way.</em>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
            Share your details and a property advisor will call you back with pricing, availability and current offers.
          </p>
          <div className="mt-10 space-y-4 text-white">
            <a href={site.phoneHref} className="flex items-center gap-4 transition-colors hover:text-gold-400">
              <span className="grid size-11 place-items-center rounded-full border border-white/20">
                <Phone className="size-4" />
              </span>
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-4 transition-colors hover:text-gold-400">
              <span className="grid size-11 place-items-center rounded-full border border-white/20">
                <Mail className="size-4" />
              </span>
              {site.email}
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="border border-white/10 bg-navy-950/40 p-6 backdrop-blur-sm sm:p-10">
          <EnquiryForm dark source={source} project={project} />
        </Reveal>
      </div>
    </section>
  );
}
