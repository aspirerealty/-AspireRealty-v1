"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, RoundedBox, useCursor } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { FlatLayout, Room, RoomType } from "@/data/flat-layouts";

// Diorama "dollhouse" view of an apartment sitting on a grass-and-earth base:
// pastel floors, rounded cut-away walls with door openings, soft furniture
// and architectural annotation labels. Selecting a room flies the camera in.

const WALL_H = 1.5; // cut-away height so every room is visible from above
const WALL_T = 0.14;

const FLOOR_COLORS: Record<RoomType, string> = {
  living: "#e8cfa6",
  bedroom: "#dcb88f",
  kitchen: "#eef0f2",
  wet: "#dfe7ef",
  balcony: "#cdd5dd",
  passage: "#ecdcc0",
};
const BASE_H = 0.8;
const MARGIN = 1.1;

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
    return { cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2, w: maxX - minX, d: maxZ - minZ, size: Math.max(maxX - minX, maxZ - minZ) };
  }, [layout]);

  // Room labels are plain DOM buttons laid over the canvas and moved every
  // frame by <LabelProjector>, which is lighter than one React root per label.
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const touch = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);

  return (
    <div className="absolute inset-0">
      <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.75]} shadows="soft" camera={{ position: [6, 11, 12], fov: 40 }} gl={{ antialias: false }}>
        <color attach="background" args={["#e4e9f0"]} />
        <hemisphereLight args={["#ffffff", "#bcc6d6", 1.3]} />
        <directionalLight
          position={[7, 14, 6]}
          intensity={1.9}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-8, 6, -6]} intensity={0.4} color="#d6e2ff" />
        <DioramaBase w={bounds.w + MARGIN * 2} d={bounds.d + MARGIN * 2} />

        {/* Centre the plan at the origin */}
        <group position={[-bounds.cx, 0, -bounds.cz]}>
          {layout.rooms.map((room) => (
            <RoomFloor key={room.id} room={room} selected={selected === room.id} onSelect={onSelect} />
          ))}
          <Walls layout={layout} />
          {layout.furniture.map((f, i) => (
            <RoundedBox
              key={i}
              args={[f.w, f.h, f.d]}
              radius={Math.min(0.07, Math.min(f.w, f.h, f.d) / 2 - 0.01)}
              smoothness={3}
              position={[f.x + f.w / 2, f.h / 2 + 0.05, f.z + f.d / 2]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={f.color} roughness={0.7} />
            </RoundedBox>
          ))}
        </group>

        <ContactShadows position={[0, -BASE_H - 0.02, 0]} opacity={0.4} scale={34} blur={2.6} far={6} color="#1d2b3f" />
        <EffectComposer multisampling={touch ? 0 : 4}>
          {touch ? <></> : <N8AO aoRadius={0.8} intensity={2} distanceFalloff={0.8} halfRes quality="medium" />}
        </EffectComposer>
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
                selected === room.id ? "border-gold-500 bg-gold-500 text-navy-950" : "border-navy-900/40 bg-white/70 text-navy-900 group-hover:bg-white"
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

function useGrassTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 16;
    const ctx = canvas.getContext("2d")!;
    const greens = ["#8fd16a", "#86c962", "#9ad874", "#7fc05c"];
    for (let y = 0; y < 16; y += 2) {
      for (let x = 0; x < 16; x += 2) {
        ctx.fillStyle = greens[(x * 7 + y * 13 + ((x * y) % 5)) % greens.length];
        ctx.fillRect(x, y, 2, 2);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }, []);
}

// Chunky grass-topped earth block the apartment sits on, with a few trees.
function DioramaBase({ w, d }: { w: number; d: number }) {
  const grass = useGrassTexture();
  const dirt = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7a5236", roughness: 0.9 }), []);
  const materials = useMemo(() => [dirt, dirt, new THREE.MeshStandardMaterial({ map: grass, roughness: 0.95 }), dirt, dirt, dirt], [dirt, grass]);
  const trees: [number, number][] = [
    [-w / 2 + 0.5, -d / 2 + 0.5],
    [w / 2 - 0.5, -d / 2 + 0.6],
    [w / 2 - 0.5, d / 2 - 0.5],
    [-w / 2 + 0.55, d / 2 - 0.6],
  ];
  return (
    <group>
      <mesh position-y={-BASE_H / 2} material={materials} receiveShadow castShadow>
        <boxGeometry args={[w, BASE_H, d]} />
      </mesh>
      {trees.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]} scale={0.75}>
          <mesh position-y={0.3} castShadow>
            <cylinderGeometry args={[0.08, 0.11, 0.6, 6]} />
            <meshStandardMaterial color="#7a5236" />
          </mesh>
          <mesh position-y={0.95} castShadow>
            <coneGeometry args={[0.55, 1, 7]} />
            <meshStandardMaterial color="#5fb35a" flatShading />
          </mesh>
          <mesh position-y={1.55} castShadow>
            <coneGeometry args={[0.4, 0.8, 7]} />
            <meshStandardMaterial color="#79c76a" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RoomFloor({ room, selected, onSelect }: { room: Room; selected: boolean; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const color = useMemo(() => {
    const base = new THREE.Color(FLOOR_COLORS[room.type]);
    if (selected) return base.lerp(new THREE.Color("#c49a52"), 0.55);
    if (hovered) return base.lerp(new THREE.Color("#ffffff"), 0.25);
    return base;
  }, [room.type, selected, hovered]);

  return (
    <mesh
      position={[room.x + room.w / 2, 0.025, room.z + room.d / 2]}
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
      <boxGeometry args={[room.w, 0.05, room.d]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

// Each room draws its own four walls just inside its outline, so neighbouring
// rooms' walls sit back to back. Door openings are cut out of any wall that
// runs along the opening's line.
function Walls({ layout }: { layout: FlatLayout }) {
  const segments = useMemo(() => {
    const out: { x: number; z: number; w: number; d: number }[] = [];
    const t = WALL_T / 2;

    const cut = (axis: "x" | "z", line: number, from: number, to: number) => {
      let pieces: [number, number][] = [[from, to]];
      for (const o of layout.openings) {
        if (o.axis !== axis || Math.abs(o.at - line) > 0.2) continue;
        const a = o.center - o.width / 2;
        const b = o.center + o.width / 2;
        pieces = pieces.flatMap(([p, q]) => {
          if (b <= p || a >= q) return [[p, q] as [number, number]];
          const keep: [number, number][] = [];
          if (a > p) keep.push([p, a]);
          if (b < q) keep.push([b, q]);
          return keep;
        });
      }
      return pieces.filter(([p, q]) => q - p > 0.02);
    };

    for (const r of layout.rooms) {
      if (r.type === "balcony") {
        // Low parapet instead of full walls on the open sides.
        continue;
      }
      // Walls along x (front and back), full length.
      for (const [line, z] of [
        [r.z, r.z + t],
        [r.z + r.d, r.z + r.d - t],
      ]) {
        for (const [p, q] of cut("x", line, r.x, r.x + r.w)) out.push({ x: (p + q) / 2, z, w: q - p, d: WALL_T / 2 });
      }
      // Walls along z (left and right), trimmed to avoid overlapping corners.
      for (const [line, x] of [
        [r.x, r.x + t],
        [r.x + r.w, r.x + r.w - t],
      ]) {
        for (const [p, q] of cut("z", line, r.z + WALL_T / 2, r.z + r.d - WALL_T / 2)) out.push({ x, z: (p + q) / 2, w: WALL_T / 2, d: q - p });
      }
    }
    return out;
  }, [layout]);

  const balconies = layout.rooms.filter((r) => r.type === "balcony");

  return (
    <group>
      {segments.map((s, i) => (
        <RoundedBox key={i} args={[s.w, WALL_H, s.d]} radius={0.025} smoothness={2} position={[s.x, WALL_H / 2, s.z]} castShadow receiveShadow>
          <meshStandardMaterial color="#fdfcf9" roughness={0.85} />
        </RoundedBox>
      ))}
      {balconies.map((b) => (
        <mesh key={b.id} position={[b.x + b.w / 2, 0.45, b.z + 0.03]}>
          <boxGeometry args={[b.w, 0.9, 0.04]} />
          <meshStandardMaterial color="#9fc3e0" transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({
  layout,
  bounds,
  selected,
}: {
  layout: FlatLayout;
  bounds: { cx: number; cz: number; size: number };
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
      goal.current = { pos: new THREE.Vector3(6, 11, 12).multiplyScalar(fit), target: new THREE.Vector3(0, 0, 0) };
      return;
    }
    const center = new THREE.Vector3(room.x + room.w / 2 - bounds.cx, 0.4, room.z + room.d / 2 - bounds.cz);
    const reach = Math.max(room.w, room.d) * 0.9 + 2.2;
    goal.current = { pos: center.clone().add(new THREE.Vector3(reach * 0.45, reach * 0.95, reach * 0.8)), target: center };
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
      maxDistance={26}
      maxPolarAngle={Math.PI / 2.3}
      onStart={() => (goal.current = null)}
    />
  );
}
