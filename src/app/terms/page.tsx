import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="30 October 2026"
      sections={[
        {
          heading: "About this website",
          body: [
            `This website is operated by ${site.name} to share information about residential projects we market in collaboration with developers. By using it, you agree to these terms.`,
          ],
        },
        {
          heading: "Information is indicative",
          body: [
            "Prices, offers, sizes, specifications, amenities and timelines shown are indicative and subject to change without notice. Images and renders are artistic impressions. Please verify all details with our team and the project's approved documents before making any decision.",
          ],
        },
        {
          heading: "No offer or contract",
          body: ["Nothing on this website constitutes an offer, invitation or contract. Any booking is governed solely by the agreement executed between the buyer and the developer."],
        },
        {
          heading: "Intellectual property",
          body: [`The ${site.name} name, logo and website content may not be reproduced without written permission.`],
        },
      ]}
    />
  );
}
