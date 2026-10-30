import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "RERA Disclaimer" };

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="RERA Disclaimer"
      updated="30 October 2026"
      sections={[
        {
          heading: "Registration",
          body: [
            site.rera,
            "Projects marked “RERA: Coming soon” are pre-launch. Bookings, where applicable, will be accepted only in accordance with the Real Estate (Regulation and Development) Act, 2016 and the Karnataka RERA rules.",
          ],
        },
        {
          heading: "Marketing",
          body: [
            `${site.name} markets projects in collaboration with their respective developers. Project RERA numbers will be displayed on each project page once registered. Buyers can verify registration on the Karnataka RERA website (rera.karnataka.gov.in).`,
          ],
        },
        {
          heading: "Accuracy",
          body: [
            "While we make every effort to keep information accurate, prices, offers and specifications may change. Images are artistic impressions and furniture, fixtures and landscaping shown are not part of the standard offering unless specified in the agreement.",
          ],
        },
      ]}
    />
  );
}
