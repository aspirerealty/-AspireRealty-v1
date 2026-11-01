"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, RoundedBox, useCursor, useGLTF, useTexture } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { FlatLayout, Room, RoomType } from "@/data/flat-layouts";

// Architectural cut-away of a furnished apartment, aiming for an arch-viz
// "render" look: real PBR textures and CC0 furniture models from Poly Haven,
// image-based lighting from a real interior HDRI, warm sunlight with soft
// shadows, ambient occlusion and dark wall cut-tops. Selecting a room flies
// the camera in.

const WALL_H = 1.8; // walls are cut at 1.8 m so every room is visible
const WALL_T = 0.14;
const SILL_H = 0.9;
const BASE = "/assets/3d";

const MODELS = {
  armChair: `${BASE}/models/modern_arm_chair_01.glb`,
  coffeeTable: `${BASE}/models/modern_coffee_table_01.glb`,
  sideTable: `${BASE}/models/side_table_01.glb`,
  diningChair: `${BASE}/models/dining_chair_02.glb`,
  plant: `${BASE}/models/potted_plant_02.glb`,
  succulent: `${BASE}/models/potted_plant_04.glb`,
  outdoorSet: `${BASE}/models/outdoor_table_chair_set_01.glb`,
  mediaConsole: `${BASE}/models/modern_wooden_cabinet.glb`,
};

type Props = {
  layout: FlatLayout;
  active: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
};

export default function FlatScene({ layout, active, selected, onSelect }: Props) {
  const bounds = useMemo(() => {
    const xs = layout.rooms.flatMap((r) => [r.x, r.x + r.w]);
    const zs = layout.rooms.flatMap((r) => [r.z, r.z + r.d]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
    return { cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2, w: maxX - minX, d: maxZ - minZ };
  }, [layout]);

  // Room labels are plain DOM buttons laid over the canvas and moved every
  // frame by <LabelProjector>, which is lighter than one React root per label.
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const touch = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);

  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#f4f1ec,#d9d4cc)]">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={touch ? [1, 1.5] : [1, 2]}
        shadows="soft"
        camera={{ position: [6.5, 10, -11.5], fov: 36 }}
        gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.95, alpha: true }}
      >
        <Suspense fallback={null}>
          <Environment files={`${BASE}/hdri/white_home_studio_1k.hdr`} environmentIntensity={0.5} />
          <hemisphereLight args={["#ffffff", "#d8d2c8", 0.2]} />
          {/* Warm late-afternoon sun coming in from the balcony side */}
          <directionalLight
            position={[-7, 11, -9]}
            intensity={1.7}
            color="#ffe9cf"
            castShadow
            shadow-mapSize={touch ? [1024, 1024] : [2048, 2048]}
            shadow-bias={-0.0003}
            shadow-normalBias={0.02}
            shadow-radius={6}
            shadow-camera-left={-9}
            shadow-camera-right={9}
            shadow-camera-top={9}
            shadow-camera-bottom={-9}
          />

          <group position={[-bounds.cx, 0, -bounds.cz]}>
            <Slab bounds={bounds} />
            {layout.rooms.map((room) => (
              <RoomFloor key={room.id} room={room} selected={selected === room.id} onSelect={onSelect} />
            ))}
            <Walls layout={layout} />
            <Furnishings layoutId={layout.id} />
          </group>

          <ContactShadows position={[0, -0.32, 0]} opacity={0.35} scale={30} blur={2.8} far={5} color="#2a2420" />
          <EffectComposer multisampling={touch ? 0 : 4}>
            {touch ? <></> : <N8AO aoRadius={0.55} intensity={2.4} distanceFalloff={0.6} halfRes quality="high" />}
          </EffectComposer>
        </Suspense>
        <CameraRig layout={layout} bounds={bounds} selected={selected} />
        <LabelProjector layout={layout} bounds={bounds} labels={labels} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {layout.rooms.map((room, i) => (
          <button
            key={room.id}
            ref={(el) => void (labels.current[i] = el)}
            type="button"
            onClick={() => onSelect(room.id)}
            style={{ opacity: 0 }}
            className="group pointer-events-auto absolute top-0 left-0 flex flex-col items-center"
          >
            {/* Annotation: label on a short leader line down to a dot */}
            <span
              className={`whitespace-nowrap border-b px-1.5 pb-0.5 text-[10px] font-bold tracking-[0.18em] uppercase backdrop-blur-sm transition-colors ${
                selected === room.id ? "border-gold-500 bg-gold-500 text-navy-950" : "border-navy-900/40 bg-white/75 text-navy-900 group-hover:bg-white"
              }`}
            >
              {room.name}
            </span>
            <span className="h-4 w-px bg-navy-900/40" />
            <span className={`size-2 rounded-full border-2 border-gold-500 ${selected === room.id ? "bg-gold-500" : "bg-white"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────── materials ────────────────────────── */

type TexSet = { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };

function useTexSet(name: string): TexSet {
  const [map, normalMap, roughnessMap] = useTexture([
    `${BASE}/textures/${name}_diff.jpg`,
    `${BASE}/textures/${name}_nor.jpg`,
    `${BASE}/textures/${name}_rough.jpg`,
  ]);
  return useMemo(() => {
    // Configure fresh clones rather than the cached originals.
    const prep = (t: THREE.Texture, srgb: boolean) => {
      const c = t.clone();
      if (srgb) c.colorSpace = THREE.SRGBColorSpace;
      c.wrapS = c.wrapT = THREE.RepeatWrapping;
      c.anisotropy = 8;
      c.needsUpdate = true;
      return c;
    };
    return { map: prep(map, true), normalMap: prep(normalMap, false), roughnessMap: prep(roughnessMap, false) };
  }, [map, normalMap, roughnessMap]);
}

// Clone a texture set with its own tiling (in metres per tile).
function tiled(set: TexSet, w: number, d: number, tile: number): TexSet {
  const clone = (t: THREE.Texture) => {
    const c = t.clone();
    c.repeat.set(w / tile, d / tile);
    c.needsUpdate = true;
    return c;
  };
  return { map: clone(set.map), normalMap: clone(set.normalMap), roughnessMap: clone(set.roughnessMap) };
}

const FLOOR_TEX: Record<RoomType, { name: string; tile: number }> = {
  living: { name: "herringbone_parquet", tile: 1.6 },
  bedroom: { name: "laminate_floor_02", tile: 2 },
  kitchen: { name: "marble_tiles", tile: 1.2 },
  passage: { name: "marble_tiles", tile: 1.2 },
  wet: { name: "large_grey_tiles", tile: 1.2 },
  balcony: { name: "wood_floor_deck", tile: 1.5 },
};

function useMaterials() {
  const linen = useTexSet("rough_linen");
  const velvet = useTexSet("velour_velvet");
  const oak = useTexSet("white_oak_veneer");
  const marble = useTexSet("marble_01");
  const wool = useTexSet("poly_wool_herringbone");

  return useMemo(() => {
    const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);
    // Fabric photos are themselves coloured (blue linen, red velvet), so use
    // only their weave relief and set our own neutral colours.
    const weave = (t: TexSet, scale = 1) => ({ normalMap: t.normalMap, roughnessMap: t.roughnessMap, normalScale: new THREE.Vector2(scale, scale) });
    return {
      sofa: std({ ...weave(linen, 0.8), color: "#bdb3a6", roughness: 1 }),
      linenWhite: std({ ...weave(linen, 0.5), color: "#f2eee8", roughness: 1 }),
      linenSand: std({ ...weave(linen, 0.6), color: "#d8c9b2", roughness: 1 }),
      velvetTaupe: std({ ...weave(velvet, 0.6), color: "#8c7562", roughness: 0.85 }),
      velvetSlate: std({ ...weave(velvet, 0.6), color: "#56606b", roughness: 0.85 }),
      velvetOlive: std({ ...weave(velvet, 0.6), color: "#7a7650", roughness: 0.85 }),
      oak: std({ ...oak, color: "#f3e6d4" }),
      marble: std({ ...marble, color: "#ffffff", roughness: 0.25, envMapIntensity: 1.2 }),
      rug: std({ ...weave(wool, 0.8), color: "#d9d0c1", roughness: 1 }),
      lacquer: std({ color: "#f1efeb", roughness: 0.35 }),
      steel: std({ color: "#c9ced3", metalness: 0.9, roughness: 0.28 }),
      darkMetal: std({ color: "#25282c", metalness: 0.7, roughness: 0.4 }),
      blackGlass: std({ color: "#0b0d10", metalness: 0.3, roughness: 0.08, envMapIntensity: 1.5 }),
      ceramic: std({ color: "#fbfbfa", roughness: 0.12, envMapIntensity: 1.2 }),
      mirror: std({ color: "#dfe7ee", metalness: 1, roughness: 0.03 }),
      glass: std({ color: "#dcebf2", roughness: 0.04, transparent: true, opacity: 0.22, envMapIntensity: 1.6, depthWrite: false }),
      plaster: std({ color: "#efedea", roughness: 0.95 }),
      poche: std({ color: "#2b2f36", roughness: 0.8 }),
    };
  }, [linen, velvet, oak, marble, wool]);
}

type Mats = ReturnType<typeof useMaterials>;

/* ────────────────────────── shell ────────────────────────── */

function Slab({ bounds }: { bounds: { w: number; d: number; cx: number; cz: number } }) {
  return (
    <mesh position={[bounds.cx, -0.16, bounds.cz]} receiveShadow castShadow>
      <boxGeometry args={[bounds.w + 0.5, 0.3, bounds.d + 0.5]} />
      <meshStandardMaterial color="#d2cdc5" roughness={0.95} />
    </mesh>
  );
}

function RoomFloor({ room, selected, onSelect }: { room: Room; selected: boolean; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const spec = FLOOR_TEX[room.type];
  const set = useTexSet(spec.name);
  const maps = useMemo(() => tiled(set, room.w, room.d, spec.tile), [set, room.w, room.d, spec.tile]);

  return (
    <mesh
      position={[room.x + room.w / 2, 0.01, room.z + room.d / 2]}
      rotation-x={-Math.PI / 2}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onSelect(room.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[room.w, room.d]} />
      <meshStandardMaterial
        {...maps}
        roughness={1}
        emissive={selected ? "#c49a52" : "#ffffff"}
        emissiveIntensity={selected ? 0.08 : hovered ? 0.05 : 0}
      />
    </mesh>
  );
}

type Piece = [number, number, "wall" | "window"];

// Each room draws its own four walls just inside its outline, so neighbouring
// rooms' walls sit back to back. Doors cut a full-height gap; windows keep a
// sill wall and get a glass pane.
function Walls({ layout }: { layout: FlatLayout }) {
  const mats = useMaterials();
  const { solid, windows } = useMemo(() => {
    const solid: { x: number; z: number; w: number; d: number; y0: number; y1: number }[] = [];
    const windows: { x: number; z: number; w: number; d: number }[] = [];
    const t = WALL_T / 2;

    const cut = (axis: "x" | "z", line: number, from: number, to: number) => {
      let pieces: Piece[] = [[from, to, "wall"]];
      for (const o of layout.openings) {
        if (o.axis !== axis || Math.abs(o.at - line) > 0.2) continue;
        const a = o.center - o.width / 2;
        const b = o.center + o.width / 2;
        pieces = pieces.flatMap(([p, q, k]): Piece[] => {
          if (k !== "wall" || b <= p || a >= q) return [[p, q, k]];
          const keep: Piece[] = [];
          if (a > p) keep.push([p, a, "wall"]);
          if (o.kind === "window") keep.push([Math.max(a, p), Math.min(b, q), "window"]);
          if (b < q) keep.push([b, q, "wall"]);
          return keep;
        });
      }
      return pieces.filter(([p, q]) => q - p > 0.02);
    };

    const add = (horizontal: boolean, line: number, offset: number, from: number, to: number) => {
      for (const [p, q, kind] of cut(horizontal ? "x" : "z", line, from, to)) {
        const c = (p + q) / 2;
        const len = q - p;
        const box = horizontal ? { x: c, z: offset, w: len, d: WALL_T / 2 } : { x: offset, z: c, w: WALL_T / 2, d: len };
        if (kind === "wall") solid.push({ ...box, y0: 0, y1: WALL_H });
        else {
          solid.push({ ...box, y0: 0, y1: SILL_H });
          windows.push(box);
        }
      }
    };

    for (const r of layout.rooms) {
      if (r.type === "balcony") continue;
      add(true, r.z, r.z + t, r.x, r.x + r.w);
      add(true, r.z + r.d, r.z + r.d - t, r.x, r.x + r.w);
      add(false, r.x, r.x + t, r.z + WALL_T / 2, r.z + r.d - WALL_T / 2);
      add(false, r.x + r.w, r.x + r.w - t, r.z + WALL_T / 2, r.z + r.d - WALL_T / 2);
    }
    return { solid, windows };
  }, [layout]);

  const balcony = layout.rooms.find((r) => r.type === "balcony");

  return (
    <group>
      {solid.map((s, i) => (
        <group key={i}>
          <mesh position={[s.x, (s.y0 + s.y1) / 2, s.z]} castShadow receiveShadow material={mats.plaster}>
            <boxGeometry args={[s.w, s.y1 - s.y0, s.d]} />
          </mesh>
          {/* dark cut-top, as in architectural section renders */}
          <mesh position={[s.x, s.y1 + 0.004, s.z]} material={mats.poche}>
            <boxGeometry args={[s.w + 0.002, 0.008, s.d + 0.002]} />
          </mesh>
        </group>
      ))}
      {windows.map((wdw, i) => (
        <group key={`w${i}`}>
          <mesh position={[wdw.x, (SILL_H + WALL_H) / 2, wdw.z]} material={mats.glass}>
            <boxGeometry args={[Math.max(wdw.w, 0.02), WALL_H - SILL_H, Math.max(wdw.d, 0.02)]} />
          </mesh>
          <mesh position={[wdw.x, SILL_H + 0.015, wdw.z]} material={mats.darkMetal} castShadow>
            <boxGeometry args={[wdw.w + 0.02, 0.03, wdw.d + 0.06]} />
          </mesh>
        </group>
      ))}
      {balcony && <BalconyRail room={balcony} mats={mats} />}
    </group>
  );
}

function BalconyRail({ room, mats }: { room: Room; mats: Mats }) {
  const h = 1.05;
  const runs = [
    { x: room.x + room.w / 2, z: room.z + 0.03, w: room.w, d: 0.02 },
    { x: room.x + 0.03, z: room.z + room.d / 2, w: 0.02, d: room.d },
    { x: room.x + room.w - 0.03, z: room.z + room.d / 2, w: 0.02, d: room.d },
  ];
  return (
    <group>
      {runs.map((r, i) => (
        <group key={i}>
          <mesh position={[r.x, h / 2, r.z]} material={mats.glass}>
            <boxGeometry args={[r.w, h, r.d]} />
          </mesh>
          <mesh position={[r.x, h, r.z]} material={mats.steel} castShadow>
            <boxGeometry args={[r.w + 0.03, 0.04, r.d + 0.04]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ────────────────────────── furniture ────────────────────────── */

type V3 = [number, number, number];

// Rounded box helper with a safe corner radius.
function Bx({ size, pos, rot = 0, mat, r = 0.02 }: { size: V3; pos: V3; rot?: number; mat: THREE.Material; r?: number }) {
  const radius = Math.max(0.001, Math.min(r, Math.min(...size) / 2 - 0.001));
  return <RoundedBox args={size} radius={radius} smoothness={3} position={pos} rotation-y={rot} material={mat} castShadow receiveShadow />;
}

function Model({ url, pos, rot = 0, scale = 1 }: { url: string; pos: V3; rot?: number; scale?: number }) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  return <primitive object={object} position={pos} rotation-y={rot} scale={scale} />;
}

// A group placed at `pos`, rotated about y.
function At({ pos, rot = 0, children }: { pos: V3; rot?: number; children: React.ReactNode }) {
  return (
    <group position={pos} rotation-y={rot}>
      {children}
    </group>
  );
}

// Modern three-seater in linen; local front faces -x.
function Sofa({ mats }: { mats: Mats }) {
  const L = 2.3;
  const D = 0.92;
  const seatW = (L - 0.32) / 3;
  return (
    <group>
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => <Bx key={`${sx}${sz}`} size={[0.05, 0.08, 0.05]} pos={[sx * (D / 2 - 0.08), 0.04, sz * (L / 2 - 0.08)]} mat={mats.darkMetal} r={0.01} />))}
      <Bx size={[D, 0.2, L]} pos={[0, 0.18, 0]} mat={mats.sofa} r={0.04} />
      <Bx size={[0.18, 0.46, L]} pos={[D / 2 - 0.09, 0.51, 0]} mat={mats.sofa} r={0.06} />
      {[-1, 1].map((s) => (
        <Bx key={s} size={[D, 0.34, 0.16]} pos={[0, 0.45, s * (L / 2 - 0.08)]} mat={mats.sofa} r={0.06} />
      ))}
      {[-1, 0, 1].map((i) => (
        <group key={i}>
          <Bx size={[D - 0.3, 0.16, seatW - 0.02]} pos={[-0.06, 0.36, i * seatW]} mat={mats.sofa} r={0.07} />
          <Bx size={[0.2, 0.4, seatW - 0.03]} pos={[D / 2 - 0.25, 0.62, i * seatW]} mat={mats.sofa} r={0.08} />
        </group>
      ))}
      <Bx size={[0.12, 0.36, 0.36]} pos={[D / 2 - 0.4, 0.6, -0.72]} mat={mats.velvetOlive} r={0.06} />
      <Bx size={[0.12, 0.34, 0.34]} pos={[D / 2 - 0.4, 0.6, 0.74]} mat={mats.velvetTaupe} r={0.06} />
    </group>
  );
}

// Upholstered bed; headboard at local -z, foot toward +z.
function Bed({ w, l, mats, frame }: { w: number; l: number; mats: Mats; frame: THREE.Material }) {
  return (
    <group>
      <Bx size={[w + 0.12, 0.3, l + 0.06]} pos={[0, 0.17, 0.03]} mat={frame} r={0.04} />
      <Bx size={[w, 0.22, l]} pos={[0, 0.42, 0]} mat={mats.linenWhite} r={0.06} />
      <Bx size={[w + 0.06, 0.07, l * 0.66]} pos={[0, 0.55, l * 0.17]} mat={mats.linenSand} r={0.03} />
      <Bx size={[w + 0.08, 0.03, 0.42]} pos={[0, 0.6, l / 2 - 0.32]} mat={frame} r={0.01} />
      {[-1, 1].map((s) => (
        <Bx key={s} size={[w / 2 - 0.12, 0.14, 0.42]} pos={[(s * w) / 4, 0.6, -l / 2 + 0.3]} mat={mats.linenWhite} r={0.06} />
      ))}
      <Bx size={[w + 0.36, 1.1, 0.1]} pos={[0, 0.55, -l / 2 - 0.06]} mat={frame} r={0.04} />
    </group>
  );
}

// Oak wardrobe; front faces local +z.
function Wardrobe({ w, h = 1.72, d = 0.58, mats }: { w: number; h?: number; d?: number; mats: Mats }) {
  const doors = Math.max(2, Math.round(w / 0.5));
  const dw = w / doors;
  return (
    <group>
      <Bx size={[w, h, d]} pos={[0, h / 2, 0]} mat={mats.oak} r={0.01} />
      {Array.from({ length: doors - 1 }, (_, i) => (
        <mesh key={i} position={[-w / 2 + (i + 1) * dw, h / 2, d / 2 + 0.001]} material={mats.darkMetal}>
          <boxGeometry args={[0.006, h - 0.04, 0.002]} />
        </mesh>
      ))}
      {Array.from({ length: doors }, (_, i) => (
        <mesh key={`h${i}`} position={[-w / 2 + (i + 0.5) * dw + (i % 2 ? -1 : 1) * dw * 0.38, h * 0.55, d / 2 + 0.012]} material={mats.darkMetal} castShadow>
          <boxGeometry args={[0.012, 0.32, 0.02]} />
        </mesh>
      ))}
    </group>
  );
}

// Kitchen base run with marble top; front faces local +z.
function Counter({ len, mats, hob, sink }: { len: number; mats: Mats; hob?: number; sink?: number }) {
  const units = Math.max(1, Math.round(len / 0.6));
  return (
    <group>
      <Bx size={[len, 0.1, 0.52]} pos={[0, 0.05, -0.03]} mat={mats.darkMetal} r={0.005} />
      <Bx size={[len, 0.76, 0.58]} pos={[0, 0.48, 0]} mat={mats.lacquer} r={0.008} />
      {Array.from({ length: units - 1 }, (_, i) => (
        <mesh key={i} position={[-len / 2 + ((i + 1) * len) / units, 0.48, 0.291]} material={mats.darkMetal}>
          <boxGeometry args={[0.004, 0.72, 0.002]} />
        </mesh>
      ))}
      <Bx size={[len + 0.02, 0.04, 0.62]} pos={[0, 0.88, 0.01]} mat={mats.marble} r={0.006} />
      {hob !== undefined && (
        <mesh position={[hob, 0.902, 0]} material={mats.blackGlass}>
          <boxGeometry args={[0.6, 0.006, 0.5]} />
        </mesh>
      )}
      {sink !== undefined && (
        <group position={[sink, 0.9, 0.02]}>
          <mesh position-y={0.004} material={mats.steel}>
            <boxGeometry args={[0.56, 0.004, 0.42]} />
          </mesh>
          <mesh position={[0, 0.17, -0.24]} material={mats.steel} castShadow>
            <cylinderGeometry args={[0.012, 0.015, 0.34, 10]} />
          </mesh>
          <mesh position={[0, 0.33, -0.15]} rotation-x={Math.PI / 2} material={mats.steel} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.2, 10]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Bathroom pieces; fronts face local +z.
function Vanity({ mats }: { mats: Mats }) {
  return (
    <group>
      <Bx size={[0.8, 0.42, 0.46]} pos={[0, 0.5, 0]} mat={mats.oak} r={0.01} />
      <Bx size={[0.82, 0.08, 0.48]} pos={[0, 0.75, 0]} mat={mats.ceramic} r={0.02} />
      <mesh position={[0, 0.9, -0.17]} material={mats.steel} castShadow>
        <cylinderGeometry args={[0.012, 0.014, 0.22, 10]} />
      </mesh>
      <mesh position={[0, 1.35, -0.225]} material={mats.mirror}>
        <boxGeometry args={[0.7, 0.8, 0.012]} />
      </mesh>
    </group>
  );
}

function Wc({ mats }: { mats: Mats }) {
  return (
    <group>
      <Bx size={[0.38, 0.4, 0.54]} pos={[0, 0.2, 0.05]} mat={mats.ceramic} r={0.12} />
      <Bx size={[0.4, 0.04, 0.48]} pos={[0, 0.42, 0.06]} mat={mats.ceramic} r={0.02} />
      <Bx size={[0.4, 0.36, 0.16]} pos={[0, 0.55, -0.2]} mat={mats.ceramic} r={0.04} />
    </group>
  );
}

function Shower({ w, d, mats }: { w: number; d: number; mats: Mats }) {
  return (
    <group>
      <Bx size={[w, 0.04, d]} pos={[0, 0.02, 0]} mat={mats.ceramic} r={0.01} />
      <mesh position={[0, 0.9, -d / 2]} material={mats.glass}>
        <boxGeometry args={[w * 0.7, 1.75, 0.01]} />
      </mesh>
      <mesh position={[0, 1.78, -d / 2]} material={mats.steel}>
        <boxGeometry args={[w * 0.7, 0.02, 0.02]} />
      </mesh>
    </group>
  );
}

const PI = Math.PI;

// Furniture for the illustrative layouts (plan coordinates in metres). The
// 3 BHK shares the 2 BHK rooms and adds a bedroom 3 suite on the right.
function Furnishings({ layoutId }: { layoutId: string }) {
  const mats = useMaterials();
  const M = MODELS;
  return (
    <group>
      {/* ── Living & dining ── */}
      <Model url={M.mediaConsole} pos={[0.33, 0, 1.6]} rot={PI / 2} />
      <Bx size={[0.035, 0.74, 1.3]} pos={[0.1, 1.2, 1.6]} mat={mats.blackGlass} r={0.008} />
      <Bx size={[2.0, 0.012, 2.5]} pos={[2.05, 0.016, 1.6]} mat={mats.rug} r={0.004} />
      <Model url={M.coffeeTable} pos={[2.05, 0.022, 1.6]} />
      <At pos={[3.45, 0, 1.6]}>
        <Sofa mats={mats} />
      </At>
      <Model url={M.sideTable} pos={[3.45, 0, 3.02]} />
      <Model url={M.succulent} pos={[3.45, 0.55, 3.02]} scale={1.4} />
      <Model url={M.plant} pos={[5.0, 0, 0.45]} scale={1.15} />
      <At pos={[1.4, 0, 3.55]}>
        <Bx size={[1.5, 0.04, 0.86]} pos={[0, 0.74, 0]} mat={mats.oak} r={0.012} />
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sz) => <Bx key={`${sx}${sz}`} size={[0.04, 0.72, 0.04]} pos={[sx * 0.66, 0.36, sz * 0.34]} mat={mats.darkMetal} r={0.01} />),
        )}
      </At>
      <Model url={M.diningChair} pos={[1.0, 0, 2.97]} />
      <Model url={M.diningChair} pos={[1.8, 0, 2.97]} />
      <Model url={M.diningChair} pos={[1.0, 0, 4.13]} rot={PI} />
      <Model url={M.diningChair} pos={[1.8, 0, 4.13]} rot={PI} />

      {/* ── Kitchen & utility ── */}
      <At pos={[6.8, 0, 0.37]}>
        <Counter len={2.66} mats={mats} hob={-0.75} sink={0.1} />
      </At>
      <At pos={[6.65, 0, 2.63]} rot={PI}>
        <Counter len={1.5} mats={mats} />
      </At>
      <Bx size={[0.7, 1.75, 0.68]} pos={[7.78, 0.875, 2.58]} mat={mats.steel} r={0.02} />
      <At pos={[9.55, 0, 0.4]}>
        <Bx size={[0.6, 0.85, 0.6]} pos={[0, 0.425, 0]} mat={mats.lacquer} r={0.03} />
        <mesh position={[0, 0.48, 0.302]} rotation-x={PI / 2} material={mats.blackGlass}>
          <cylinderGeometry args={[0.17, 0.17, 0.01, 32]} />
        </mesh>
      </At>
      <At pos={[8.75, 0, 0.37]}>
        <Counter len={0.9} mats={mats} />
      </At>

      {/* ── Foyer ── */}
      <Bx size={[1.2, 0.9, 0.36]} pos={[7.4, 0.45, 3.25]} mat={mats.oak} r={0.01} />
      <Model url={M.plant} pos={[5.9, 0, 3.32]} scale={0.9} rot={1.2} />

      {/* ── Master bedroom & dressing ── */}
      <Bx size={[2.6, 0.012, 2.1]} pos={[1.9, 0.016, 6.6]} mat={mats.rug} r={0.004} />
      <At pos={[1.9, 0, 6.8]} rot={PI}>
        <Bed w={1.8} l={2.05} mats={mats} frame={mats.velvetTaupe} />
      </At>
      <Model url={M.sideTable} pos={[0.6, 0, 7.62]} />
      <Model url={M.sideTable} pos={[3.2, 0, 7.62]} />
      <Model url={M.succulent} pos={[3.2, 0.55, 7.62]} scale={1.2} />
      <At pos={[1.29, 0, 4.97]}>
        <Wardrobe w={2.3} mats={mats} />
      </At>
      <At pos={[4.6, 0, 7.65]} rot={PI}>
        <Wardrobe w={1.46} d={0.55} mats={mats} />
      </At>

      {/* ── Master toilet ── */}
      <At pos={[5.1, 0, 5.1]} rot={-PI / 2}>
        <Vanity mats={mats} />
      </At>
      <At pos={[5.05, 0, 6.15]} rot={-PI / 2}>
        <Wc mats={mats} />
      </At>

      {/* ── Bedroom 2 ── */}
      <At pos={[7.33, 0, 6.4]} rot={-PI / 2}>
        <Bed w={1.5} l={1.95} mats={mats} frame={mats.velvetSlate} />
      </At>
      <Model url={M.sideTable} pos={[8.05, 0, 7.6]} />
      <Model url={M.succulent} pos={[8.05, 0.55, 7.6]} scale={1.2} />
      <At pos={[5.75, 0, 6.5]} rot={PI / 2}>
        <Wardrobe w={2.2} d={0.55} mats={mats} />
      </At>

      {/* ── Common toilet ── */}
      <At pos={[9.7, 0, 5.5]} rot={-PI / 2}>
        <Vanity mats={mats} />
      </At>
      <At pos={[9.65, 0, 6.45]} rot={-PI / 2}>
        <Wc mats={mats} />
      </At>
      <At pos={[9.2, 0, 7.46]}>
        <Shower w={1.46} d={0.93} mats={mats} />
      </At>

      {/* ── Balcony ── */}
      <Model url={M.outdoorSet} pos={[4.1, 0, -0.8]} rot={PI / 2} />
      <Model url={M.plant} pos={[0.5, 0, -1.15]} />

      {layoutId === "3bhk" && (
        <group>
          {/* ── Bedroom 3 suite ── */}
          <Bx size={[2.3, 0.012, 2.2]} pos={[11.95, 0.016, 2.3]} mat={mats.rug} r={0.004} />
          <At pos={[12.1, 0, 2.3]} rot={-PI / 2}>
            <Bed w={1.6} l={1.95} mats={mats} frame={mats.velvetOlive} />
          </At>
          <Model url={M.sideTable} pos={[12.85, 0, 1.05]} />
          <Model url={M.sideTable} pos={[12.85, 0, 3.55]} />
          <Model url={M.succulent} pos={[12.85, 0.55, 3.55]} scale={1.2} />
          <At pos={[10.35, 0, 1.4]} rot={PI / 2}>
            <Wardrobe w={2.2} d={0.55} mats={mats} />
          </At>
          <At pos={[10.37, 0, 5.3]} rot={PI / 2}>
            <Wardrobe w={1.2} d={0.5} mats={mats} />
          </At>
          <At pos={[12.88, 0, 5.3]} rot={-PI / 2}>
            <Wardrobe w={1.2} d={0.5} mats={mats} />
          </At>
          <At pos={[10.62, 0, 7.15]}>
            <Shower w={1.1} d={1.6} mats={mats} />
          </At>
          <At pos={[11.7, 0, 7.62]} rot={PI}>
            <Wc mats={mats} />
          </At>
          <At pos={[12.75, 0, 7.7]} rot={PI}>
            <Vanity mats={mats} />
          </At>
        </group>
      )}
    </group>
  );
}

for (const url of Object.values(MODELS)) useGLTF.preload(url);

/* ────────────────────────── camera & labels ────────────────────────── */

function LabelProjector({
  layout,
  bounds,
  labels,
}: {
  layout: FlatLayout;
  bounds: { cx: number; cz: number };
  labels: React.RefObject<(HTMLButtonElement | null)[]>;
}) {
  const { camera, size } = useThree();
  const points = useMemo(
    () => layout.rooms.map((r) => new THREE.Vector3(r.x + r.w / 2 - bounds.cx, WALL_H + 0.3, r.z + r.d / 2 - bounds.cz)),
    [layout, bounds],
  );
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    points.forEach((p, i) => {
      const el = labels.current[i];
      if (!el) return;
      v.copy(p).project(camera);
      const behind = v.z > 1;
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y + 4}px)`;
      el.style.opacity = behind ? "0" : "1";
    });
  });

  return null;
}

function CameraRig({
  layout,
  bounds,
  selected,
}: {
  layout: FlatLayout;
  bounds: { cx: number; cz: number };
  selected: string | null;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();
  // Pull back on narrow (portrait) screens so the whole home fits.
  const fit = size.width < size.height * 1.2 ? 1.35 : 1;
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);

  useEffect(() => {
    const room = layout.rooms.find((r) => r.id === selected);
    if (!room) {
      goal.current = { pos: new THREE.Vector3(6.5, 10, -11.5).multiplyScalar(fit), target: new THREE.Vector3(0, 0, 0) };
      return;
    }
    const center = new THREE.Vector3(room.x + room.w / 2 - bounds.cx, 0.5, room.z + room.d / 2 - bounds.cz);
    const reach = Math.max(room.w, room.d) * 0.85 + 2.4;
    goal.current = { pos: center.clone().add(new THREE.Vector3(reach * 0.5, reach * 0.9, -reach * 0.8)), target: center };
  }, [selected, layout, bounds, fit]);

  useFrame((_, dt) => {
    const g = goal.current;
    const c = controls.current;
    if (!g || !c) return;
    const k = 1 - Math.exp(-dt * 3.5);
    camera.position.lerp(g.pos, k);
    c.target.lerp(g.target, k);
    c.update();
    if (camera.position.distanceTo(g.pos) < 0.02 && c.target.distanceTo(g.target) < 0.02) goal.current = null;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      enablePan={false}
      minDistance={3}
      maxDistance={24}
      maxPolarAngle={Math.PI / 2.3}
      onStart={() => (goal.current = null)}
    />
  );
}
