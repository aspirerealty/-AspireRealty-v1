import { Reveal } from "@/components/motion/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className={`eyebrow ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</span>
      <h2 className={`heading-lg mt-4 ${light ? "text-white" : ""}`}>{title}</h2>
      {intro && <p className={`mt-5 ${light ? "text-lg leading-relaxed text-white/70" : "prose-body"}`}>{intro}</p>}
    </Reveal>
  );
}
