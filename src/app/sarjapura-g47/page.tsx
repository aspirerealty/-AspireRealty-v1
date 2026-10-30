import type { Metadata } from "next";
import Image from "next/image";
import {
  Building,
  BuildingComplex,
  Car,
  Check,
  Download,
  HardHat,
  House,
  IndianRupee,
  Leaf,
  MapPin,
  Sparkles,
  TrendingUp,
  Trees,
} from "lucide-react";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import EnquireButton from "@/components/forms/EnquireButton";
import EnquiryForm from "@/components/forms/EnquiryForm";
import Gallery from "@/components/projects/Gallery";
import LandingHero from "@/components/landing/LandingHero";
import SectionNav from "@/components/landing/SectionNav";
import MobileCtaBar from "@/components/landing/MobileCtaBar";
import Faq from "@/components/sections/Faq";
import TowersShowcase from "@/components/three/TowersShowcase";
import FlatExplorer from "@/components/three/FlatExplorer";
import BlueprintBackdrop from "@/components/sections/BlueprintBackdrop";
import { getProject } from "@/data/projects";
import { site, whatsappLink } from "@/data/site";

// TODO: replace with the final project name when it's announced.
const PROJECT_NAME = "Sarjapura G+47";

const project = getProject("sarjapura-g47")!;

export const metadata: Metadata = {
  title: `${PROJECT_NAME} — 2 & 3 BHK on Sarjapura Main Road | EOI Open`,
  description:
    "G+47 floors, 2 signature towers, 2 & 3 BHK homes from ₹1.10 Cr on Sarjapura Main Road, opposite DMart. 80% open space, 50+ amenities. EOI now open — No FRC for the first 200 customers.",
};

const features = [
  { icon: Building, title: "G + 47 Floors", text: "A landmark skyline is taking shape on Sarjapura Main Road." },
  { icon: BuildingComplex, title: "2 Signature Towers", text: "Two soaring towers designed to redefine the Sarjapura skyline." },
  { icon: House, title: "2 & 3 BHK Homes", text: "Thoughtfully designed — more space for families, more flexibility for the future." },
  { icon: Car, title: "Multi-Level Car Parking", text: "Smart MLCP parking keeps the living spaces uncluttered." },
  { icon: Trees, title: "80% Open Space", text: "More breathing room. More greenery. Less concrete dominance." },
  { icon: Sparkles, title: "50+ Amenities", text: "Recreation, wellness, fitness and community living, brought together." },
  { icon: Leaf, title: "“Breakout Spaaces”", text: "Dedicated pockets of experiences rather than one conventional clubhouse." },
  { icon: HardHat, title: "MIVAN Technology", text: "Precision-driven construction for consistency, speed and quality." },
  { icon: MapPin, title: "Opposite DMart", text: "On Sarjapura Main Road — everyday convenience literally across the road." },
  { icon: IndianRupee, title: "Aggressively Priced", text: "A landmark address without the landmark price tag." },
  { icon: TrendingUp, title: "Value-for-Money", text: "Bigger lifestyle. Better specifications. Stronger value proposition." },
];

const sections = [
  { id: "overview", label: "Overview" },
  { id: "rise", label: "3D View" },
  { id: "pricing", label: "Pricing" },
  { id: "offer", label: "EOI Offer" },
  { id: "plans", label: "Plans" },
  { id: "home-3d", label: "3D Home" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "gallery", label: "Gallery" },
];

const landingFaqs = [
  {
    q: "What is the EOI and why should I register now?",
    a: "The Expression of Interest (EOI) lets you register before the official launch. EOI customers get priority access to launch information, configurations and introductory pricing — and the first 200 customers get No FRC and their choice of floor.",
  },
  {
    q: "What are the apartment sizes and prices?",
    a: "2 BHK homes range from 1,100 – 1,200 sq. ft., starting at ₹1.10 Cr. 3 BHK homes range from 1,350 – 1,500 sq. ft., priced at ₹1.30 – 1.50 Cr. Request the price breakup for a detailed cost sheet.",
  },
  {
    q: "Where exactly is the project?",
    a: "On Sarjapura Main Road, right opposite DMart — with schools, hospitals, retail and the tech corridor close by.",
  },
  {
    q: "What is MIVAN construction?",
    a: "MIVAN (aluminium formwork) casts walls and slabs together in concrete. It delivers precise, consistent, low-maintenance structures and allows faster construction cycles.",
  },
];

const source = `${PROJECT_NAME} landing page`;
const outlineBtn =
  "group inline-flex items-center justify-center gap-2 border border-navy-900/25 px-6 py-3 text-sm font-semibold text-navy-900 transition-all duration-500 hover:border-navy-900 hover:bg-navy-900 hover:text-white";
const goldBtn =
  "group inline-flex items-center justify-center gap-2 bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-950 transition-all duration-500 hover:bg-gold-400";

export default function SarjapuraG47Page() {
  return (
    <>
      <LandingHero name={PROJECT_NAME} partner={project.partner} source={source} />
      <SectionNav sections={sections} />

      {/* Overview */}
      <section id="overview" className="scroll-mt-32 py-24 sm:py-32">
        <div className="container-x">
          <div className="grid items-end gap-10 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Overview"
              title={
                <>
                  Something tall. Something spacious. <em className="text-gold-600">Something seriously value-driven.</em>
                </>
              }
            />
            <Reveal delay={0.1}>
              <p className="prose-body">
                The next big address in Sarjapura is about to rise. Two G+47 signature towers on Sarjapura Main Road, built with MIVAN technology, with
                80% open space and 50+ amenities spread across dedicated “Breakout Spaaces”.
              </p>
            </Reveal>
          </div>
          <Stagger gap={0.06} className="mt-16 grid gap-px bg-navy-900/10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title} className="group bg-cream p-7 transition-colors duration-500 hover:bg-navy-900">
                <Icon className="size-8 text-gold-500" strokeWidth={1.4} />
                <h3 className="mt-5 font-display text-2xl text-navy-900 transition-colors group-hover:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted transition-colors group-hover:text-white/70">{text}</p>
              </StaggerItem>
            ))}
            <StaggerItem className="flex flex-col justify-between gap-6 bg-gold-500 p-7">
              <p className="font-display text-2xl text-navy-950">Want the full project details?</p>
              <EnquireButton title="Download the e-brochure" reason="Brochure" project={PROJECT_NAME} source={source} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-950 underline-offset-4 hover:underline">
                <Download className="size-4" /> Download brochure
              </EnquireButton>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* 3D towers */}
      <section id="rise" className="relative scroll-mt-32 overflow-hidden bg-cream py-24 sm:py-32">
        <BlueprintBackdrop />
        <div className="container-x relative">
          <div className="grid items-end gap-8 lg:grid-cols-2">
            <Reveal>
              <span className="eyebrow">Watch it rise</span>
              <h2 className="heading-lg mt-4">
                Two towers. <em className="text-gold-600">Forty-seven floors.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="prose-body">
                Watch the twin G+47 towers stack up floor by floor above their landscaped podium. Pick any floor, tap the labels to explore, and
                switch to night to see the windows glow.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="mt-14">
            <TowersShowcase />
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-32 bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Pricing" title="Premium 2 & 3 BHK apartments" intro="Special pre-launch pricing. Construction-linked plan at around ₹9,000 / sq. ft." />
          {/* Phones: one card per configuration */}
          <Stagger className="mt-12 grid gap-4 sm:hidden">
            {project.units.map((u) => (
              <StaggerItem key={u.config} className="border border-navy-900/10 bg-cream p-6">
                <p className="font-display text-3xl text-navy-900">{u.config}</p>
                <p className="mt-1 text-muted">{u.size}</p>
                <p className="mt-3 text-xl font-semibold text-navy-900">{u.price}</p>
                <EnquireButton title={`${u.config} price breakup`} reason={`Price breakup — ${u.config}`} project={PROJECT_NAME} source={source} className={`${outlineBtn} mt-5 w-full`}>
                  Price breakup
                </EnquireButton>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-14 hidden sm:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-navy-900 text-xs tracking-[0.2em] text-muted uppercase">
                  <th className="py-4 pr-4 font-semibold">Configuration</th>
                  <th className="py-4 pr-4 font-semibold">Size</th>
                  <th className="py-4 pr-4 font-semibold">Price</th>
                  <th className="py-4" />
                </tr>
              </thead>
              <tbody>
                {project.units.map((u) => (
                  <tr key={u.config} className="border-b border-navy-900/10">
                    <td className="py-7 pr-4 font-display text-3xl text-navy-900">{u.config}</td>
                    <td className="py-7 pr-4 text-muted">{u.size}</td>
                    <td className="py-7 pr-4 text-lg font-semibold text-navy-900">{u.price}</td>
                    <td className="py-7 text-right">
                      <EnquireButton title={`${u.config} price breakup`} reason={`Price breakup — ${u.config}`} project={PROJECT_NAME} source={source} className={outlineBtn}>
                        Price breakup
                      </EnquireButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal className="mt-8 flex flex-wrap items-center gap-4">
            <EnquireButton title="Get the detailed cost sheet" reason="Cost sheet" project={PROJECT_NAME} source={source} className={goldBtn}>
              <Download className="size-4" /> Download cost sheet
            </EnquireButton>
            <p className="text-sm text-muted">Prices are indicative and subject to change. Taxes and registration extra.</p>
          </Reveal>
        </div>
      </section>

      {/* EOI offer */}
      <section id="offer" className="relative scroll-mt-32 overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute -top-32 -left-32 size-[30rem] rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <span className="eyebrow text-gold-400">Expression of interest now open</span>
            <h2 className="mt-5 font-display text-5xl leading-[1.02] sm:text-6xl">
              Exclusive for the <em className="text-gold-400">first 200</em> customers
            </h2>
            <ul className="mt-10 space-y-5">
              {project.offer!.points.map((point) => (
                <li key={point} className="flex items-start gap-4 text-lg">
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-950">
                    <Check className="size-4" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-white/50">{project.offer!.note}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <EnquireButton title="Register your EOI" reason="EOI registration" project={PROJECT_NAME} source={source} className={goldBtn}>
                Register my EOI
              </EnquireButton>
              <a
                href={whatsappLink(project.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/30 px-7 py-3.5 text-sm font-semibold transition-all duration-500 hover:bg-white hover:text-navy-900"
              >
                Ask on WhatsApp
              </a>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            <ImageReveal className="relative aspect-[9/16] overflow-hidden">
              <Image src="/assets/images/sarjapura-poster-2.jpg" alt="EOI offer poster" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
            </ImageReveal>
            <ImageReveal className="relative mt-12 aspect-[9/16] overflow-hidden" delay={0.2}>
              <Image src="/assets/images/sarjapura-poster-1.jpg" alt="No Pre-EMI offer poster" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
            </ImageReveal>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="scroll-mt-32 py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Plans"
            title="Master plan & floor plans"
            intro="Detailed master plan, tower plans and unit plans for every 2 & 3 BHK configuration are shared on request with EOI customers."
          />
          <Stagger className="grid gap-4 sm:grid-cols-3">
            {["Master plan", "Floor plans", "Unit plans"].map((plan) => (
              <StaggerItem key={plan}>
                <EnquireButton
                  title={`Get the ${plan.toLowerCase()}`}
                  reason={plan}
                  project={PROJECT_NAME}
                  source={source}
                  className="group flex aspect-square w-full flex-col items-center justify-center gap-4 border border-navy-900/15 bg-white p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:border-gold-500 hover:shadow-xl"
                >
                  <svg viewBox="0 0 48 48" className="size-12 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                    <rect x="6" y="6" width="36" height="36" />
                    <path d="M6 22h16V6M22 30h20M30 30v12M14 22v8h8" />
                  </svg>
                  <span className="font-display text-xl text-navy-900">{plan}</span>
                  <span className="text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">Request</span>
                </EnquireButton>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 3D home */}
      <section id="home-3d" className="scroll-mt-32 bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Explore in 3D"
            title={
              <>
                Step inside a <em className="text-gold-600">2 BHK home</em>
              </>
            }
            intro="Rotate the home, zoom in, and tap any room to fly inside and see its size."
          />
          <Reveal className="mt-12">
            <FlatExplorer project={PROJECT_NAME} source={source} />
          </Reveal>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="scroll-mt-32 bg-white py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="50+ amenities"
              title={
                <>
                  “Breakout Spaaces” — <em className="text-gold-600">not just a clubhouse</em>
                </>
              }
              intro="Instead of one conventional clubhouse, amenities are spread across dedicated pockets of experience — for recreation, wellness, fitness and community living."
            />
            <Stagger gap={0.05} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4">
              {project.amenities.map((a) => (
                <StaggerItem key={a} className="flex items-center gap-3 border-b border-navy-900/10 pb-4 text-navy-900">
                  <span className="size-1.5 shrink-0 rotate-45 bg-gold-500" />
                  {a}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <ImageReveal className="relative min-h-96 overflow-hidden">
            <Image src="/assets/images/amenity-pool.jpg" alt="Illustrative pool deck at dusk" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <span className="absolute bottom-4 left-4 bg-navy-950/70 px-3 py-1 text-xs text-white/80 backdrop-blur">Representative image</span>
          </ImageReveal>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="scroll-mt-32 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading eyebrow="Location" title="Sarjapura Main Road, opposite DMart" intro="Everyday convenience across the road, with the city's biggest employment hubs a short drive away." />
            <Stagger className="mt-10 divide-y divide-navy-900/10 border-y border-navy-900/10">
              {project.connectivity.map((c) => (
                <StaggerItem key={c.place} className="flex items-center justify-between py-4">
                  <span className="flex items-center gap-3 text-navy-900">
                    <MapPin className="size-4 text-gold-500" /> {c.place}
                  </span>
                  <span className="font-semibold text-gold-600">{c.time}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Reveal className="relative min-h-[420px] overflow-hidden border border-navy-900/10 bg-white">
            <iframe
              title="Project location map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(project.mapQuery)}&z=14&output=embed`}
              className="absolute inset-0 size-full grayscale-[35%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="scroll-mt-32 bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Gallery" title="A glimpse of what's rising" />
          <div className="mt-14">
            <Gallery images={project.gallery} />
          </div>
          <p className="mt-6 text-xs text-muted">Images are artistic impressions for representation only.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQ" title="Before you register" />
          <Reveal>
            <Faq items={landingFaqs} />
          </Reveal>
        </div>
      </section>

      {/* EOI form */}
      <section id="enquire" className="relative overflow-hidden bg-navy-900 py-24 sm:py-32">
        <Image src={project.heroImage} alt="" fill sizes="100vw" className="object-cover opacity-15" />
        <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <span className="eyebrow text-gold-400">Something big is coming</span>
            <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Are you ready to be <em className="text-gold-400">among the first?</em>
            </h2>
            <p className="mt-6 max-w-md text-lg text-white/70">
              Register your interest before the official launch for priority access to configurations and introductory pricing.
            </p>
            <p className="mt-8 text-sm text-white/50">
              Or call us on{" "}
              <a href={site.phoneHref} className="text-gold-400 underline-offset-4 hover:underline">
                {site.phone}
              </a>
            </p>
          </Reveal>
          <Reveal delay={0.15} className="border border-white/10 bg-navy-950/40 p-6 backdrop-blur-sm sm:p-10">
            <EnquiryForm dark source={source} project={PROJECT_NAME} defaultReason="EOI registration" />
          </Reveal>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-cream pt-10 pb-28 lg:pb-10">
        <p className="container-x text-xs leading-relaxed text-muted">
          Project RERA: Coming soon. Marketed by {site.name} in collaboration with {project.partner}. Prices, offers and specifications are indicative and
          subject to change without notice. Images are artistic impressions. This page is for information only and does not constitute an offer or
          contract. *Terms &amp; conditions apply.
        </p>
      </section>

      <MobileCtaBar name={PROJECT_NAME} source={source} whatsappMessage={project.whatsappMessage} />
    </>
  );
}
