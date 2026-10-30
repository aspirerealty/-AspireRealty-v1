// Shared by the lightweight UI (TowersShowcase) and the lazily loaded 3D
// scene (TowersScene), so the UI doesn't pull Three.js into the page bundle.

export const FLOORS = 47;
export const METRES_PER_FLOOR = 3.15; // approximate, for the floor picker

// Annotations drawn like an architectural presentation board: a leader line
// from the model to a small spec label on the given side.
export const HOTSPOT_INFO = [
  { id: "crown", title: "Signature crown", spec: "G+47 · 2 towers", side: "right", text: "A lit crown at G+47 — a new landmark on the Sarjapura skyline." },
  { id: "breakout", title: "“Breakout Spaaces”", spec: "50+ amenities", side: "right", text: "50+ amenities spread across landscaped podium pockets instead of one clubhouse." },
  { id: "mlcp", title: "Multi-level car park", spec: "Car-free podium", side: "left", text: "A dedicated MLCP keeps cars off the ground and the podium green." },
  { id: "open", title: "80% open space", spec: "Gardens · pool · walks", side: "left", text: "Gardens, pool and walkways fill the land around the two towers." },
] as const;

export type HotspotId = (typeof HOTSPOT_INFO)[number]["id"];
