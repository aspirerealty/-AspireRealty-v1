import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="30 October 2026"
      sections={[
        {
          heading: "Information we collect",
          body: [
            "When you submit an enquiry or EOI form, we collect the details you provide — such as your name, mobile number, email address and message — along with the page you submitted it from.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            `${site.name} uses this information only to respond to your enquiry, share project information you have requested, arrange site visits and assist with your purchase. We may contact you by call, SMS, email or WhatsApp.`,
            "We may share your details with the developer of the project you enquired about, solely for the purpose of serving your enquiry.",
          ],
        },
        {
          heading: "Storage and security",
          body: [
            "This website does not store your form data in a database. Submissions are delivered directly to our sales team by email and handled with reasonable safeguards.",
          ],
        },
        {
          heading: "Your choices",
          body: [`You may ask us to stop contacting you or to delete your information at any time by writing to ${site.email}.`],
        },
      ]}
    />
  );
}
