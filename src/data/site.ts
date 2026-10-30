// Company details used across the site. Replace the placeholder values
// (marked TODO) with real information before going live.

export const site = {
  name: "Aspire Ventures Realty",
  shortName: "Aspire Ventures",
  tagline: "Where Aspirations turn into Reality",
  description:
    "Aspire Ventures Realty partners with trusted developers to bring thoughtfully designed homes across Bengaluru — from launch to handover, with you at every step.",
  url: "https://www.aspireventuresrealty.com", // TODO: final domain
  phone: "+91 97439 15259", // TODO: confirm the calling number (currently the WhatsApp ad number)
  phoneHref: "tel:+919743915259",
  whatsapp: "919743915259", // international format, digits only
  email: "hello@aspireventuresrealty.com", // TODO
  address: {
    line1: "Office address line 1", // TODO
    line2: "Sarjapura Road, Bengaluru, Karnataka 562125", // TODO
    mapQuery: "Sarjapura Road, Bengaluru", // TODO: exact office address for the map
  },
  hours: "Mon – Sun, 10:00 AM – 7:00 PM",
  rera: "RERA registration details will appear here.", // TODO
  // Add linkedin / youtube here (and an icon in SocialIcons.tsx) when those pages exist.
  social: {
    instagram: "https://www.instagram.com/aspire_ventures_realty",
    facebook: "https://www.facebook.com/share/1DSX7XY6Hb/",
  } as Record<string, string>,
  logo: {
    full: "/assets/logos/aspire-ventures-realty-logo-transparent.svg",
    emblem: "/assets/logos/aspire-ventures-realty-emblem-transparent.svg",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/projects/", label: "Projects" },
  { href: "/blogs/", label: "Insights" },
  { href: "/referral/", label: "Refer & Earn" },
  { href: "/contact/", label: "Contact" },
] as const;

// Animated numbers on the home page. Swap in company figures (years in
// business, families served, sq. ft. sold) once you have verified numbers.
export const stats = [
  { value: 47, prefix: "G+", label: "Floors on Sarjapura Main Road" },
  { value: 80, suffix: "%", label: "Open space" },
  { value: 50, suffix: "+", label: "Lifestyle amenities" },
  { value: 200, label: "EOI customers get No FRC" },
];

export function whatsappLink(message = "Hi, I'd like to know more about your projects.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
