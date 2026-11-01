import type { Metadata } from "next";
import ProjectListing from "@/components/projects/ProjectListing";

export const metadata: Metadata = {
  title: "Villas",
  description: "Independent 4 & 5 BHK villas off Sarjapur Road by Aspire Ventures Realty in collaboration with Modern Spaaces.",
};

export default function VillasPage() {
  return <ProjectListing category="villa" />;
}
