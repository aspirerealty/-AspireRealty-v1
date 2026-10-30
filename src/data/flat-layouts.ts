// Illustrative apartment layouts for the 3D flat explorer. All values are in
// metres on a floor plan where x runs left→right and z runs front→back.
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

// A gap in the walls along a line (doors, open kitchens, balcony sliders).
export type Opening = { axis: "x" | "z"; at: number; center: number; width: number };

export type Furniture = { x: number; z: number; w: number; d: number; h: number; color: string };

export type FlatLayout = {
  id: string;
  label: string;
  rooms: Room[];
  openings: Opening[];
  furniture: Furniture[];
};

const WOOD = "#7a5a3a";
const FABRIC = "#e8e2d6";
const WHITE = "#f4f2ee";
const DARK = "#3a3f47";

export const twoBhk: FlatLayout = {
  id: "2bhk",
  label: "2 BHK",
  rooms: [
    { id: "balcony", name: "Balcony", type: "balcony", x: 0, z: -1.6, w: 5.4, d: 1.6, blurb: "Sit-out off the living room, facing the open side." },
    { id: "living", name: "Living & Dining", type: "living", x: 0, z: 0, w: 5.4, d: 4.6, blurb: "Open living and dining with a wide sliding door to the balcony." },
    { id: "kitchen", name: "Kitchen", type: "kitchen", x: 5.4, z: 0, w: 2.8, d: 3.0, blurb: "L-shaped kitchen opening onto the dining area." },
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
  ],
  furniture: [
    // Living & dining
    { x: 0.3, z: 1.0, w: 0.9, d: 2.2, h: 0.75, color: FABRIC }, // sofa
    { x: 1.6, z: 1.6, w: 0.8, d: 1.0, h: 0.4, color: WOOD }, // coffee table
    { x: 4.95, z: 0.3, w: 0.35, d: 1.5, h: 0.5, color: DARK }, // TV unit
    { x: 2.6, z: 3.0, w: 1.4, d: 0.9, h: 0.75, color: WOOD }, // dining table
    // Kitchen & utility
    { x: 5.55, z: 0.15, w: 2.5, d: 0.6, h: 0.9, color: WHITE },
    { x: 7.5, z: 0.75, w: 0.6, d: 1.6, h: 0.9, color: WHITE },
    { x: 8.4, z: 0.3, w: 0.6, d: 0.6, h: 0.85, color: "#dfe3e8" },
    // Master bedroom
    { x: 0.15, z: 5.0, w: 2.1, d: 1.9, h: 0.5, color: WHITE }, // bed
    { x: 0.15, z: 4.75, w: 0.5, d: 0.25, h: 0.5, color: WOOD },
    { x: 0.3, z: 7.3, w: 2.4, d: 0.55, h: 1.6, color: "#6b4f36" }, // wardrobe
    // Dressing
    { x: 4.0, z: 7.45, w: 1.2, d: 0.45, h: 1.6, color: "#6b4f36" },
    // Bedroom 2
    { x: 5.6, z: 6.0, w: 1.6, d: 1.8, h: 0.5, color: WHITE }, // bed
    { x: 7.75, z: 4.9, w: 0.55, d: 1.6, h: 1.6, color: "#6b4f36" }, // wardrobe
    // Toilets
    { x: 4.85, z: 4.8, w: 0.4, d: 0.6, h: 0.4, color: "#ffffff" },
    { x: 3.95, z: 4.75, w: 0.8, d: 0.45, h: 0.8, color: WHITE },
    { x: 9.45, z: 7.2, w: 0.4, d: 0.55, h: 0.4, color: "#ffffff" },
    { x: 9.45, z: 5.4, w: 0.45, d: 0.9, h: 0.8, color: WHITE },
    // Balcony
    { x: 0.5, z: -1.3, w: 0.5, d: 0.5, h: 0.45, color: WOOD },
    { x: 1.2, z: -1.3, w: 0.5, d: 0.5, h: 0.45, color: WOOD },
  ],
};

export const toFeet = (m: number) => {
  const totalInches = Math.round(m * 39.3701);
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}"`;
};

export const sqft = (m2: number) => Math.round(m2 * 10.7639);
