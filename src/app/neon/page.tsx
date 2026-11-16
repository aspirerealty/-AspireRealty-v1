import type { Metadata } from "next";
import ProjectLanding from "@/components/projects/ProjectLanding";
import { getProject } from "@/data/projects";

const project = getProject("neon")!;

export const metadata: Metadata = {
  title: "Neon by Modern Spaaces — 2 & 3 BHK on NH 648, near Sarjapur Road",
  description: `${project.summary} From ${project.startingPrice}. RERA ${project.rera}.`,
  openGraph: { type: "website", siteName: "Aspire Ventures Realty", images: [project.cover] },
  twitter: { card: "summary_large_image", images: [project.cover] },
};

export default function NeonPage() {
  return <ProjectLanding project={project} />;
}
