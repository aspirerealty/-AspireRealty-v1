// Illustrative apartment layouts for the 3D flat explorer. All values are in
// metres on a floor plan where x runs left→right and z runs front→back.
// Furniture for this layout is placed in src/components/three/FlatScene.tsx.
// TODO: replace with the developer's actual 2 BHK / 3 BHK floor plans.

export type RoomType = "living" | "bedroom" | "kitchen" | "wet" | "balcony" | "passage";

export type Room = {
  id: string;
  name: string;
  type: RoomType;
  x: number;
  z: number;
  w: number;
  d: number;
  blurb: string;
};

// A gap in the walls along a line: doors and open kitchens run full height;
// windows keep a sill wall below and get a glass pane.
export type Opening = { axis: "x" | "z"; at: number; center: number; width: number; kind?: "door" | "window" };

export type FlatLayout = {
  id: string;
  label: string;
  rooms: Room[];
  openings: Opening[];
};

export const twoBhk: FlatLayout = {
  id: "2bhk",
  label: "2 BHK",
  rooms: [
    { id: "balcony", name: "Balcony", type: "balcony", x: 0, z: -1.6, w: 5.4, d: 1.6, blurb: "Sit-out off the living room, facing the open side." },
    { id: "living", name: "Living & Dining", type: "living", x: 0, z: 0, w: 5.4, d: 4.6, blurb: "Open living and dining with a wide sliding door to the balcony." },
    { id: "kitchen", name: "Kitchen", type: "kitchen", x: 5.4, z: 0, w: 2.8, d: 3.0, blurb: "Parallel kitchen opening onto the dining area." },
    { id: "utility", name: "Utility", type: "wet", x: 8.2, z: 0, w: 1.8, d: 3.0, blurb: "Space for the washing machine and drying." },
    { id: "foyer", name: "Foyer", type: "passage", x: 5.4, z: 3.0, w: 4.6, d: 1.6, blurb: "Entrance foyer connecting the bedrooms and living area." },
    { id: "master", name: "Master Bedroom", type: "bedroom", x: 0, z: 4.6, w: 3.8, d: 3.4, blurb: "Master bedroom with attached toilet and dressing area." },
    { id: "mtoilet", name: "Master Toilet", type: "wet", x: 3.8, z: 4.6, w: 1.6, d: 2.0, blurb: "Attached toilet for the master bedroom." },
    { id: "dress", name: "Dressing", type: "passage", x: 3.8, z: 6.6, w: 1.6, d: 1.4, blurb: "Walk-in dressing area beside the master bedroom." },
    { id: "bed2", name: "Bedroom 2", type: "bedroom", x: 5.4, z: 4.6, w: 3.0, d: 3.4, blurb: "Second bedroom — ideal for children, guests or a home office." },
    { id: "ctoilet", name: "Common Toilet", type: "wet", x: 8.4, z: 4.6, w: 1.6, d: 3.4, blurb: "Common toilet accessed from the foyer." },
  ],
  openings: [
    { axis: "x", at: 0, center: 2.7, width: 2.6 }, // living ↔ balcony slider
    { axis: "z", at: 5.4, center: 2.4, width: 1.0 }, // living ↔ kitchen
    { axis: "z", at: 5.4, center: 3.8, width: 1.0 }, // living ↔ foyer
    { axis: "x", at: 4.6, center: 3.1, width: 0.9 }, // living ↔ master
    { axis: "z", at: 8.2, center: 1.5, width: 0.8 }, // kitchen ↔ utility
    { axis: "x", at: 4.6, center: 6.0, width: 0.9 }, // foyer ↔ bedroom 2
    { axis: "x", at: 4.6, center: 9.2, width: 0.75 }, // foyer ↔ common toilet
    { axis: "z", at: 10, center: 3.8, width: 1.0 }, // main entrance
    { axis: "z", at: 3.8, center: 5.6, width: 0.75 }, // master ↔ toilet
    { axis: "z", at: 3.8, center: 7.3, width: 0.8 }, // master ↔ dressing
    // windows
    { axis: "x", at: 0, center: 6.9, width: 1.4, kind: "window" }, // kitchen
    { axis: "x", at: 0, center: 9.1, width: 0.8, kind: "window" }, // utility
    { axis: "z", at: 0, center: 6.1, width: 1.0, kind: "window" }, // master bedroom side
    { axis: "x", at: 8, center: 6.9, width: 1.4, kind: "window" }, // bedroom 2
    { axis: "x", at: 8, center: 9.2, width: 0.6, kind: "window" }, // common toilet
  ],
};

export const toFeet = (m: number) => {
  const totalInches = Math.round(m * 39.3701);
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}"`;
};

export const sqft = (m2: number) => Math.round(m2 * 10.7639);
