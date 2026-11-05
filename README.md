# Aspire Ventures Realty — website

Static marketing website built with **Next.js 16**, **Tailwind CSS 4** and **Motion**, exported to plain HTML and hosted on **Hostinger** at https://aspireventuresrealty.in. Content lives in `src/data/`. Enquiry forms go to a small PHP handler that saves each lead to MySQL, emails it and copies it to a Google Sheet; the team views leads at `/leads/`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Where to edit content

| What | File |
|---|---|
| Phone, WhatsApp, email, address, social links, RERA text | `src/data/site.ts` |
| Projects (shown as "In collaboration with …") | `src/data/projects.ts` |
| Sky & High (G+47) landing page (name, copy, sections) | `src/app/sky-and-high/page.tsx` |
| Other project pages (Engrace Vista, Neon, Soulace) | `src/data/projects.ts` → `ProjectLanding` |
| Blog posts | `src/data/blogs.ts` |
| Home page FAQs | `src/data/faqs.ts` |
| Images | `public/assets/images/` |
| Logos | `public/assets/logos/` |

Search the code for `TODO` to find every placeholder that still needs real information.

## Animations

- **Motion** (`motion/react`) — scroll reveals, staggered grids, hero text, counters, menu, tabs, accordions, popups, page fades. Shared helpers are in `src/components/motion/`.
- **Lenis** — smooth scrolling (`src/components/motion/Providers.tsx`).
- **Embla Carousel** — project galleries.

All motion is switched off automatically for visitors who enable "reduce motion" on their device.

## Hosting (Hostinger)

Every push to `main` goes live automatically:

1. GitHub Actions (`.github/workflows/hostinger.yml`) builds the site and adds the server files from `hostinger/public/`.
2. The result is pushed to the `hostinger` branch.
3. Hostinger (hPanel → Advanced → GIT, connected to GitHub) deploys that branch into `public_html`.

Setup details, the private `lead-config.php` settings file and the Google Sheet script are in [`hostinger/README.md`](hostinger/README.md).

Building on Windows: `scripts/fix-export-segments.mjs` runs after `next build` to work around a Next.js Windows path bug in prefetch files. It does nothing on Linux.
