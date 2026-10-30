import Image from "next/image";
import Link from "next/link";
import { type BlogPost, formatDate } from "@/data/blogs";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blogs/${post.slug}/`} className="group block">
      <div className="relative aspect-[16/11] overflow-hidden bg-navy-900">
        <Image
          src={post.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 bg-cream px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-navy-900 uppercase">
          {post.category}
        </span>
      </div>
      <div className="mt-5 flex items-center gap-3 text-xs font-medium tracking-wide text-muted uppercase">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="size-1 rounded-full bg-gold-500" />
        <span>{post.readTime}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl leading-snug text-navy-900 transition-colors group-hover:text-gold-600">{post.title}</h3>
      <p className="mt-3 line-clamp-2 text-muted">{post.excerpt}</p>
    </Link>
  );
}
