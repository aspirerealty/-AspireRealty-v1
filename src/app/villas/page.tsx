import type { Metadata } from "next";
import Image from "next/image";
import { Check, Compass, Landmark, PencilRuler, TrendingUp } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import EnquiryForm from "@/components/forms/EnquiryForm";
import Faq from "@/components/sections/Faq";
import FeatureCards from "@/components/sections/FeatureCards";
import BlueprintBackdrop from "@/components/sections/BlueprintBackdrop";
import { getProject } from "@/data/projects";
import { site, whatsappLink } from "@/data/site";

// Pre-launch page for the upcoming villa plots project. When the details are
// shared, fill in the project in src/data/projects.ts and extend this page
// (pricing, layout plan, location, gallery) like /sarjapura-g47/.
const project = getProject("villa-plots")!;

export const metadata: Metadata = {
  title: "Villa Plots — Coming Soon",
  description: "Premium villa plots by Aspire Ventures Realty, coming soon. Register your interest to be first to receive the location, layout and launch pricing.",
};

const reasons = [
  { icon: <PencilRuler />, title: "Build it your way", text: "Design a home around your family — your layout, your elevation, your timeline." },
  { icon: <TrendingUp />, title: "Land appreciates", text: "Land is the part of real estate that grows in value over time, making plots a strong long-term asset." },
  { icon: <Compass />, title: "Room to breathe", text: "No shared walls or floors above — private space, sunlight and greenery on every side." },
  { icon: <Landmark />, title: "A lasting legacy", text: "A plot in a planned community is an asset your family can build on for generations." },
];

const firstAccess = ["Exact location & connectivity", "Master layout plan", "Plot sizes & facings", "Launch pricing & offers", "Approval details", "Priority plot selection"];

const faqs = [
  {
    q: "Where is the villa plots project located?",
    a: "The location will be announced at launch. Register your interest and you'll be among the first to receive it, along with the layout plan and pricing.",
  },
  {
    q: "Can I build my own villa on the plot?",
    a: "Yes — villa plots let you design and build your own home, subject to the community's building guidelines and local approvals.",
  },
  {
    q: "Will the project have approvals and RERA registration?",
    a: "Approval and RERA details will be shared at launch. We only market projects with clear titles and the required approvals.",
  },
  {
    q: "Is there any obligation if I register now?",
    a: "No. Registering simply puts you on the priority list for launch information — there's no payment or commitment.",
  },
];

const source = "Villas page";

export default function VillasPage() {
  return (
    <>
      <PageHero
        eyebrow="Coming soon · Villa plots"
        title="Your land. Your villa. Your way."
        image={project.heroImage}
        crumbs={[{ href: "/", label: "Home" }, { label: "Villas" }]}
      />

      {/* Intro */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal className="flex flex-wrap items-center gap-3">
              <span className="bg-gold-500 px-3 py-1 text-[0.65rem] font-bold tracking-[0.25em] text-navy-950 uppercase">{project.badge}</span>
              <span className="text-xs font-semibold tracking-[0.3em] text-muted uppercase">In collaboration with {project.partner}</span>
            </Reveal>
            <div className="mt-8">
              <SectionHeading
                eyebrow="Premium villa plots"
                title={
                  <>
                    A new villa plot community is <em className="text-gold-600">on its way</em>
                  </>
                }
                intro={project.summary}
              />
            </div>
            <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-4">
              <a
                href="#register"
                className="inline-flex items-center gap-2 bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-950 transition-colors duration-500 hover:bg-gold-400"
              >
                Register your interest
              </a>
              <a
                href={whatsappLink(project.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-navy-900/25 px-7 py-3.5 text-sm font-semibold text-navy-900 transition-all duration-500 hover:bg-navy-900 hover:text-white"
              >
                Ask on WhatsApp
              </a>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageReveal className="relative aspect-[3/4] overflow-hidden">
              <Image src="/assets/images/villa-modern.jpg" alt="Contemporary villa with a private pool" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
            </ImageReveal>
            <ImageReveal className="relative mt-16 aspect-[3/4] overflow-hidden" delay={0.2}>
              <Image src="/assets/images/villa-dusk.jpg" alt="Villa lit at dusk" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
            </ImageReveal>
          </div>
        </div>
      </section>

      {/* Why plots */}
      <section className="relative overflow-hidden bg-white py-24 sm:py-32">
        <BlueprintBackdrop />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            eyebrow="Why a villa plot"
            title={
              <>
                More than a home — <em className="text-gold-600">a foundation</em>
              </>
            }
          />
          <div className="mt-16">
            <FeatureCards items={reasons} />
          </div>
        </div>
      </section>

      {/* Image band */}
      <section className="relative h-[60vh] min-h-96 overflow-hidden">
        <Image src="/assets/images/villa-pool-2.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-navy-950/50" />
        <Reveal className="container-x relative flex h-full items-center">
          <p className="max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Imagine waking up in a home <em className="text-gold-400">designed entirely by you.</em>
          </p>
        </Reveal>
        <span className="absolute right-4 bottom-4 bg-navy-950/70 px-3 py-1 text-xs text-white/80 backdrop-blur">Representative image</span>
      </section>

      {/* First access */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading
            eyebrow="Be the first to know"
            title="Registered buyers get first access to"
            intro="Launch details go to our priority list before they're shared publicly."
          />
          <Stagger gap={0.06} className="grid gap-4 sm:grid-cols-2">
            {firstAccess.map((item) => (
              <StaggerItem key={item} className="flex items-center gap-4 border border-navy-900/10 bg-white p-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-950">
                  <Check className="size-4" />
                </span>
                <span className="font-medium text-navy-900">{item}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQ" title="Villa plot questions" />
          <Reveal>
            <Faq items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* Register */}
      <section id="register" className="relative overflow-hidden bg-navy-900 py-24 sm:py-32">
        <Image src="/assets/images/villa-pool-3.jpg" alt="" fill sizes="100vw" className="object-cover opacity-15" />
        <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <span className="eyebrow text-gold-400">Priority list</span>
            <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Register your interest <em className="text-gold-400">today</em>
            </h2>
            <p className="mt-6 max-w-md text-lg text-white/70">No payment, no obligation — just first access to the location, layout and launch pricing.</p>
            <p className="mt-8 text-sm text-white/50">
              Or call us on{" "}
              <a href={site.phoneHref} className="text-gold-400 underline-offset-4 hover:underline">
                {site.phone}
              </a>
            </p>
          </Reveal>
          <Reveal delay={0.15} className="border border-white/10 bg-navy-950/40 p-6 backdrop-blur-sm sm:p-10">
            <EnquiryForm dark source={source} project="Villa Plots" defaultReason="Villa plots — register interest" />
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-10">
        <p className="container-x text-xs leading-relaxed text-muted">
          Images are representative only. Project details, approvals and RERA registration will be shared at launch. This page is for information only
          and does not constitute an offer or contract.
        </p>
      </section>
    </>
  );
}
