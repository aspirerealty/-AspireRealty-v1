import type { Metadata } from "next";
import { Gift, Handshake, House, UserPlus } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Refer & Earn",
  description: "Refer friends and family to Aspire Ventures Realty projects and earn rewards on every successful booking.",
};

const steps = [
  { icon: UserPlus, title: "Refer", text: "Share your friend's details using the form below." },
  { icon: Handshake, title: "We connect", text: "Our advisor reaches out and helps them find the right home." },
  { icon: House, title: "They book", text: "Your friend books a home in any of our projects." },
  { icon: Gift, title: "You earn", text: "You receive your referral reward after the booking is confirmed." },
];

export default function ReferralPage() {
  return (
    <>
      <PageHero eyebrow="Refer & earn" title="Share the joy of a new home" image="/assets/images/home-keys.jpg" crumbs={[{ href: "/", label: "Home" }, { label: "Refer & Earn" }]} />

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="How it works" title="Four simple steps" />
          <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem key={title} className="relative border border-navy-900/10 bg-white p-8">
                <span className="absolute top-6 right-6 font-display text-4xl text-navy-900/10">0{i + 1}</span>
                <Icon className="size-9 text-gold-500" strokeWidth={1.4} />
                <h3 className="mt-6 font-display text-2xl text-navy-900">{title}</h3>
                <p className="mt-2 text-muted">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-navy-900 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <span className="eyebrow text-gold-400">Refer now</span>
            <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">Know someone looking for a home?</h2>
            <p className="mt-6 text-lg text-white/70">Tell us who — we&apos;ll take great care of them, and you&apos;ll be rewarded when they book.</p>
            {/* TODO: confirm the reward amount and terms */}
            <p className="mt-8 text-sm text-white/40">Reward amount and eligibility as per the referral terms shared by our team. Rewards are paid after the booking is confirmed.</p>
          </Reveal>
          <Reveal delay={0.15} className="border border-white/10 bg-navy-950/40 p-6 sm:p-10">
            <EnquiryForm variant="referral" dark source="Referral page" defaultReason="Referral" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
