import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { type Project, statusLabels } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={project.page} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-navy-900">
        <Image
          src={project.cover}
          alt={`${project.type} in ${project.location}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/20 to-transparent" />
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="bg-white/90 px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-navy-900 uppercase backdrop-blur">
            {statusLabels[project.status]}
          </span>
          {project.badge && (
            <span className="bg-gold-500 px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-navy-950 uppercase">{project.badge}</span>
          )}
        </div>
        <span className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-all duration-500 ease-luxe group-hover:rotate-45 group-hover:bg-gold-500 group-hover:text-navy-950">
          <ArrowUpRight className="size-5" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-gold-400 uppercase">In collaboration with</p>
          <h3 className="mt-2 font-display text-3xl leading-tight">{project.partner}</h3>
          <p className="mt-2 text-sm text-white/80">{project.type}</p>
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/15 pt-4 text-sm">
            <span className="flex items-center gap-1.5 text-white/70">
              <MapPin className="size-4 shrink-0 text-gold-400" />
              {project.locality}
            </span>
            <span className="font-semibold text-gold-400">{project.startingPrice ?? "Express interest"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
