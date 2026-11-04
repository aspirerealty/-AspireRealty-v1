// Projects Aspire Ventures Realty markets in collaboration with developers.
// Engrace Vista and Soulace details come from Modern Spaaces' brochures and
// October 2026 cost sheets; Sky & High (code name, G+47) from the launch posters + EOI brief.

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

// A master plan or unit plan image from the developer's brochure.
export type Plan = { src: string; title: string; caption?: string };

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
  plans?: Plan[];
  amenities: string[];
  connectivity: { place: string; time?: string }[];
  mapQuery: string;
  mapLink?: string; // Google Maps link for "Get directions"
  youtube?: { id: string; title: string }[];
  video?: { src: string; poster: string; title: string };
  page: string; // dedicated page for this project, e.g. "/sky-and-high/"
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
const SKY = "/assets/projects/sky-and-high";
const NEON = "/assets/projects/neon";

export const projects: Project[] = [
  {
    slug: "sky-and-high",
    name: "Sky & High",
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
    cover: `${SKY}/twin-towers-golden-hour.jpg`,
    heroImage: `${SKY}/sunset-twin-towers-gardens.jpg`,
    gallery: [
      { src: `${SKY}/twin-towers-golden-hour.jpg`, alt: "Sky & High twin towers at golden hour" },
      { src: `${SKY}/poolside-sunset.jpg`, alt: "Poolside deck at sunset" },
      { src: `${SKY}/sunset-luminous-balconies.jpg`, alt: "Twin towers with luminous balconies at sunset" },
      { src: `${SKY}/twilight-illuminated-gardens.jpg`, alt: "Illuminated entrance gardens at twilight" },
      { src: `${SKY}/balconies-golden-hour.jpg`, alt: "Landscaped balconies at golden hour" },
      { src: `${SKY}/sunset-twin-towers-gardens.jpg`, alt: "Aerial view of the towers and podium gardens" },
      { src: `${SKY}/twin-towers-blue-sky.jpg`, alt: "Twin towers under a deep blue sky" },
      { src: `${SKY}/twin-towers-landscapes.jpg`, alt: "Twin towers amidst lush landscapes" },
      { src: "/assets/images/sarjapura-poster-2.jpg", alt: "Launch poster — No Pre-EMI offer" },
      { src: "/assets/images/sarjapura-poster-1.jpg", alt: "Launch poster — EOI offer" },
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
      "GYM",
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
    page: "/sky-and-high/",
    whatsappMessage:
      "Hi, I'm interested in Sky & High, the G+47 project on Sarjapura Main Road. Please share the floor plans, pricing and EOI details.",
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
      { src: `${VISTA}/landscape-aerial.jpg`, alt: "Aerial view of the landscaped podium and pool" },
      { src: `${VISTA}/walkway.jpg`, alt: "Tree-lined walkway between the towers" },
      { src: `${VISTA}/sports-court.jpg`, alt: "Multi-purpose sports court" },
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
    plans: [
      { src: `${VISTA}/plan-master.jpg`, title: "Master plan", caption: "8 acres · 7 towers · podium amenities" },
      { src: `${VISTA}/plan-t1-t3-units-01-02.jpg`, title: "T1 – T3 · Units 01 & 02", caption: "East & west facing · SBUA 2178 & 2127 sq. ft." },
      { src: `${VISTA}/plan-t1-t3-units-03-04.jpg`, title: "T1 – T3 · Units 03 & 04", caption: "East & west facing · SBUA 2129 & 2116 sq. ft." },
      { src: `${VISTA}/plan-t4-t7-units-01-02.jpg`, title: "T4 – T7 · Units 01 & 02", caption: "East & west facing · SBUA 2190 & 2151 sq. ft." },
      { src: `${VISTA}/plan-t4-t7-units-03-04.jpg`, title: "T4 – T7 · Units 03 & 04", caption: "East & west facing · SBUA 2192 & 2200 sq. ft." },
    ],
    priceNote:
      "Basic cost from ₹8,500 / sq. ft. (October 2026 cost sheet). GST, clubhouse, corpus, maintenance and other additional charges extra. Prices subject to change.",
    amenities: [
      "Clubhouse",
      "Swimming Pool",
      "Kids Splash Pool",
      "Jacuzzi",
      "GYM",
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
    whatsappMessage: "Hi, I'm interested in Engrace Vista by Modern Spaaces. Can I get more details on this?",
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
    plans: [
      { src: `${SOULACE}/plan-master.jpg`, title: "Master plan", caption: "26.5 acres · 266 villas" },
      { src: `${SOULACE}/plan-4bhk-cosy-villa.jpg`, title: "4 BHK · The Cosy Villa", caption: "Plot 1809 sq. ft. · BUA 3387 sq. ft. · 3 floors" },
      { src: `${SOULACE}/plan-5bhk-grand-villa.jpg`, title: "5 BHK · The Grand Villa", caption: "Plot 2325 sq. ft. · BUA 4235 sq. ft. · with service quarter" },
    ],
    priceNote:
      "Typical units, all-inclusive except GST & registration (October 2026 cost sheet). Larger plots at ₹7,500 / sq. ft.; PLC applicable for east-facing, premium and corner villas. Prices subject to change.",
    amenities: [
      "Temperature-controlled Pool",
      "GYM",
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
    youtube: [
      { id: "WkVE3q3eTf4", title: "Soulace by Modern Spaaces — 4 BHK Villa Walkthrough" },
    ],
    video: { src: `${SOULACE}/handover-reel.mp4`, poster: `${SOULACE}/handover-reel.jpg`, title: "Handover has begun" },
    page: "/soulace/",
    whatsappMessage: "Hi, I'm interested in Soulace villas by Modern Spaaces. Please share villa availability, pricing and site visit details.",
  },
];

// Neon sits with the other apartments, before the villas.
projects.splice(projects.findIndex((p) => p.category === "villa"), 0, {
  slug: "neon",
  name: "Neon",
  category: "apartment",
  developer: DEVELOPERS.modernSpaaces,
  logo: { dark: "/assets/logos/neon-dark.png", white: "/assets/logos/neon-white.png" },
  rera: "PRM/KA/RERA/1251/308/PR/050725/007897",
  status: "ongoing",
  badge: "Possession Dec 2029",
  type: "2 & 3 BHK Apartments · 1230 – 1740 sq. ft.",
  location: "Mahal Chowdenahalli Village, Sarjapura Hobli, along NH 648, Bengaluru 562125",
  locality: "NH 648, near Sarjapur Road",
  startingPrice: "₹83 Lakh onwards",
  summary:
    "A radiant way to live — 292 open-layout 2 & 3 BHK homes on 4.19 acres along NH 648 near Sarjapur Road, with 70% open space, a 15,000 sq. ft. clubhouse and quick access to STRR and the upcoming SWIFT City.",
  cover: `${NEON}/front.jpg`,
  heroImage: `${NEON}/front.jpg`,
  gallery: [
    { src: `${NEON}/aerial.jpg`, alt: "Aerial view of Neon amid greenery" },
    { src: `${NEON}/clubhouse.jpg`, alt: "Clubhouse and Neo Mart" },
    { src: `${NEON}/front.jpg`, alt: "Neon tower and entrance plaza" },
    { src: `${NEON}/pool.jpg`, alt: "Swimming pool" },
    { src: `${NEON}/basketball-court.jpg`, alt: "Basketball court at sunset" },
    { src: `${NEON}/kids-play.jpg`, alt: "Kids' play lawn" },
    { src: `${NEON}/jogging-track.jpg`, alt: "Jogging track" },
  ],
  keyFacts: [
    { label: "Land", value: "4.19 Acres" },
    { label: "Units", value: "292 Homes" },
    { label: "Configuration", value: "2 & 3 BHK" },
    { label: "Super Built-up", value: "1230 – 1740 sq. ft." },
    { label: "Structure", value: "2B + G + 13/14" },
    { label: "Possession", value: "Dec 2029 onwards" },
  ],
  highlights: [
    "Open layouts with seamless interiors for easy living",
    "70% open space — more greenery, more room to breathe",
    "Cross-ventilated rooms with abundant sunlight",
    "Well-lit corridors with skylights",
    "15,000 sq. ft. clubhouse for fitness, work and leisure",
    "Aluminium formwork construction",
    "Direct access to NH 648 and STRR, near the upcoming SWIFT City",
    "BMRDA sanctioned & RERA approved",
  ],
  units: [
    { config: "2 BHK", sbua: "1,230 sq. ft.", carpet: "775 sq. ft.", price: "₹83 Lakh" },
    { config: "3 BHK · Type 02 & 03", sbua: "1,553 – 1,583 sq. ft.", carpet: "992 – 1,014 sq. ft.", price: "₹1.05 – 1.07 Cr" },
    { config: "3 BHK · Type 01", sbua: "1,740 sq. ft.", carpet: "1,113 sq. ft.", price: "₹1.17 Cr" },
  ],
  priceNote:
    "Basic cost at ₹6,750 / sq. ft. (October 2026 cost sheet). Car parking (₹4 Lakh), GST, clubhouse, corpus, maintenance and other charges extra. FRC (Floor Rise Charges) of ₹25 / sq. ft. per floor from the 4th floor; PLC applies to select units. Prices subject to change.",
  plans: [
    { src: `${NEON}/plan-master.jpg`, title: "Master plan", caption: "4.19 acres · 3 blocks · podium amenities" },
    { src: `${NEON}/plan-tower.jpg`, title: "Tower plan", caption: "Typical floor · Blocks A, B & C" },
    { src: `${NEON}/plan-2bhk.jpg`, title: "2 BHK", caption: "West facing · SBUA 1,230 · carpet 775 sq. ft." },
    { src: `${NEON}/plan-3bhk-type-02.jpg`, title: "3 BHK · Type 02", caption: "West facing · SBUA 1,553 · carpet 992 sq. ft." },
    { src: `${NEON}/plan-3bhk-type-03.jpg`, title: "3 BHK · Type 03", caption: "West facing · SBUA 1,583 · carpet 1,014 sq. ft." },
    { src: `${NEON}/plan-3bhk-type-01.jpg`, title: "3 BHK · Type 01", caption: "East facing · SBUA 1,740 · carpet 1,113 sq. ft." },
  ],
  amenities: [
    "15,000 sq. ft. Clubhouse",
    "GYM",
    "Swimming Pool",
    "Kids' Pool",
    "WFH Space",
    "Library",
    "Multi-purpose Hall",
    "Badminton",
    "Table Tennis",
    "Pickleball Court",
    "Basketball Court",
    "Cricket Pitch",
    "Jogging Track",
    "Kids' & Toddlers' Play",
    "Open Air Theatre",
    "Bonfire Plaza",
    "Party Lawn",
    "EV Charging",
  ],
  connectivity: [
    { place: "NH 648", time: "Direct access" },
    { place: "STRR (Satellite Town Ring Road)" },
    { place: "Sarjapur Road", time: "Nearby" },
    { place: "Upcoming SWIFT City" },
    { place: "Dommasandra Circle" },
    { place: "Electronic City & Whitefield" },
  ],
  mapQuery: "12.87016,77.805367",
  mapLink: "https://maps.app.goo.gl/LdYGDiTEffQaw6tS7",
  page: "/neon/",
  whatsappMessage: "Hi, I'm interested in Neon by Modern Spaaces on NH 648. Please share the cost sheet, floor plans and site visit details.",
});

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const projectsIn = (category: ProjectCategory) => projects.filter((p) => p.category === category);
