import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import BlogCard from "@/components/blog/BlogCard";
import { Reveal } from "@/components/motion/Reveal";
import ContactSection from "@/components/sections/ContactSection";
import { blogs, formatDate, getBlog } from "@/data/blogs";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlog(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, openGraph: { images: [post.cover] } };
}

export default async function BlogPostPage(props: PageProps<"/blogs/[slug]">) {
  const { slug } = await props.params;
  const post = getBlog(slug);
  if (!post) notFound();
  const related = blogs.filter((b) => b.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow={post.category} title={post.title} image={post.cover} crumbs={[{ href: "/", label: "Home" }, { href: "/blogs/", label: "Insights" }, { label: post.category }]} />

      <article className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal className="flex items-center gap-3 text-sm text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="size-1 rounded-full bg-gold-500" />
            <span>{post.readTime}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 font-display text-2xl leading-relaxed text-navy-900 sm:text-3xl">{post.excerpt}</p>
          </Reveal>
          <Reveal delay={0.15} className="relative mt-12 aspect-[16/9] overflow-hidden">
            <Image src={post.cover} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </Reveal>
          <div className="mt-12 space-y-6 text-lg leading-relaxed text-ink/80">
            {post.body.map((block, i) => {
              if (block.type === "h2") return <h2 key={i} className="pt-6 font-display text-3xl text-navy-900">{block.text}</h2>;
              if (block.type === "ul")
                return (
                  <ul key={i} className="space-y-3">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-3 size-1.5 shrink-0 rotate-45 bg-gold-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              return <p key={i}>{block.text}</p>;
            })}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-white py-24">
          <div className="container-x">
            <h2 className="heading-lg">Keep reading</h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactSection source={`Blog: ${post.slug}`} />
    </>
  );
}
