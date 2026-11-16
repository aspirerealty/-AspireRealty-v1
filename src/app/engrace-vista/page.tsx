import type { Metadata } from "next";
import ProjectLanding from "@/components/projects/ProjectLanding";
import { getProject } from "@/data/projects";

const project = getProject("engrace-vista")!;

export const metadata: Metadata = {
  title: "Engrace Vista by Modern Spaaces — True 3 BHK off Sarjapur Road",
  description: `${project.summary} From ${project.startingPrice}. RERA ${project.rera}.`,
  openGraph: { type: "website", siteName: "Aspire Ventures Realty", images: ["/assets/share/engrace-vista.jpg"] },
  twitter: { card: "summary_large_image", images: ["/assets/share/engrace-vista.jpg"] },
};

export default function EngraceVistaPage() {
  return <ProjectLanding project={project} />;
}
