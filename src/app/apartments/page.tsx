import type { Metadata } from "next";
import ProjectListing from "@/components/projects/ProjectListing";

export const metadata: Metadata = {
  title: "Apartments",
  description: "2 & 3 BHK apartments off Sarjapur Road by Aspire Ventures Realty in collaboration with Modern Spaaces.",
};

export default function ApartmentsPage() {
  return <ProjectListing category="apartment" />;
}
