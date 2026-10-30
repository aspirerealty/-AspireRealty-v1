# Aspire Ventures Realty — website

Static marketing website built with **Next.js 16**, **Tailwind CSS 4** and **Motion**, exported to plain HTML and hosted on **AWS Amplify Hosting**. There is no database: content lives in `src/data/`, and enquiry forms are emailed to the sales inbox by a small AWS Lambda function.

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
| Sarjapura G+47 landing page (name, copy, sections) | `src/app/sarjapura-g47/page.tsx` |
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

## Deploying to AWS

### 1. Website (Amplify Hosting)

1. Push this folder to a GitHub repository.
2. AWS Console → **Amplify** → **Create new app** → connect the repository. The included `amplify.yml` builds the site and publishes `out/`.
3. **Hosting → Custom domains** → add your domain (Amplify issues the SSL certificate).
4. **Hosting → Rewrites and redirects** → add `/<*>` → `/404.html` with type **404 (Rewrite)** so unknown URLs show the custom 404 page.

### 2. Enquiry forms (Lambda + SES)

1. **SES** → verify your domain (or the sender address) and request production access so it can send to any inbox.
2. **Lambda** → create a function (Node.js 22.x) and paste `aws/lead-form-lambda/index.mjs`.
   - Environment variables: `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`.
   - Give its role permission for `ses:SendEmail`.
3. **Function URL** → enable with auth type `NONE`, and configure CORS: allowed origin = your website URL, allowed methods = `POST`, allowed headers = `content-type`.
4. In Amplify → **Environment variables**, set `NEXT_PUBLIC_LEAD_ENDPOINT` to the Function URL, then redeploy.

Building on Windows: `scripts/fix-export-segments.mjs` runs after `next build` to work around a Next.js Windows path bug in prefetch files. It does nothing on Linux (Amplify).
