import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import ContactSection from "@/components/sections/ContactSection";
import ProjectCard from "./ProjectCard";
import { type ProjectCategory, categoryLabels, projectsIn } from "@/data/projects";

const COPY: Record<ProjectCategory, { title: string; intro: string; image: string }> = {
  apartment: {
    title: "Apartments in collaboration with Bengaluru's finest developers",
    intro: "High-rise homes off Sarjapur Road — from landmark G+47 towers to Sarjapur's exclusive all-3 BHK community.",
    image: "/assets/projects/engrace-vista/towers.jpg",
  },
  villa: {
    title: "Independent villas, built for the way you live",
    intro: "Spacious 4 & 5 BHK villas with private elevators, gardens and clubhouse living — off Sarjapur Road.",
    image: "/assets/projects/soulace/avenue.jpg",
  },
};

// Listing page for one category (Apartments or Villas).
export default function ProjectListing({ category }: { category: ProjectCategory }) {
  const items = projectsIn(category);
  const copy = COPY[category];
  return (
    <>
      <PageHero eyebrow="Our collaborations" title={categoryLabels[category]} image={copy.image} crumbs={[{ href: "/", label: "Home" }, { href: "/projects/", label: "Projects" }, { label: categoryLabels[category] }]} />
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={categoryLabels[category]} title={copy.title} intro={copy.intro} />
          <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <StaggerItem key={p.slug}>
                <ProjectCard project={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <ContactSection source={`${categoryLabels[category]} page`} />
    </>
  );
}
