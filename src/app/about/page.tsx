import type { Metadata } from "next";
import Image from "next/image";
import { Building, Handshake, KeyRound, ShieldCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import ContactSection from "@/components/sections/ContactSection";
import FeatureCards from "@/components/sections/FeatureCards";
import BlueprintBackdrop from "@/components/sections/BlueprintBackdrop";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `${site.name} collaborates with trusted developers to bring thoughtfully designed homes to Bengaluru families.`,
};

const values = [
  { icon: <Handshake />, title: "Trusted collaborations", text: "We work only with developers whose approvals, finances and construction quality we have verified ourselves." },
  { icon: <ShieldCheck />, title: "Transparency first", text: "Every price, charge and offer is explained in writing before you commit. No surprises at registration." },
  { icon: <Building />, title: "Handpicked locations", text: "We focus on growth corridors with real infrastructure, schools and workplaces — not just promises." },
  { icon: <KeyRound />, title: "Customer first", text: "One dedicated advisor from your first enquiry until the day you receive your keys." },
];

const journey = [
  { step: "01", title: "Understand", text: "We listen to your needs — family, budget, commute and timeline." },
  { step: "02", title: "Shortlist", text: "Clear, side-by-side comparisons of the options that genuinely fit." },
  { step: "03", title: "Visit", text: "Guided site visits with pickup and drop, at a time that suits you." },
  { step: "04", title: "Finance", text: "Help comparing home loans and payment plans from leading banks." },
  { step: "05", title: "Book", text: "Documentation, agreements and registration handled with you." },
  { step: "06", title: "Handover", text: "We stay with you through construction updates to the final keys." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Where aspirations turn into reality" image="/assets/images/towers-skyward.jpg" crumbs={[{ href: "/", label: "Home" }, { label: "About" }]} />

      <section className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title={
                <>
                  A realty partner built on <em className="text-gold-600">trust and dedication</em>
                </>
              }
            />
            <Reveal delay={0.1} className="mt-6 space-y-5 prose-body">
              <p>
                {site.name} brings together Bengaluru&apos;s trusted developers and the families looking for their next home. Rather than doing it all
                alone, we collaborate — combining a developer&apos;s construction expertise with our focus on planning, marketing and customer care.
              </p>
              <p>
                That partnership means you get landmark projects at honest prices, and a single team that stays accountable to you from the first site
                visit to the day you move in.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageReveal className="relative aspect-[3/4] overflow-hidden">
              <Image src="/assets/images/blueprint.jpg" alt="Architect reviewing drawings" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
            </ImageReveal>
            <ImageReveal className="relative mt-16 aspect-[3/4] overflow-hidden" delay={0.2}>
              <Image src="/assets/images/site-workers.jpg" alt="Engineers on a construction site" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
            </ImageReveal>
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-24 text-white sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow text-gold-400">Our mission</span>
            <p className="mt-6 font-display text-3xl leading-snug sm:text-4xl">
              To make buying a home simple, transparent and joyful — by partnering only with developers we would trust with our own families.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="eyebrow text-gold-400">Our vision</span>
            <p className="mt-6 font-display text-3xl leading-snug sm:text-4xl">
              To be Bengaluru&apos;s most trusted name in collaborative real estate — known for the homes we bring and the promises we keep.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 sm:py-32">
        <BlueprintBackdrop />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            eyebrow="Our values"
            title={
              <>
                Built with care. <em className="text-gold-600">Delivered with pride.</em>
              </>
            }
          />
          <div className="mt-16">
            <FeatureCards items={values} />
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="How we work" title="Your journey home, step by step" />
          <Stagger className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {journey.map((j) => (
              <StaggerItem key={j.step} className="border-t border-navy-900/15 pt-6">
                <span className="font-display text-5xl text-gold-500">{j.step}</span>
                <h3 className="mt-4 font-display text-2xl text-navy-900">{j.title}</h3>
                <p className="mt-2 text-muted">{j.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <ContactSection source="About page" />
    </>
  );
}
