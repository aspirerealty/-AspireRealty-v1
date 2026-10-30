import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import BlogCard from "@/components/blog/BlogCard";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import ContactSection from "@/components/sections/ContactSection";
import { blogs } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Insights",
  description: "Buyer guides, location insights and home-finance explainers from Aspire Ventures Realty.",
};

export default function BlogsPage() {
  const posts = [...blogs].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero eyebrow="Insights" title="Guides for smarter home buying" image="/assets/images/blueprint.jpg" crumbs={[{ href: "/", label: "Home" }, { label: "Insights" }]} />
      <section className="py-24 sm:py-32">
        <Stagger className="container-x grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <BlogCard post={post} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <ContactSection source="Blogs page" />
    </>
  );
}
