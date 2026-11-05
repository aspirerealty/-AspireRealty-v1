import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build to plain HTML/CSS/JS in `out/`, served by Hostinger (see hostinger/).
  output: "export",
  // Emit `/about/index.html` instead of `/about.html` so static hosts
  // resolve clean URLs without rewrite rules.
  trailingSlash: true,
  // Hide the "N" dev-tools button in `npm run dev` (it never appears in production).
  devIndicators: false,
  images: {
    // The default image optimizer needs a server; images are pre-sized instead.
    unoptimized: true,
  },
  turbopack: {
    // A stray package-lock.json in the user folder confuses root detection.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
