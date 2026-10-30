import { Reveal } from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";

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
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal y={16}>
        <span className={`eyebrow ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</span>
      </Reveal>
      <h2 className={`heading-lg mt-4 ${light ? "text-white" : ""}`}>
        <SplitText delay={0.1}>{title}</SplitText>
      </h2>
      {intro && (
        <Reveal delay={0.25} y={20}>
          <p className={`mt-5 ${light ? "text-lg leading-relaxed text-white/70" : "prose-body"}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
