"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useCursor } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { FlatLayout, Room, RoomType } from "@/data/flat-layouts";

// "Dollhouse" view of an apartment: floors, cut-away walls with door
// openings, simple furniture and clickable room labels. Selecting a room
// flies the camera into it.

const WALL_H = 1.5; // cut-away height so every room is visible from above
const WALL_T = 0.14;

const FLOOR_COLORS: Record<RoomType, string> = {
  living: "#caa57a",
  bedroom: "#b98f62",
  kitchen: "#d9dde2",
  wet: "#cfd6dc",
  balcony: "#9aa5ae",
  passage: "#d3b48c",
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
    return { cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2, size: Math.max(maxX - minX, maxZ - minZ) };
  }, [layout]);

  // Room labels are plain DOM buttons laid over the canvas and moved every
  // frame by <LabelProjector>, which is lighter than one React root per label.
  const labels = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className="absolute inset-0">
      <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.75]} shadows camera={{ position: [6, 11, 12], fov: 40 }}>
        <color attach="background" args={["#eef1f4"]} />
        <hemisphereLight args={["#ffffff", "#c9c2b6", 1.2]} />
        <directionalLight position={[6, 12, 4]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />

        {/* Centre the plan at the origin */}
        <group position={[-bounds.cx, 0, -bounds.cz]}>
          {layout.rooms.map((room) => (
            <RoomFloor key={room.id} room={room} selected={selected === room.id} onSelect={onSelect} />
          ))}
          <Walls layout={layout} />
          {layout.furniture.map((f, i) => (
            <mesh key={i} position={[f.x + f.w / 2, f.h / 2 + 0.05, f.z + f.d / 2]} castShadow receiveShadow>
              <boxGeometry args={[f.w, f.h, f.d]} />
              <meshStandardMaterial color={f.color} roughness={0.7} />
            </mesh>
          ))}
        </group>

        <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={30} blur={2.5} far={4} />
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
            className={`pointer-events-auto absolute top-0 left-0 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold shadow-md transition-colors ${
              selected === room.id ? "bg-gold-500 text-navy-950" : "bg-white/90 text-navy-900 hover:bg-white"
            }`}
          >
            {room.name}
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
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      el.style.opacity = behind ? "0" : "1";
    });
  });

  return null;
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
        <mesh key={i} position={[s.x, WALL_H / 2, s.z]} castShadow receiveShadow>
          <boxGeometry args={[s.w, WALL_H, s.d]} />
          <meshStandardMaterial color="#fbfaf7" roughness={0.9} />
        </mesh>
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
