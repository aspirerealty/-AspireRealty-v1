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
  email: "aspirerealty001@gmail.com",
  address: {
    line1: "Hongasandra",
    line2: "Bengaluru, Karnataka 560068",
    mapQuery: "Hongasandra, Bengaluru 560068",
  },
  hours: "Mon – Sun, 10:00 AM – 7:00 PM",
  rera: "RERA registration details will appear here.", // TODO
  // Shown in this order wherever the social row appears. Add youtube /
  // linkedin / x links here when those pages exist (icons are ready).
  social: {
    instagram: "https://www.instagram.com/aspire_ventures_realty",
    facebook: "https://www.facebook.com/share/1DSX7XY6Hb/",
    whatsapp: "https://wa.me/919743915259",
    email: "mailto:aspirerealty001@gmail.com",
  } as Record<string, string>,
  logo: {
    full: "/assets/logos/aspire-ventures-realty-logo-transparent.svg",
    emblem: "/assets/logos/aspire-ventures-realty-emblem-transparent.svg",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/apartments/", label: "Apartments" },
  { href: "/villas/", label: "Villas" },
  { href: "/blogs/", label: "Insights" },
  { href: "/contact/", label: "Contact" },
] as const;

// Animated numbers on the home page. Swap in company figures (years in
// business, families served, sq. ft. sold) once you have verified numbers.
export const stats = [
  { value: 47, prefix: "G+", label: "Floors on Sarjapura Main Road" },
  { value: 80, suffix: "%", label: "Open space" },
  { value: 50, suffix: "+", label: "Lifestyle amenities" },
  { value: 200, label: "EOI customers get No FRC (Floor Rise Charges)" },
];

export function whatsappLink(message = "Hi, I'd like to know more about your projects.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
