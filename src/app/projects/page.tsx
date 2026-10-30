import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectTabs from "@/components/projects/ProjectTabs";
import { Reveal } from "@/components/motion/Reveal";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore residential projects by Aspire Ventures Realty in collaboration with Bengaluru's trusted developers.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero eyebrow="Our collaborations" title="Explore our projects" image="/assets/images/sarjapura-tower-dusk.jpg" crumbs={[{ href: "/", label: "Home" }, { label: "Projects" }]} />

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Projects"
            title="Homes we're proud to stand behind"
            intro="Each project is a collaboration with a developer we trust, selected for its location, construction quality and long-term value."
          />
          <div className="mt-14">
            <ProjectTabs />
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <Reveal className="relative grid overflow-hidden bg-gold-100 md:grid-cols-2">
            <div className="relative min-h-72">
              <Image src="/assets/images/home-keys.jpg" alt="House keys on a table" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="p-8 sm:p-14">
              <span className="eyebrow">Refer &amp; earn</span>
              <h2 className="mt-4 font-display text-4xl text-navy-900 sm:text-5xl">Share a home, earn a reward</h2>
              <p className="mt-4 text-muted">Refer friends and family to any of our projects and earn rewards on every successful booking.</p>
              <Link href="/referral/" className="group mt-8 inline-flex items-center gap-2 font-semibold text-navy-900">
                Know more <ArrowUpRight className="size-4 text-gold-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactSection source="Projects page" />
    </>
  );
}
