import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Download, MapPin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Gallery from "@/components/projects/Gallery";
import EnquireButton from "@/components/forms/EnquireButton";
import ContactSection from "@/components/sections/ContactSection";
import { getProject, projects, statusLabels } from "@/data/projects";

// Projects with their own landing page (e.g. /sarjapura-g47/) don't use this template.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((p) => !p.landingPage).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.type} in ${project.locality}`, description: project.summary };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const source = `Project page: ${project.slug}`;
  const label = `${project.type} (${project.partner})`;

  return (
    <>
      <PageHero
        eyebrow={`In collaboration with ${project.partner}`}
        title={project.type}
        image={project.heroImage}
        crumbs={[{ href: "/", label: "Home" }, { href: "/projects/", label: "Projects" }, { label: project.locality }]}
      />

      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal className="flex flex-wrap items-center gap-3">
              <span className="bg-navy-900 px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-white uppercase">{statusLabels[project.status]}</span>
              {project.badge && <span className="bg-gold-500 px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-navy-950 uppercase">{project.badge}</span>}
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="size-4 text-gold-500" /> {project.location}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 font-display text-3xl leading-snug text-navy-900 sm:text-4xl">{project.summary}</p>
            </Reveal>
            {project.highlights.length > 0 && (
              <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
                {project.highlights.map((h) => (
                  <StaggerItem key={h} className="flex gap-3 text-muted">
                    <Check className="mt-1 size-4 shrink-0 text-gold-600" /> {h}
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
          <Reveal delay={0.15} className="h-fit border border-navy-900/10 bg-white p-8 lg:sticky lg:top-28">
            <dl className="divide-y divide-navy-900/10">
              {project.keyFacts.map((f) => (
                <div key={f.label} className="flex justify-between gap-4 py-4">
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="text-right font-semibold text-navy-900">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 grid gap-3">
              <EnquireButton
                title="Register your interest"
                reason="Register interest"
                project={label}
                source={source}
                className="inline-flex items-center justify-center gap-2 bg-gold-500 px-6 py-3.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
              >
                Register interest
              </EnquireButton>
              <EnquireButton
                title="Get the brochure"
                reason="Brochure"
                project={label}
                source={source}
                className="inline-flex items-center justify-center gap-2 border border-navy-900/20 px-6 py-3.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
              >
                <Download className="size-4" /> Brochure
              </EnquireButton>
            </div>
          </Reveal>
        </div>
      </section>

      {project.units.length > 0 && (
        <section className="bg-white py-24 sm:py-32">
          <div className="container-x">
            <SectionHeading eyebrow="Configurations" title="Sizes & pricing" />
            <Reveal className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b-2 border-navy-900 text-xs tracking-[0.2em] text-muted uppercase">
                    <th className="py-4 font-semibold">Type</th>
                    <th className="py-4 font-semibold">Size</th>
                    <th className="py-4 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {project.units.map((u) => (
                    <tr key={u.config} className="border-b border-navy-900/10">
                      <td className="py-6 font-display text-2xl text-navy-900">{u.config}</td>
                      <td className="py-6 text-muted">{u.size}</td>
                      <td className="py-6 font-semibold text-navy-900">{u.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="container-x">
            <SectionHeading eyebrow="Gallery" title="A closer look" />
            <div className="mt-12">
              <Gallery images={project.gallery} />
            </div>
          </div>
        </section>
      )}

      <ContactSection source={source} project={label} />
    </>
  );
}
