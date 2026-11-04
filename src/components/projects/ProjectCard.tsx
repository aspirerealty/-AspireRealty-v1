import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { type Project, categoryLabels } from "@/data/projects";

// Project card. On hover the card lifts, the image zooms, a gold sheen sweeps
// across, a gold rule draws in and the details rise. Inside the carousel the
// image also drifts sideways (parallax) via the --parallax variable.
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.page}
      className="group block transition-transform duration-700 ease-luxe hover:-translate-y-2"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-navy-900 shadow-[0_20px_40px_-25px_rgba(9,44,76,0.5)] transition-shadow duration-700 group-hover:shadow-[0_40px_70px_-30px_rgba(9,44,76,0.75)]">
        <div className="absolute -inset-x-[12%] inset-y-0 [transform:translateX(var(--parallax,0%))]">
          <Image
            src={project.cover}
            alt={`${project.name} — ${project.type}`}
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 100vw"
            className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/25 to-navy-950/10 transition-opacity duration-700 group-hover:opacity-90" />
        {/* gold sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_35%,rgba(214,180,122,0.28)_50%,transparent_65%)] transition-transform duration-[1.2s] ease-luxe group-hover:translate-x-full"
        />

        <div className="absolute top-5 left-5 flex flex-wrap gap-2 pr-16">
          <span className="bg-white/90 px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-navy-900 uppercase backdrop-blur">
            {categoryLabels[project.category]}
          </span>
          {project.badge && (
            <span className="bg-gold-500 px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-navy-950 uppercase">{project.badge}</span>
          )}
        </div>
        <span className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-all duration-500 ease-luxe group-hover:rotate-45 group-hover:bg-gold-500 group-hover:text-navy-950">
          <ArrowUpRight className="size-5" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-6 text-white transition-transform duration-700 ease-luxe group-hover:-translate-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-[0.6rem] font-semibold tracking-[0.25em] text-white/65 uppercase">In collaboration with</span>
            <Image src={project.developer.logoWhite} alt={project.developer.name} width={640} height={655} className="h-8 w-auto" />
          </div>
          {project.logo ? (
            <Image src={project.logo.white} alt={project.name} width={640} height={480} className="mt-3 h-12 w-auto max-w-[70%] object-contain object-left" />
          ) : (
            <h3 className="mt-3 font-display text-3xl leading-tight">{project.name}</h3>
          )}
          <p className="mt-2 text-sm text-white/80">{project.type}</p>
          <div className="relative mt-4 flex items-center justify-between gap-4 pt-4 text-sm">
            <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/15" />
            <span aria-hidden className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-gold-400 transition-transform duration-700 ease-luxe group-hover:scale-x-100" />
            <span className="flex items-center gap-1.5 text-white/70">
              <MapPin className="size-4 shrink-0 text-gold-400" />
              {project.locality}
            </span>
            <span className="font-semibold whitespace-nowrap text-gold-400">{project.startingPrice ?? "Express interest"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
