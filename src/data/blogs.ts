// Blog posts live in code — no CMS or database. Add a post by appending an
// object here; its page is generated at build time.

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO date
  readTime: string;
  cover: string;
  body: BlogBlock[];
};

export const blogs: BlogPost[] = [
  {
    slug: "why-sarjapura-is-bengalurus-next-address",
    title: "Why Sarjapura is becoming Bengaluru's next big address",
    excerpt:
      "Tech parks, planned infrastructure and a growing social ecosystem are turning Sarjapura into one of the city's most sought-after residential corridors.",
    category: "Location Guide",
    date: "2026-10-12",
    readTime: "5 min read",
    cover: "/assets/images/skyline.jpg",
    body: [
      {
        type: "p",
        text: "A decade ago, Sarjapura was a quiet stretch on the city's south-eastern edge. Today it sits at the centre of one of Bengaluru's busiest growth corridors, linking the Outer Ring Road tech belt with Electronic City and the Hosur Road industrial zone.",
      },
      { type: "h2", text: "Close to where people work" },
      {
        type: "p",
        text: "Large technology campuses along Sarjapura Road and the nearby Outer Ring Road employ hundreds of thousands of professionals. Living closer to work means shorter commutes and more time at home — the single biggest reason families are moving here.",
      },
      { type: "h2", text: "Infrastructure on the way" },
      {
        type: "p",
        text: "Planned road widening, the proposed metro extensions and the Satellite Town Ring Road are expected to improve connectivity significantly over the next few years. Buyers who enter before infrastructure is complete typically benefit the most as the area matures.",
      },
      { type: "h2", text: "A complete neighbourhood" },
      {
        type: "ul",
        items: [
          "Established international and CBSE schools within a short drive",
          "Multi-speciality hospitals and clinics",
          "Retail, dining and everyday conveniences along the main road",
          "Large land parcels that allow low-density, high-open-space communities",
        ],
      },
      {
        type: "p",
        text: "For end-users and investors alike, Sarjapura offers a rare combination: city-level convenience today, with room to grow tomorrow.",
      },
    ],
  },
  {
    slug: "understanding-uds-and-loading",
    title: "UDS and loading explained: what every apartment buyer should check",
    excerpt:
      "Two numbers on a brochure can tell you a lot about the true value of an apartment. Here's how to read them.",
    category: "Buyer's Guide",
    date: "2026-09-28",
    readTime: "4 min read",
    cover: "/assets/images/blueprint.jpg",
    body: [
      {
        type: "p",
        text: "When you compare apartments, the price per square foot is only part of the story. Two other figures — loading and UDS — tell you how much of what you pay for is actually yours.",
      },
      { type: "h2", text: "What is loading?" },
      {
        type: "p",
        text: "Loading is the share of common areas (lobbies, corridors, lift cores, clubhouse) added to your carpet area to arrive at the super built-up area. A lower loading percentage means more usable space inside your home for the same price.",
      },
      { type: "h2", text: "What is UDS?" },
      {
        type: "p",
        text: "Undivided Share (UDS) is your proportionate ownership of the land the project stands on. Land appreciates over time while buildings depreciate, so a healthy UDS protects the long-term value of your investment.",
      },
      { type: "h2", text: "Quick checklist" },
      {
        type: "ul",
        items: [
          "Ask for carpet area, built-up area and super built-up area separately",
          "Compare loading percentages across shortlisted projects",
          "Confirm the UDS in sq. ft. in your sale agreement",
          "Verify the project's RERA registration and approved plans",
        ],
      },
    ],
  },
  {
    slug: "pre-emi-vs-no-pre-emi-plans",
    title: "Pre-EMI vs No Pre-EMI: choosing the right payment plan",
    excerpt:
      "Payment plans can change your monthly outgo dramatically during construction. We break down how they work.",
    category: "Finance",
    date: "2026-09-10",
    readTime: "6 min read",
    cover: "/assets/images/home-keys.jpg",
    body: [
      {
        type: "p",
        text: "If you buy an under-construction home with a loan, the bank releases money to the developer in stages. Until possession, you usually pay only the interest on the amount disbursed — this is called Pre-EMI.",
      },
      { type: "h2", text: "How No Pre-EMI plans work" },
      {
        type: "p",
        text: "Under a No Pre-EMI plan, the developer bears the interest during construction. You pay an initial amount and then nothing until possession, when your regular EMIs begin. If you're currently paying rent, this can make a big difference to your monthly cash flow.",
      },
      { type: "h2", text: "Things to compare" },
      {
        type: "ul",
        items: [
          "The base price under each plan — some plans carry a premium",
          "Which lending banks are tied up with the offer",
          "What happens if possession is delayed",
          "Exactly which charges are waived (for example, floor rise charges)",
        ],
      },
      {
        type: "p",
        text: "Our advisors can walk you through the numbers for any project, side by side, so you can choose with confidence.",
      },
    ],
  },
];

export function getBlog(slug: string) {
  return blogs.find((b) => b.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
