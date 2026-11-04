import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building, Handshake, KeyRound, ShieldCheck } from "lucide-react";
import Hero from "@/components/home/Hero";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";
import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import ProjectCarousel from "@/components/projects/ProjectCarousel";
import BlogCard from "@/components/blog/BlogCard";
import Faq from "@/components/sections/Faq";
import FeatureCards from "@/components/sections/FeatureCards";
import BlueprintBackdrop from "@/components/sections/BlueprintBackdrop";
import CubeWall from "@/components/three/CubeWall";
import ContactSection from "@/components/sections/ContactSection";
import { getProject, projects, projectsIn } from "@/data/projects";
import { blogs } from "@/data/blogs";
import { faqs } from "@/data/faqs";
import { stats } from "@/data/site";

const pillars = [
  { icon: <Handshake />, title: "Trusted collaborations", text: "We partner only with developers whose approvals, track record and construction quality we've verified." },
  { icon: <ShieldCheck />, title: "Transparent advice", text: "Clear pricing, honest comparisons and every charge explained before you commit." },
  { icon: <Building />, title: "Handpicked locations", text: "Growth corridors with strong infrastructure, schools and workplaces close by." },
  { icon: <KeyRound />, title: "With you till the keys", text: "From site visit and home loan to registration and handover — one team, start to finish." },
];

export default function Home() {
  const featured = getProject("sky-and-high");

  return (
    <>
      <Hero />

      {/* About */}
      <section id="about" className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <ImageReveal className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image src="/assets/projects/sky-and-high/twin-towers-golden-hour.jpg" alt="Sky & High twin towers at golden hour" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-[50%_35%]" />
            </ImageReveal>
            <Reveal delay={0.3} className="absolute -bottom-10 -left-4 hidden w-56 bg-navy-900 p-6 text-white shadow-2xl sm:block lg:-left-10">
              <p className="font-display text-5xl text-gold-400">
                <Counter value={47} prefix="G+" />
              </p>
              <p className="mt-2 text-sm text-white/70">
                <span className="font-semibold text-white">Sky &amp; High</span> — our landmark collaboration on Sarjapura Main Road
              </p>
            </Reveal>
          </div>
          <div>
            <SectionHeading
              eyebrow="About us"
              title={
                <>
                  Building trust, <em className="text-gold-600">one home</em> at a time
                </>
              }
              intro="Aspire Ventures Realty brings together Bengaluru's trusted developers and the families looking for their next home. We collaborate on every project — from planning and launch to sales and handover — so you always have one team accountable to you."
            />
            <Reveal delay={0.2} className="mt-10">
              <ButtonLink href="/about/" variant="navy">
                Our story
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-navy-900/10 bg-white">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className={`py-12 text-center ${i > 0 ? "lg:border-l" : ""} ${i % 2 ? "border-l" : ""} border-navy-900/10`}>
              <p className="font-display text-5xl text-navy-900 sm:text-6xl">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured launch */}
      {featured && (
        <section className="relative overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
          <Image src={featured.heroImage} alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" />
          <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <span className="eyebrow text-gold-400">{featured.badge} · New launch</span>
              <h2 className="mt-5 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
                The next big address in <em className="text-gold-400">Sarjapura</em> is about to rise.
              </h2>
              <p className="mt-6 max-w-xl text-lg text-white/70">{featured.summary}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href={featured.page}>View project</ButtonLink>
                <ButtonLink href="#enquire" variant="outline-light">
                  Register your interest
                </ButtonLink>
              </div>
            </Reveal>
            <Stagger className="grid grid-cols-2 gap-px bg-white/10">
              {featured.keyFacts.map((f) => (
                <StaggerItem key={f.label} className="bg-navy-950/80 p-6 backdrop-blur">
                  <p className="font-display text-3xl text-gold-400">{f.value}</p>
                  <p className="mt-1 text-xs tracking-[0.2em] text-white/60 uppercase">{f.label}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="Our collaborations" title="Explore our projects" intro="Every project is a collaboration with a developer we trust — selected for location, quality and long-term value." />
            <Reveal>
              <ButtonLink href="/projects/" variant="outline">
                View all projects
              </ButtonLink>
            </Reveal>
          </div>
          <Reveal className="mt-14">
            <ProjectCarousel projects={projects} />
          </Reveal>
        </div>
      </section>

      {/* Why us */}
      <section className="relative overflow-hidden bg-white py-24 sm:py-32">
        <BlueprintBackdrop />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            eyebrow="Why Aspire"
            title={
              <>
                Built with care. <em className="text-gold-600">Delivered with pride.</em>
              </>
            }
          />
          <div className="mt-16">
            <FeatureCards items={pillars} />
          </div>
        </div>
      </section>

      {/* Interactive cube wall */}
      <CubeWall />

      {/* Apartments & villas */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="Find your home" title="Apartments or villas?" />
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              { href: "/apartments/", label: "Apartments", text: "High-rise living off Sarjapur Road — 2 & 3 BHK homes with world-class amenities.", image: "/assets/projects/engrace-vista/towers.jpg", count: projectsIn("apartment").length },
              { href: "/villas/", label: "Villas", text: "Independent 4 & 5 BHK villas with private elevators and room to grow.", image: "/assets/projects/soulace/avenue.jpg", count: projectsIn("villa").length },
            ].map((c) => (
              <StaggerItem key={c.href}>
                <Link href={c.href} className="group relative block aspect-[16/10] overflow-hidden bg-navy-900">
                  <Image src={c.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-white sm:p-8">
                    <div>
                      <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold-400 uppercase">
                        {c.count} {c.count === 1 ? "project" : "projects"}
                      </p>
                      <h3 className="mt-2 font-display text-4xl sm:text-5xl">{c.label}</h3>
                      <p className="mt-2 max-w-sm text-sm text-white/75">{c.text}</p>
                    </div>
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold-500 group-hover:text-navy-950">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Blogs */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="Insights" title="Latest from our blog" />
            <Reveal>
              <ButtonLink href="/blogs/" variant="outline">
                All articles
              </ButtonLink>
            </Reveal>
          </div>
          <Stagger className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 3).map((post) => (
              <StaggerItem key={post.slug}>
                <BlogCard post={post} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" intro="Can't find what you're looking for? Our advisors are a call away." />
          <Reveal>
            <Faq items={faqs} />
          </Reveal>
        </div>
      </section>

      <ContactSection source="Home page" />
    </>
  );
}
