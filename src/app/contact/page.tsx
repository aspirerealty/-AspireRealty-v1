import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import EnquiryForm from "@/components/forms/EnquiryForm";
import SocialIcons from "@/components/ui/SocialIcons";
import { site, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Talk to ${site.name}. Call ${site.phone}, WhatsApp us or send an enquiry.`,
};

export default function ContactPage() {
  const details = [
    { icon: Phone, label: "Call us", value: site.phone, href: site.phoneHref },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: "Visit", value: `${site.address.line1}, ${site.address.line2}` },
    { icon: Clock, label: "Hours", value: site.hours },
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's find your home, together" image="/assets/images/office.jpg" crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]} />

      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <span className="eyebrow">Get in touch</span>
            <h2 className="heading-lg mt-4">We&apos;re a call away</h2>
            <ul className="mt-10 space-y-6">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy-900 text-gold-400">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 block text-lg text-navy-900 hover:text-gold-600">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-lg text-navy-900">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center gap-2 bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Chat on WhatsApp
            </a>
            <div className="mt-10">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Follow us</p>
              <SocialIcons tone="light" className="mt-4" />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="border border-navy-900/10 bg-white p-6 sm:p-10">
            <h2 className="font-display text-3xl text-navy-900">Send us a message</h2>
            <div className="mt-8">
              <EnquiryForm variant="contact" source="Contact page" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative h-[420px] border-t border-navy-900/10">
        <iframe
          title="Office location"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(site.address.mapQuery)}&z=14&output=embed`}
          className="absolute inset-0 size-full grayscale-[35%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
