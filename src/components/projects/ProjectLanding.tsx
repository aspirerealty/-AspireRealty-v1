import Image from "next/image";
import { Check, Download, MapPin, ShieldCheck } from "lucide-react";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import EnquireButton from "@/components/forms/EnquireButton";
import EnquiryForm from "@/components/forms/EnquiryForm";
import SectionNav from "@/components/landing/SectionNav";
import MobileCtaBar from "@/components/landing/MobileCtaBar";
import Gallery from "./Gallery";
import CollabBadge from "./CollabBadge";
import VideoReel from "./VideoReel";
import PlansGallery from "./PlansGallery";
import { type Project, categoryLabels } from "@/data/projects";
import { site, whatsappLink } from "@/data/site";

const goldBtn =
  "group inline-flex items-center justify-center gap-2 bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-950 transition-all duration-500 hover:bg-gold-400";
const lightBtn =
  "inline-flex items-center justify-center gap-2 border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:bg-white hover:text-navy-900";
const outlineBtn =
  "inline-flex items-center justify-center gap-2 border border-navy-900/25 px-6 py-3 text-sm font-semibold text-navy-900 transition-all duration-500 hover:border-navy-900 hover:bg-navy-900 hover:text-white";

// Landing page for a collaboration project, built entirely from its data in
// src/data/projects.ts (used for Engrace Vista and Soulace).
export default function ProjectLanding({ project }: { project: Project }) {
  const source = `${project.name} page`;
  const villa = project.category === "villa";
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "pricing", label: "Pricing" },
    ...(project.plans?.length ? [{ id: "plans", label: "Plans" }] : []),
    { id: "gallery", label: "Gallery" },
    ...(project.youtube?.length ? [{ id: "walkthrough", label: "Walkthrough" }] : []),
    ...(project.video ? [{ id: "video", label: "Video" }] : []),
    { id: "amenities", label: "Amenities" },
    { id: "location", label: "Location" },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-svh items-end overflow-hidden bg-navy-950">
        <Image src={project.heroImage} alt={`${project.name} by ${project.developer.name}`} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-navy-950/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/75 via-navy-950/20 to-transparent" />
        <div className="container-x relative pt-36 pb-16 text-white sm:pb-20">
          <Reveal y={16}>
            <CollabBadge developer={project.developer} tone="dark" />
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            {project.logo ? (
              <h1>
                <span className="sr-only">{project.name}</span>
                <Image src={project.logo.white} alt="" width={640} height={480} priority className="h-24 w-auto sm:h-32" />
              </h1>
            ) : (
              <h1 className="font-display text-6xl sm:text-7xl">{project.name}</h1>
            )}
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-xl text-white/85 sm:text-2xl">{project.type}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-white/65">
              <MapPin className="size-4 text-gold-400" /> {project.location}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
              {[...project.keyFacts.slice(0, 3), { label: "Starting price", value: project.startingPrice ?? "On request" }].map((f) => (
                <div key={f.label} className="bg-navy-950/60 px-5 py-4 backdrop-blur">
                  <dt className="text-[0.62rem] tracking-[0.2em] text-white/60 uppercase">{f.label}</dt>
                  <dd className="mt-1 font-display text-2xl text-gold-400">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.4} className="mt-10 flex flex-wrap gap-4">
            <EnquireButton title={`Download the ${project.name} brochure`} reason="Brochure" project={project.name} source={source} className={goldBtn}>
              <Download className="size-4" /> Download brochure
            </EnquireButton>
            <EnquireButton title="Book a free site visit" reason="Site visit" project={project.name} source={source} className={lightBtn}>
              Book a site visit
            </EnquireButton>
          </Reveal>
          {project.rera && <p className="mt-8 text-[11px] tracking-[0.15em] text-white/50 uppercase">RERA: {project.rera}</p>}
        </div>
      </section>
      <SectionNav sections={sections} />

      {/* ── Overview ── */}
      <section id="overview" className="scroll-mt-32 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow={`${categoryLabels[project.category]} · ${project.developer.name}`} title={project.name} intro={project.summary} />
            <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
              {project.highlights.map((h) => (
                <StaggerItem key={h} className="flex gap-3 text-muted">
                  <Check className="mt-1 size-4 shrink-0 text-gold-600" /> {h}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div>
            <ImageReveal className="relative aspect-[4/3] overflow-hidden">
              <Image src={project.gallery[0]?.src ?? project.cover} alt={project.gallery[0]?.alt ?? project.name} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </ImageReveal>
            <Stagger className="mt-px grid grid-cols-2 gap-px bg-navy-900/10 sm:grid-cols-3">
              {project.keyFacts.map((f) => (
                <StaggerItem key={f.label} className="bg-cream p-5">
                  <p className="font-display text-2xl text-navy-900">{f.value}</p>
                  <p className="mt-1 text-[0.65rem] tracking-[0.2em] text-muted uppercase">{f.label}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="scroll-mt-32 bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Pricing" title={villa ? "Villa configurations" : "Configurations & pricing"} />
          <div className={`mt-14 grid gap-6 ${project.units.length === 1 ? "lg:grid-cols-2" : ""}`}>
          <Stagger className={`grid gap-6 ${project.units.length === 3 ? "md:grid-cols-2 xl:grid-cols-3" : project.units.length > 1 ? "md:grid-cols-2" : ""}`}>
            {project.units.map((u) => (
              <StaggerItem key={u.config} className="flex flex-col border border-navy-900/10 bg-cream p-7 sm:p-9">
                <p className="font-display text-3xl text-navy-900">{u.config}</p>
                <dl className="mt-6 divide-y divide-navy-900/10 border-y border-navy-900/10 text-sm">
                  {u.plot && (
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-muted">Plot area</dt>
                      <dd className="font-semibold text-navy-900">{u.plot}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-muted">{villa ? "Villa built-up area" : "Super built-up area"}</dt>
                    <dd className="font-semibold text-navy-900">{u.sbua}</dd>
                  </div>
                  {u.carpet && (
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-muted">Carpet area</dt>
                      <dd className="font-semibold text-navy-900">{u.carpet}</dd>
                    </div>
                  )}
                </dl>
                <p className="mt-6 font-display text-4xl text-gold-600">{u.price}</p>
                <EnquireButton title={`${u.config} cost sheet`} reason={`Cost sheet — ${u.config}`} project={project.name} source={source} className={`${outlineBtn} mt-6`}>
                  Get detailed cost sheet
                </EnquireButton>
              </StaggerItem>
            ))}
          </Stagger>
          {project.units.length === 1 && (
            <ImageReveal className="relative min-h-80 overflow-hidden">
              <Image src={project.gallery[1]?.src ?? project.cover} alt={project.gallery[1]?.alt ?? ""} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </ImageReveal>
          )}
          </div>
          {project.priceNote && <p className="mt-6 max-w-3xl text-sm text-muted">{project.priceNote}</p>}
        </div>
      </section>

      {/* ── Plans ── */}
      {project.plans?.length ? (
        <section id="plans" className="scroll-mt-32 py-24 sm:py-32">
          <div className="container-x">
            <SectionHeading eyebrow="Plans" title={villa ? "Master plan & villa plans" : "Master plan & unit plans"} />
            <Reveal className="mt-14">
              <PlansGallery plans={project.plans} project={project.name} source={source} whatsappMessage={project.whatsappMessage} />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ── Gallery ── */}
      <section id="gallery" className="scroll-mt-32 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Gallery" title={`A closer look at ${project.name}`} />
          <div className="mt-14">
            <Gallery images={project.gallery} />
          </div>
          <p className="mt-6 text-xs text-muted">Images are artistic impressions for representation only, except where shot at site.</p>
        </div>
      </section>

      {/* ── Walkthrough videos (YouTube) ── */}
      {project.youtube?.length ? (
        <section id="walkthrough" className="scroll-mt-32 bg-white py-24 sm:py-32">
          <div className="container-x">
            <SectionHeading eyebrow="Walkthrough" title={`Take a tour of ${project.name}`} />
            <Stagger className={`mt-14 grid gap-8 ${project.youtube.length > 1 ? "lg:grid-cols-2" : "max-w-4xl"}`}>
              {project.youtube.map((v) => (
                <StaggerItem key={v.id}>
                  <div className="relative aspect-video overflow-hidden bg-navy-950 shadow-[0_30px_60px_-30px_rgba(9,44,76,0.5)]">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0`}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 size-full"
                    />
                  </div>
                  <p className="mt-3 font-display text-xl text-navy-900">{v.title}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* ── Video ── */}
      {project.video && (
        <section id="video" className="scroll-mt-32 bg-navy-950 py-24 text-white sm:py-32">
          <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-24">
            <Reveal>
              <span className="eyebrow text-gold-400">Straight from site</span>
              <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">{project.video.title}</h2>
              <p className="mt-6 max-w-lg text-lg text-white/70">
                See the finished community as it stands today — then book a visit and walk through your villa in person.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <EnquireButton title="Book a free site visit" reason="Site visit" project={project.name} source={source} className={goldBtn}>
                  Book a site visit
                </EnquireButton>
                <a href={whatsappLink(project.whatsappMessage)} target="_blank" rel="noreferrer" className={lightBtn}>
                  Ask on WhatsApp
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <VideoReel {...project.video} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Amenities ── */}
      <section id="amenities" className="scroll-mt-32 bg-white py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="Amenities" title="Everything you need, within the community" />
            <Stagger gap={0.04} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4">
              {project.amenities.map((a) => (
                <StaggerItem key={a} className="flex items-center gap-3 border-b border-navy-900/10 pb-4 text-navy-900">
                  <span className="size-1.5 shrink-0 rotate-45 bg-gold-500" />
                  {a}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <ImageReveal className="relative min-h-96 overflow-hidden">
            <Image src={project.gallery[1]?.src ?? project.cover} alt={project.gallery[1]?.alt ?? ""} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </ImageReveal>
        </div>
      </section>

      {/* ── Location ── */}
      <section id="location" className="scroll-mt-32 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading eyebrow="Location" title={project.locality} intro={project.location} />
            <Stagger className="mt-10 divide-y divide-navy-900/10 border-y border-navy-900/10">
              {project.connectivity.map((c) => (
                <StaggerItem key={c.place} className="flex items-center justify-between gap-4 py-4">
                  <span className="flex items-center gap-3 text-navy-900">
                    <MapPin className="size-4 shrink-0 text-gold-500" /> {c.place}
                  </span>
                  {c.time && <span className="shrink-0 font-semibold text-gold-600">{c.time}</span>}
                </StaggerItem>
              ))}
            </Stagger>
            {project.mapLink && (
              <a href={project.mapLink} target="_blank" rel="noreferrer" className={`${outlineBtn} mt-8`}>
                <MapPin className="size-4" /> Get directions
              </a>
            )}
          </div>
          <Reveal className="relative min-h-[420px] overflow-hidden border border-navy-900/10 bg-white">
            <iframe
              title={`${project.name} location map`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(project.mapQuery)}&z=14&output=embed`}
              className="absolute inset-0 size-full grayscale-[35%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      {/* ── Enquire ── */}
      <section id="enquire" className="relative overflow-hidden bg-navy-900 py-24 sm:py-32">
        <Image src={project.heroImage} alt="" fill sizes="100vw" className="object-cover opacity-15" />
        <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <span className="eyebrow text-gold-400">Enquire now</span>
            <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Make {project.name} <em className="text-gold-400">your address.</em>
            </h2>
            <p className="mt-6 max-w-md text-lg text-white/70">Get the cost sheet, floor plans and current offers, and book a free site visit.</p>
            <p className="mt-8 text-sm text-white/50">
              Or call us on{" "}
              <a href={site.phoneHref} className="text-gold-400 underline-offset-4 hover:underline">
                {site.phone}
              </a>
            </p>
          </Reveal>
          <Reveal delay={0.15} className="border border-white/10 bg-navy-950/40 p-6 backdrop-blur-sm sm:p-10">
            <EnquiryForm dark source={source} project={project.name} />
          </Reveal>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="bg-cream pt-10 pb-28 lg:pb-10">
        <div className="container-x flex flex-col gap-3 text-xs leading-relaxed text-muted">
          {project.rera && (
            <p className="flex items-center gap-2 font-semibold text-navy-900">
              <ShieldCheck className="size-4 text-gold-600" /> RERA: {project.rera} · rera.karnataka.gov.in
            </p>
          )}
          <p>
            Marketed by {site.name} in collaboration with {project.developer.name}. Prices, offers and specifications are indicative and subject to change
            without notice. Images are artistic impressions. This page is for information only and does not constitute an offer or contract.
          </p>
        </div>
      </section>

      <MobileCtaBar
        name={project.name}
        source={source}
        whatsappMessage={project.whatsappMessage}
        cta={{ title: "Book a free site visit", reason: "Site visit", short: "Visit" }}
      />
    </>
  );
}
