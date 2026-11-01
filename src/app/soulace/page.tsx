import type { Metadata } from "next";
import ProjectLanding from "@/components/projects/ProjectLanding";
import { getProject } from "@/data/projects";

const project = getProject("soulace")!;

export const metadata: Metadata = {
  title: "Soulace by Modern Spaaces — 4 & 5 BHK Villas off Sarjapur Road",
  description: `${project.summary} From ${project.startingPrice}. RERA ${project.rera}.`,
};

export default function SoulacePage() {
  return <ProjectLanding project={project} />;
}
