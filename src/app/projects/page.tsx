import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectTabs from "@/components/projects/ProjectTabs";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore residential projects by Aspire Ventures Realty in collaboration with Bengaluru's trusted developers.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero eyebrow="Our collaborations" title="Explore our projects" image="/assets/images/skyline.jpg" crumbs={[{ href: "/", label: "Home" }, { label: "Projects" }]} />

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

      <ContactSection source="Projects page" />
    </>
  );
}
