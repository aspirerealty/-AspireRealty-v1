import type { Metadata } from "next";
import ProjectLanding from "@/components/projects/ProjectLanding";
import { getProject } from "@/data/projects";

const project = getProject("neon")!;

export const metadata: Metadata = {
  title: "Neon by Modern Spaaces — 2 & 3 BHK on NH 648, near Sarjapur Road",
  description: `${project.summary} From ${project.startingPrice}. RERA ${project.rera}.`,
};

export default function NeonPage() {
  return <ProjectLanding project={project} />;
}
