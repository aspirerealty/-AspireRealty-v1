// Projects Aspire Ventures Realty markets in collaboration with developers.
// Engrace Vista and Soulace details come from Modern Spaaces' brochures and
// October 2026 cost sheets; Sarjapura G+47 from the launch posters + EOI brief.

export type ProjectStatus = "ongoing" | "upcoming" | "completed";
export type ProjectCategory = "apartment" | "villa";

export type Developer = { name: string; logo: string; logoWhite: string; url: string };

export const DEVELOPERS = {
  modernSpaaces: {
    name: "Modern Spaaces",
    logo: "/assets/logos/modern-spaaces.png",
    logoWhite: "/assets/logos/modern-spaaces-white.png",
    url: "https://modernspaaces.com",
  },
} satisfies Record<string, Developer>;

// One configuration row. Builders quote super built-up area (SBUA) and
// carpet area; villas also have a plot area.
export type Unit = { config: string; sbua: string; carpet?: string; plot?: string; price: string };

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  developer: Developer;
  logo?: { dark: string; white: string };
  rera?: string;
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
  units: Unit[];
  priceNote?: string;
  amenities: string[];
  connectivity: { place: string; time?: string }[];
  mapQuery: string;
  video?: { src: string; poster: string; title: string };
  page: string; // dedicated page for this project, e.g. "/sarjapura-g47/"
  whatsappMessage?: string;
};

export const statusLabels: Record<ProjectStatus, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  completed: "Completed",
};

export const categoryLabels: Record<ProjectCategory, string> = {
  apartment: "Apartments",
  villa: "Villas",
};

const VISTA = "/assets/projects/engrace-vista";
const SOULACE = "/assets/projects/soulace";

export const projects: Project[] = [
  {
    slug: "sarjapura-g47",
    name: "Sarjapura G+47",
    category: "apartment",
    developer: DEVELOPERS.modernSpaaces,
    status: "upcoming",
    badge: "EOI Open",
    type: "2 & 3 BHK Apartments · G+47",
    location: "Sarjapura Main Road, Bengaluru",
    locality: "Sarjapura Main Road",
    startingPrice: "₹1.10 Cr onwards",
    summary:
      "The next big address in Sarjapura — two G+47 signature towers on Sarjapura Main Road, right opposite DMart, with 80% open space and 50+ amenities.",
    cover: "/assets/images/sarjapura-tower.jpg",
    heroImage: "/assets/images/skyline.jpg", // TODO: high-res render from the developer
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
      { config: "2 BHK", sbua: "1,100 – 1,200 sq. ft.", carpet: "On request", price: "₹1.10 Cr onwards" },
      { config: "3 BHK", sbua: "1,350 – 1,500 sq. ft.", carpet: "On request", price: "₹1.30 – 1.50 Cr" },
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
    page: "/sarjapura-g47/",
    whatsappMessage:
      "Hi, I'm interested in the G+47 residential project on Sarjapura Main Road. Please share the floor plans, pricing and EOI details.",
  },
  {
    slug: "engrace-vista",
    name: "Engrace Vista",
    category: "apartment",
    developer: DEVELOPERS.modernSpaaces,
    logo: { dark: "/assets/logos/engrace-vista-dark.png", white: "/assets/logos/engrace-vista-white.png" },
    rera: "PRM/KA/RERA/1251/308/PR/060324/006691",
    status: "ongoing",
    badge: "Possession June 2027",
    type: "The True 3 BHK · 2116 – 2200 sq. ft.",
    location: "Kada Agrahara Road, Sompura Gate, Off Sarjapur Road, Bengaluru 562125",
    locality: "Off Sarjapur Road",
    startingPrice: "₹1.80 Cr onwards",
    summary:
      "Sarjapur's exclusive all-3 BHK community — spacious 2116 – 2200 sq. ft. homes with only four units per floor, no common walls and three balconies, on 8 acres off Sarjapur Road.",
    cover: `${VISTA}/hero.jpg`,
    heroImage: `${VISTA}/hero.jpg`,
    gallery: [
      { src: `${VISTA}/towers.jpg`, alt: "Engrace Vista towers at sunset" },
      { src: `${VISTA}/pool.jpg`, alt: "Swimming pool and landscaped deck at dusk" },
      { src: `${VISTA}/skyline.jpg`, alt: "Engrace Vista towers above landscaped gardens" },
      { src: `${VISTA}/landscape-aerial.jpg`, alt: "Aerial view of the landscaped podium and pool" },
      { src: `${VISTA}/walkway.jpg`, alt: "Tree-lined walkway between the towers" },
      { src: `${VISTA}/sports-court.jpg`, alt: "Multi-purpose sports court" },
      { src: `${VISTA}/clubhouse.jpg`, alt: "Clubhouse" },
      { src: `${VISTA}/corner-unit.jpg`, alt: "Corner unit living room with wide views" },
      { src: `${VISTA}/balcony-view.jpg`, alt: "Wide balcony with city views" },
      { src: `${VISTA}/ad-3-balconies.jpg`, alt: "3 balconies — extra space to breathe and unwind" },
      { src: `${VISTA}/ad-low-density.jpg`, alt: "Low density community" },
      { src: `${VISTA}/ad-shot-at-site.jpg`, alt: "Your home is almost ready — shot at site" },
    ],
    keyFacts: [
      { label: "Land Extent", value: "8 Acres" },
      { label: "Units", value: "392 Homes" },
      { label: "Configuration", value: "All 3 BHK" },
      { label: "Super Built-up", value: "2116 – 2200 sq. ft." },
      { label: "Structure", value: "B + G + 14" },
      { label: "Possession", value: "June 2027 onwards" },
    ],
    highlights: [
      "The true 3 BHK — expansive 2116 – 2200 sq. ft. homes",
      "Only 4 units per floor, every one a corner unit",
      "No common walls between homes",
      "3 wide balconies in every home",
      "3 lifts per tower — 2 for residents, 1 for service",
      "Aluminium formwork construction — precise, fast and quake-resistant",
      "RERA & BMRDA approved",
      "Part of a 1400+ apartment and 266-villa development cluster",
    ],
    units: [{ config: "3 BHK", sbua: "2,116 – 2,200 sq. ft.", carpet: "1,279 – 1,330 sq. ft.", price: "₹1.80 – 1.87 Cr" }],
    priceNote:
      "Basic cost from ₹8,500 / sq. ft. (October 2026 cost sheet). GST, clubhouse, corpus, maintenance and other additional charges extra. Prices subject to change.",
    amenities: [
      "Clubhouse",
      "Swimming Pool",
      "Kids Splash Pool",
      "Jacuzzi",
      "Gymnasium",
      "Squash Court",
      "Badminton Court",
      "Banquet Hall",
      "Party Lawn",
      "Multi-purpose Sports Court",
      "Cricket Pitch",
      "Yoga Deck",
      "Walking Track",
      "Senior Citizens Park",
      "Kids Play Area",
      "Pet Park",
      "Billiards & Table Tennis",
      "Guest Accommodation",
    ],
    connectivity: [
      { place: "Sarjapur Road", time: "Minutes away" },
      { place: "Wipro Corporate Park" },
      { place: "RGA Tech Park" },
      { place: "Electronic City" },
      { place: "Whitefield & Bellandur" },
      { place: "Greenwood High, TISB, Inventure Academy" },
      { place: "Manipal & Rainbow Children's Hospitals" },
    ],
    mapQuery: "Engrace Vista, Kada Agrahara Road, Sarjapura, Bengaluru",
    page: "/engrace-vista/",
    whatsappMessage: "Hi, I'm interested in Engrace Vista by Modern Spaaces. Please share the cost sheet, floor plans and site visit details.",
  },
  {
    slug: "soulace",
    name: "Soulace",
    category: "villa",
    developer: DEVELOPERS.modernSpaaces,
    logo: { dark: "/assets/logos/soulace-dark.png", white: "/assets/logos/soulace-white.png" },
    rera: "PRM/KA/RERA/1251/308/PR/150223/005723",
    status: "ongoing",
    badge: "Handover Begun",
    type: "4 & 5 BHK Independent Villas",
    location: "Kada Agrahara Village, Sompura Gate, Off Sarjapur Road, Bengaluru 562125",
    locality: "Off Sarjapur Road",
    startingPrice: "₹5 Cr onwards",
    summary:
      "Live the villa life — a vibrant community of 266 independent 4 & 5 BHK villas with private elevators, on 26.5 acres off Sarjapur Road. Handover has begun; only a few villas left.",
    cover: `${SOULACE}/villa.jpg`,
    heroImage: `${SOULACE}/avenue.jpg`,
    gallery: [
      { src: `${SOULACE}/villa.jpg`, alt: "Soulace villa with private garden" },
      { src: `${SOULACE}/avenue.jpg`, alt: "Tree-lined villa avenue" },
      { src: `${SOULACE}/landscape.jpg`, alt: "Landscaped villa street" },
      { src: `${SOULACE}/clubhouse-pool.jpg`, alt: "Clubhouse with temperature-controlled pool" },
      { src: `${SOULACE}/villa-front.jpg`, alt: "Villa façade" },
      { src: `${SOULACE}/site-photo.jpg`, alt: "Completed villas at site" },
      { src: `${SOULACE}/villa-row.jpg`, alt: "Row of Soulace villas" },
      { src: `${SOULACE}/we-space.jpg`, alt: "Families in the community gardens" },
    ],
    keyFacts: [
      { label: "Land", value: "26.5 Acres" },
      { label: "Villas", value: "266" },
      { label: "Configuration", value: "4 & 5 BHK" },
      { label: "Villa BUA", value: "3387 & 4235 sq. ft." },
      { label: "Every Villa", value: "Private Elevator" },
      { label: "Approvals", value: "RERA & BMRDA" },
    ],
    highlights: [
      "Private elevator in every villa",
      "Double-height living with soaring ceilings",
      "Imported Italian marble flooring",
      "Terrace deck for celebrations under the stars",
      "Partially solar powered — 3 kW rooftop solar",
      "Centralised heat pumps for instant hot water",
      "Clubhouse with temperature-controlled pool, gym, squash and mini golf",
      "1.3 km walking track, fruit orchard and pet park",
    ],
    units: [
      { config: "4 BHK · The Cosy Villa", plot: "1,809 sq. ft.", sbua: "3,387 sq. ft.", price: "₹5.00 Cr" },
      { config: "5 BHK + Service · The Grand Villa", plot: "2,325 sq. ft.", sbua: "4,235 sq. ft.", price: "₹6.50 Cr" },
    ],
    priceNote:
      "Typical units, all-inclusive except GST & registration (October 2026 cost sheet). Larger plots at ₹7,500 / sq. ft.; PLC applicable for east-facing, premium and corner villas. Prices subject to change.",
    amenities: [
      "Temperature-controlled Pool",
      "Gym",
      "Squash Court",
      "Badminton Court",
      "Mini Golf",
      "Billiards & TT Room",
      "Media Room",
      "Cafe & Pantry",
      "Workstation & Silent Work Pods",
      "Tennis Court",
      "Football Court",
      "Cricket Practice Court",
      "Skate Park",
      "1.3 km Walking Track",
      "Yoga Court",
      "Amphitheatre",
      "Pet Park",
      "Fruit Orchard",
    ],
    connectivity: [
      { place: "Sarjapur Road", time: "Minutes away" },
      { place: "Upcoming SWIFT City" },
      { place: "Whitefield & Electronic City" },
      { place: "Bellandur & Outer Ring Road" },
      { place: "Greenwood High, GIIS, Inventure Academy" },
      { place: "Police station", time: "3 km" },
    ],
    mapQuery: "Soulace by Modern Spaaces, Kada Agrahara, Sarjapur, Bengaluru",
    video: { src: `${SOULACE}/handover-reel.mp4`, poster: `${SOULACE}/handover-reel.jpg`, title: "Handover has begun" },
    page: "/soulace/",
    whatsappMessage: "Hi, I'm interested in Soulace villas by Modern Spaaces. Please share villa availability, pricing and site visit details.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const projectsIn = (category: ProjectCategory) => projects.filter((p) => p.category === category);
