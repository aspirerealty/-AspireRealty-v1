// Subtle motion background: a faint blueprint grid that fades out toward the
// edges, with soft gold light slowly drifting across it. Pure CSS.
export default function BlueprintBackdrop({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div aria-hidden className={`blueprint-backdrop ${tone === "dark" ? "blueprint-backdrop--dark" : ""}`}>
      <span className="blueprint-backdrop__glow" />
      <span className="blueprint-backdrop__glow blueprint-backdrop__glow--two" />
    </div>
  );
}
