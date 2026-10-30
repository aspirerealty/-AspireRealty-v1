// Projects are shown by their developer collaboration rather than a project
// name, because Aspire Ventures Realty partners with developers on each one.
//
// Real details: "sarjapura-g47" (posters + EOI brief). "villa-plots" is a
// placeholder until its details are shared.

export type ProjectStatus = "ongoing" | "upcoming" | "completed";

export type Project = {
  slug: string;
  partner: string;
  status: ProjectStatus;
  badge?: string;
  type: string;
  location: string;
  locality: string;
  startingPrice?: string;
  summary: string;
  cover: string;
  heroImage: string;
  gallery: { src: string; alt: string }[];
  keyFacts: { label: string; value: string }[];
  highlights: string[];
  offer?: { title: string; points: string[]; note: string };
  units: { config: string; size: string; price: string }[];
  amenities: string[];
  connectivity: { place: string; time: string }[];
  mapQuery: string;
  landingPage?: string;
  whatsappMessage?: string;
};

export const statusLabels: Record<ProjectStatus, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  completed: "Completed",
};

export const projects: Project[] = [
  {
    slug: "sarjapura-g47",
    partner: "Partner Developer", // TODO: developer name
    status: "upcoming",
    badge: "EOI Open",
    type: "2 & 3 BHK Apartments · G+47",
    location: "Sarjapura Main Road, Bengaluru",
    locality: "Sarjapura",
    startingPrice: "₹1.10 Cr onwards",
    summary:
      "The next big address in Sarjapura — two G+47 signature towers on Sarjapura Main Road, right opposite DMart, with 80% open space and 50+ amenities.",
    cover: "/assets/images/sarjapura-tower.jpg",
    heroImage: "/assets/images/sarjapura-tower-dusk.jpg",
    gallery: [
      { src: "/assets/images/sarjapura-tower.jpg", alt: "Tower crown lit at dusk" },
      { src: "/assets/images/sarjapura-facade.jpg", alt: "Landscaped balconies with warm façade lighting" },
      { src: "/assets/images/sarjapura-tower-dusk.jpg", alt: "Tower rising above the Sarjapura skyline at sunset" },
      { src: "/assets/images/sarjapura-poster-2.jpg", alt: "New launch poster — No Pre-EMI offer" },
      { src: "/assets/images/sarjapura-poster-1.jpg", alt: "New launch poster — EOI offer" },
    ],
    keyFacts: [
      { label: "Floors", value: "G + 47" },
      { label: "Towers", value: "2 Signature Towers" },
      { label: "Homes", value: "2 & 3 BHK" },
      { label: "Open Space", value: "80%" },
      { label: "Amenities", value: "50+" },
      { label: "Construction", value: "MIVAN" },
    ],
    highlights: [
      "G + 47 floors — a landmark skyline taking shape on Sarjapura Main Road",
      "2 signature towers designed to redefine the Sarjapura skyline",
      "Thoughtfully designed 2 & 3 BHK homes with more space for families",
      "Multi-level car parking (MLCP) keeps living spaces uncluttered",
      "80% open space — more greenery, less concrete",
      "50+ amenities across dedicated “Breakout Spaaces”",
      "MIVAN construction technology for precision, speed and quality",
      "Right opposite DMart on Sarjapura Main Road",
    ],
    offer: {
      title: "EOI Offer — First 200 Customers",
      points: ["No FRC (Floor Rise Charges)", "Choose any preferred floor", "No Pre-EMI* — pay just ₹10 Lacs and nothing till possession"],
      note: "Limited to the first 200 bookings. *Terms & conditions apply.",
    },
    units: [
      { config: "2 BHK", size: "1,100 – 1,200 sq. ft.", price: "₹1.10 Cr onwards" },
      { config: "3 BHK", size: "1,350 – 1,500 sq. ft.", price: "₹1.30 – 1.50 Cr" },
    ],
    amenities: [
      "Swimming Pool",
      "Gymnasium",
      "Landscaped Podium",
      "Children's Play Area",
      "Jogging Track",
      "Indoor Games",
      "Multi-level Car Parking",
      "Yoga & Wellness Deck",
      "24×7 Security",
      "Power Backup",
    ],
    connectivity: [
      // TODO: verify travel times
      { place: "DMart Sarjapura", time: "Opposite" },
      { place: "Wipro Corporate Office", time: "15 min" },
      { place: "Outer Ring Road", time: "25 min" },
      { place: "Electronic City", time: "30 min" },
    ],
    mapQuery: "DMart Sarjapura Main Road, Bengaluru",
    landingPage: "/sarjapura-g47/",
    whatsappMessage:
      "Hi, I'm interested in the G+47 residential project on Sarjapura Main Road. Please share the floor plans, pricing and EOI details.",
  },
  {
    slug: "villa-plots",
    partner: "Partner Developer", // TODO: developer name
    status: "upcoming",
    badge: "Coming Soon",
    type: "Premium Villa Plots",
    location: "Location announcing soon", // TODO
    locality: "Announcing soon", // TODO
    summary: "A new villa plot community is on its way. Register now to be the first to receive the layout, plot sizes and launch pricing.",
    cover: "/assets/images/villa-modern.jpg", // TODO: real project image
    heroImage: "/assets/images/villa-pool-3.jpg",
    gallery: [],
    keyFacts: [
      { label: "Type", value: "Villa Plots" },
      { label: "Status", value: "Coming Soon" },
    ],
    highlights: [],
    units: [],
    amenities: [],
    connectivity: [],
    mapQuery: "",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
