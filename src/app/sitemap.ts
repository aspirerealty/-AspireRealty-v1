import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { blogs } from "@/data/blogs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about/", "/projects/", "/blogs/", "/referral/", "/contact/", "/privacy-policy/", "/terms/", "/disclaimer/"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...projects.map((p) => ({ url: `${site.url}${p.page}` })),
    ...blogs.map((b) => ({ url: `${site.url}/blogs/${b.slug}/`, lastModified: b.date })),
  ];
}
