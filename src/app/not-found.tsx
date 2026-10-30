import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-navy-950">
      <Image src="/assets/images/skyline.jpg" alt="" fill className="object-cover opacity-20" sizes="100vw" />
      <div className="container-x relative py-32 text-white">
        <p className="font-display text-[8rem] leading-none text-gold-400 sm:text-[12rem]">404</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">This address hasn&apos;t been built yet.</h1>
        <p className="mt-4 max-w-md text-white/70">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/projects/" variant="outline-light">
            View projects
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
