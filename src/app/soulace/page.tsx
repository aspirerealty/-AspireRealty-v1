import type { Metadata } from "next";
import ProjectLanding from "@/components/projects/ProjectLanding";
import { getProject } from "@/data/projects";

const project = getProject("soulace")!;

export const metadata: Metadata = {
  title: "Soulace by Modern Spaaces — 4 & 5 BHK Villas off Sarjapur Road",
  description: `${project.summary} From ${project.startingPrice}. RERA ${project.rera}.`,
  openGraph: { type: "website", siteName: "Aspire Ventures Realty", images: ["/assets/share/soulace.jpg"] },
  twitter: { card: "summary_large_image", images: ["/assets/share/soulace.jpg"] },
};

export default function SoulacePage() {
  return <ProjectLanding project={project} />;
}
