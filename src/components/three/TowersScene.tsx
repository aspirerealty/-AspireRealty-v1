"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Edges, OrbitControls, RoundedBox } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { FLOORS, HOTSPOT_INFO, type HotspotId } from "./towers-data";

// Low-poly "diorama" of the twin G+47 towers: grass tiles pop up one by one,
// trees spring up, then both towers stack floor by floor with a little bounce
// while a tower crane climbs alongside. Soft studio light, ambient occlusion
// and a day/night switch where the windows glow.

/* ────────────────────────── layout ────────────────────────── */

const TILE = 2;
const TILE_H = 0.8;
const COLS = 11;
const ROWS = 8;
const FLOOR_H = 0.34;
const HEIGHT = FLOORS * FLOOR_H;
const W = 4.2;
const D = 3.2;
const TOWERS = [
  { x: -4.4, z: -0.6, delay: 0 },
  { x: 4.2, z: -2.6, delay: 0.35 },
];
const MLCP = { x: -9, z: -6 };
const START = 1.7; // seconds before the first floor lands
const PER_FLOOR = 0.105;
const FLOOR_ANIM = 0.5;
const TARGET_Y = 8;

const HOTSPOT_POS: Record<HotspotId, [number, number, number]> = {
  crown: [TOWERS[0].x, HEIGHT + 2.4, TOWERS[0].z],
  breakout: [1, 0.6, 3.5],
  mlcp: [MLCP.x, 3.6, MLCP.z],
  open: [7.5, 0.6, 4.5],
};

function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

type TileKind = "grass" | "stone" | "water";
type Tile = { x: number; z: number; delay: number; kind: TileKind };

const inside = (x: number, z: number, cx: number, cz: number, hw: number, hd: number) => Math.abs(x - cx) <= hw && Math.abs(z - cz) <= hd;

const TILES: Tile[] = (() => {
  const list: Tile[] = [];
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      const x = -((COLS - 1) * TILE) / 2 + i * TILE;
      const z = -((ROWS - 1) * TILE) / 2 + j * TILE;
      let kind: TileKind = "grass";
      if (TOWERS.some((t) => inside(x, z, t.x, t.z, W / 2 + 0.6, D / 2 + 0.6))) kind = "stone";
      if (inside(x, z, MLCP.x, MLCP.z, 2, 2)) kind = "stone";
      if (i === 5 || (j === 4 && i > 5)) kind = "stone";
      if ((x === 2 || x === 4) && z === 5) kind = "water";
      list.push({ x, z, kind, delay: 0.1 + (Math.hypot(x, z) / 14) * 0.9 });
    }
  }
  return list;
})();

const TREES: { x: number; z: number; s: number; delay: number }[] = (() => {
  const rand = rng(9);
  const list: { x: number; z: number; s: number; delay: number }[] = [];
  for (const t of TILES) {
    if (t.kind !== "grass") continue;
    const n = rand() < 0.55 ? (rand() < 0.4 ? 2 : 1) : 0;
    for (let k = 0; k < n; k++) {
      list.push({ x: t.x + (rand() - 0.5) * 1.3, z: t.z + (rand() - 0.5) * 1.3, s: 0.7 + rand() * 0.5, delay: 1.1 + rand() * 0.8 });
    }
  }
  return list;
})();

const LAMPS: [number, number][] = [-6, -2, 2, 6].flatMap((z) => [
  [-1, z],
  [1, z],
]);

// Floors lit at night (seeded so it looks the same every time).
const LIT = (() => {
  const rand = rng(21);
  return TOWERS.map(() => Array.from({ length: FLOORS }, () => rand() < 0.72));
})();

/* ────────────────────────── scene ────────────────────────── */

type Props = {
  active: boolean;
  replayKey: number;
  night: boolean;
  selectedFloor: number | null;
  onProgress: (floor: number) => void;
  hotspotsRef: RefObject<(HTMLElement | null)[]>;
};

type Clock = { t: number; floors: number };

export default function TowersScene({ active, replayKey, night, selectedFloor, onProgress, hotspotsRef }: Props) {
  const touch = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);
  const clockRef = useRef<Clock>({ t: 0, floors: 0 });
  const nightRef = useRef(0);
  const [built, setBuilt] = useState(false);
  const [lastReplay, setLastReplay] = useState(replayKey);
  if (replayKey !== lastReplay) {
    setLastReplay(replayKey);
    setBuilt(false);
  }

  return (
    <Canvas
      shadows="soft"
      frameloop={active ? "always" : "never"}
      dpr={touch ? [1, 1.5] : [1, 2]}
      camera={{ position: [38, 30, 44], fov: 26, near: 1, far: 300 }}
      gl={{ antialias: false }}
    >
      <Timeline
        clockRef={clockRef}
        nightRef={nightRef}
        night={night}
        replayKey={replayKey}
        built={built}
        onProgress={onProgress}
        onBuilt={() => setBuilt(true)}
      />
      <Backdrop nightRef={nightRef} />
      <Lights nightRef={nightRef} />

      <Spin enabled={touch && built}>
        <Tiles clockRef={clockRef} />
        <Trees clockRef={clockRef} />
        <Lamps clockRef={clockRef} nightRef={nightRef} />
        <Mlcp clockRef={clockRef} />
        {TOWERS.map((t, i) => (
          <Tower key={i} index={i} clockRef={clockRef} nightRef={nightRef} />
        ))}
        <Crane clockRef={clockRef} />
        <FloorHighlight floor={selectedFloor} />
      </Spin>
      <ContactShadows position={[0, -TILE_H - 0.02, 0]} scale={70} blur={2.8} far={12} opacity={0.45} color="#1d2b3f" />

      <CameraDirector clockRef={clockRef} built={built} touch={touch} />
      <HotspotProjector hotspotsRef={hotspotsRef} visible={built} />

      <EffectComposer multisampling={touch ? 0 : 4}>
        {touch ? <></> : <N8AO aoRadius={1.6} intensity={2.2} distanceFalloff={1} halfRes quality="medium" />}
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} luminanceSmoothing={0.15} />
      </EffectComposer>
    </Canvas>
  );
}

/* ────────────────────────── timeline ────────────────────────── */

type ClockRef = RefObject<Clock>;
type LevelRef = RefObject<number>;

const floorsAt = (t: number, tower: number) => clamp01((t - START - TOWERS[tower].delay) / (PER_FLOOR * FLOORS)) * FLOORS;

function Timeline({
  clockRef,
  nightRef,
  night,
  replayKey,
  built,
  onProgress,
  onBuilt,
}: {
  clockRef: ClockRef;
  nightRef: LevelRef;
  night: boolean;
  replayKey: number;
  built: boolean;
  onProgress: (f: number) => void;
  onBuilt: () => void;
}) {
  const seen = useRef(replayKey);
  useFrame((_, dt) => {
    const c = clockRef.current;
    if (seen.current !== replayKey) {
      seen.current = replayKey;
      c.t = 0;
      c.floors = 0;
    }
    c.t += Math.min(dt, 0.1);
    const floors = Math.floor(floorsAt(c.t, 0));
    if (floors !== c.floors) {
      c.floors = floors;
      onProgress(floors);
    }
    if (!built && floorsAt(c.t - FLOOR_ANIM - 1, 1) >= FLOORS) onBuilt();
    nightRef.current = THREE.MathUtils.damp(nightRef.current, night ? 1 : 0, 1.6, dt);
  });
  return null;
}

/* ────────────────────────── environment ────────────────────────── */

function Backdrop({ nightRef }: { nightRef: LevelRef }) {
  const colorRef = useRef<THREE.Color>(null);
  const day = useMemo(() => new THREE.Color("#e4e9f0"), []);
  const dark = useMemo(() => new THREE.Color("#16213a"), []);
  useFrame(() => colorRef.current?.lerpColors(day, dark, nightRef.current));
  return <color ref={colorRef} attach="background" args={["#e4e9f0"]} />;
}

function Lights({ nightRef }: { nightRef: LevelRef }) {
  const hemi = useRef<THREE.HemisphereLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const warm = useMemo(() => new THREE.Color("#fff3e2"), []);
  const moon = useMemo(() => new THREE.Color("#8fa9e8"), []);
  useFrame(() => {
    const n = nightRef.current;
    if (hemi.current) hemi.current.intensity = 1.25 - n * 0.85;
    if (key.current) {
      key.current.intensity = 2.3 - n * 1.6;
      key.current.color.lerpColors(warm, moon, n);
    }
  });
  return (
    <>
      <hemisphereLight ref={hemi} args={["#ffffff", "#b7c3d6", 1.25]} />
      <directionalLight
        ref={key}
        position={[14, 26, 10]}
        intensity={2.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-camera-far={80}
      />
      <directionalLight position={[-16, 10, -12]} intensity={0.45} color="#c9d8ff" />
    </>
  );
}

/* ────────────────────────── ground ────────────────────────── */

function useGrassTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 16;
    const ctx = canvas.getContext("2d")!;
    const rand = rng(4);
    const greens = ["#8fd16a", "#86c962", "#9ad874", "#7fc05c"];
    for (let y = 0; y < 16; y += 2) for (let x = 0; x < 16; x += 2) {
      ctx.fillStyle = greens[Math.floor(rand() * greens.length)];
      ctx.fillRect(x, y, 2, 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }, []);
}

function Tiles({ clockRef }: { clockRef: ClockRef }) {
  const grass = useGrassTexture();
  const geometry = useMemo(() => new THREE.BoxGeometry(TILE - 0.06, TILE_H, TILE - 0.06), []);
  const dirt = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7a5236", roughness: 0.9 }), []);
  const materials = useMemo(
    () => ({
      grass: [dirt, dirt, new THREE.MeshStandardMaterial({ map: grass, roughness: 0.95 }), dirt, dirt, dirt],
      stone: [dirt, dirt, new THREE.MeshStandardMaterial({ color: "#e9e2d4", roughness: 0.8 }), dirt, dirt, dirt],
      water: [dirt, dirt, new THREE.MeshStandardMaterial({ color: "#62c3e8", roughness: 0.15, metalness: 0.1 }), dirt, dirt, dirt],
    }),
    [dirt, grass],
  );

  return (
    <>
      {(["grass", "stone", "water"] as TileKind[]).map((kind) => (
        <TileGroup key={kind} tiles={TILES.filter((t) => t.kind === kind)} geometry={geometry} material={materials[kind]} clockRef={clockRef} sink={kind === "water" ? 0.18 : 0} />
      ))}
    </>
  );
}

function TileGroup({
  tiles,
  geometry,
  material,
  clockRef,
  sink,
}: {
  tiles: Tile[];
  geometry: THREE.BufferGeometry;
  material: THREE.Material[];
  clockRef: ClockRef;
  sink: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    const mesh = meshRef.current;
    const t = clockRef.current.t;
    if (!mesh || t > 3.5) return;
    tiles.forEach((tile, i) => {
      const p = clamp01((t - tile.delay) / 0.6);
      const e = p === 0 ? 0 : easeOutBack(p);
      tmp.position.set(tile.x, -TILE_H / 2 - sink + (1 - e) * -2.5, tile.z);
      tmp.scale.setScalar(Math.max(0.001, p === 0 ? 0.001 : 0.5 + e * 0.5));
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={meshRef} args={[geometry, material, tiles.length]} castShadow receiveShadow frustumCulled={false} />;
}

function Trees({ clockRef }: { clockRef: ClockRef }) {
  const trunks = useRef<THREE.InstancedMesh>(null);
  const lower = useRef<THREE.InstancedMesh>(null);
  const upper = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const t = clockRef.current.t;
    if (t > 4) return;
    TREES.forEach((tree, i) => {
      const p = clamp01((t - tree.delay) / 0.5);
      const s = p === 0 ? 0.001 : easeOutBack(p) * tree.s;
      const parts: [RefObject<THREE.InstancedMesh | null>, number][] = [
        [trunks, 0.3],
        [lower, 0.95],
        [upper, 1.55],
      ];
      for (const [ref, y] of parts) {
        tmp.position.set(tree.x, y * s, tree.z);
        tmp.scale.setScalar(Math.max(0.001, s));
        tmp.updateMatrix();
        ref.current?.setMatrixAt(i, tmp.matrix);
      }
    });
    for (const ref of [trunks, lower, upper]) if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={trunks} args={[undefined, undefined, TREES.length]} castShadow frustumCulled={false}>
        <cylinderGeometry args={[0.08, 0.11, 0.6, 6]} />
        <meshStandardMaterial color="#7a5236" />
      </instancedMesh>
      <instancedMesh ref={lower} args={[undefined, undefined, TREES.length]} castShadow frustumCulled={false}>
        <coneGeometry args={[0.55, 1, 7]} />
        <meshStandardMaterial color="#5fb35a" roughness={0.85} flatShading />
      </instancedMesh>
      <instancedMesh ref={upper} args={[undefined, undefined, TREES.length]} castShadow frustumCulled={false}>
        <coneGeometry args={[0.4, 0.8, 7]} />
        <meshStandardMaterial color="#79c76a" roughness={0.85} flatShading />
      </instancedMesh>
    </>
  );
}

function Lamps({ clockRef, nightRef }: { clockRef: ClockRef; nightRef: LevelRef }) {
  const group = useRef<THREE.Group>(null);
  const bulb = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const p = clamp01((clockRef.current.t - 1.4) / 0.5);
    group.current?.scale.set(1, Math.max(0.001, p), 1);
    if (group.current) group.current.visible = p > 0;
    const n = nightRef.current;
    bulb.current?.color.setRGB(1 + n * 3, 0.9 + n * 2.2, 0.7 + n * 1.2);
  });
  return (
    <group ref={group}>
      {LAMPS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position-y={0.35} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.7, 6]} />
            <meshStandardMaterial color="#3a4352" />
          </mesh>
          <mesh position-y={0.74}>
            <sphereGeometry args={[0.1, 10, 8]} />
            <meshBasicMaterial ref={i === 0 ? bulb : undefined} color="#fff1cc" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Mlcp({ clockRef }: { clockRef: ClockRef }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    const p = clamp01((clockRef.current.t - 1.2) / 0.7);
    const e = p === 0 ? 0.001 : easeOutBack(p);
    group.current?.scale.set(1, Math.max(0.001, e), 1);
    if (group.current) group.current.visible = p > 0;
  });
  return (
    <group ref={group} position={[MLCP.x, 0, MLCP.z]}>
      <RoundedBox args={[3.6, 3, 3.4]} radius={0.12} position-y={1.5} castShadow receiveShadow>
        <meshStandardMaterial color="#5d6b80" roughness={0.7} />
      </RoundedBox>
      {[0.45, 1.2, 1.95, 2.7].map((y) => (
        <RoundedBox key={y} args={[3.8, 0.16, 3.6]} radius={0.05} position-y={y} castShadow receiveShadow>
          <meshStandardMaterial color="#f1ece2" roughness={0.6} />
        </RoundedBox>
      ))}
      <RoundedBox args={[3.6, 0.2, 3.4]} radius={0.06} position-y={3.05} castShadow>
        <meshStandardMaterial color="#79c76a" roughness={0.9} />
      </RoundedBox>
    </group>
  );
}

/* ────────────────────────── towers ────────────────────────── */

function Tower({ index, clockRef, nightRef }: { index: number; clockRef: ClockRef; nightRef: LevelRef }) {
  const tower = TOWERS[index];
  const slabs = useRef<THREE.InstancedMesh>(null);
  const glass = useRef<THREE.InstancedMesh>(null);
  const glow = useRef<THREE.InstancedMesh>(null);
  const balconies = useRef<THREE.InstancedMesh>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const piers = useRef<THREE.Group>(null);
  const crown = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.MeshBasicMaterial>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const done = useRef(false);

  const slabGeometry = useMemo(() => new RoundedBoxGeometry(W + 0.3, 0.1, D + 0.3, 2, 0.04), []);

  useFrame(({ clock }) => {
    const t = clockRef.current.t;
    const n = nightRef.current;
    glowMat.current?.color.setRGB(n * 2.6, n * 1.9, n * 1.1);
    beacon.current?.color.setRGB(Math.sin(clock.elapsedTime * 3) > 0.2 ? 3 : 0.4, 0.15, 0.1);

    const live = floorsAt(t, index);
    const animating = live < FLOORS || t < START + tower.delay + PER_FLOOR * FLOORS + FLOOR_ANIM + 0.2;
    if (!animating && done.current) return;
    done.current = !animating;

    for (let f = 0; f < FLOORS; f++) {
      const p = clamp01((t - START - tower.delay - f * PER_FLOOR) / FLOOR_ANIM);
      const e = p === 0 ? 0 : easeOutBack(p);
      const y = f * FLOOR_H + (1 - e) * 1.6;
      const s = p === 0 ? 0.001 : 1;
      const set = (mesh: THREE.InstancedMesh | null, dy: number, dz = 0) => {
        if (!mesh) return;
        tmp.position.set(tower.x, y + dy, tower.z + dz);
        tmp.scale.setScalar(s);
        tmp.updateMatrix();
        mesh.setMatrixAt(f, tmp.matrix);
      };
      set(slabs.current, 0.05);
      set(glass.current, FLOOR_H / 2 + 0.05);
      set(glow.current, FLOOR_H / 2 + 0.05);
      set(balconies.current, 0.13, f % 2 ? D / 2 + 0.25 : -D / 2 - 0.25);
    }
    for (const m of [slabs, glass, glow, balconies]) if (m.current) m.current.instanceMatrix.needsUpdate = true;

    const built = Math.min(FLOORS, live);
    piers.current?.scale.set(1, Math.max(0.001, built / FLOORS), 1);
    const cp = clamp01((t - START - tower.delay - FLOORS * PER_FLOOR - 0.1) / 0.6);
    const ce = cp === 0 ? 0.001 : easeOutBack(cp);
    crown.current?.scale.set(1, Math.max(0.001, ce), 1);
    if (crown.current) crown.current.visible = cp > 0; // a squashed crown would show as a floating plate
  });

  // Night glow: lit floors get warm colour, unlit stay black (additive = invisible).
  const glowColors = useMemo(() => {
    const arr = new Float32Array(FLOORS * 3);
    LIT[index].forEach((lit, f) => {
      const k = lit ? 0.7 + ((f * 37) % 10) / 30 : 0;
      arr.set([k, k, k], f * 3);
    });
    return new THREE.InstancedBufferAttribute(arr, 3);
  }, [index]);

  return (
    <group>
      <instancedMesh ref={slabs} args={[slabGeometry, undefined, FLOORS]} castShadow receiveShadow frustumCulled={false}>
        <meshStandardMaterial color="#f7f3eb" roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={glass} args={[undefined, undefined, FLOORS]} castShadow receiveShadow frustumCulled={false}>
        <boxGeometry args={[W - 0.12, FLOOR_H - 0.1, D - 0.12]} />
        <meshStandardMaterial color="#9ec4e4" roughness={0.18} metalness={0.15} />
      </instancedMesh>
      <instancedMesh ref={glow} args={[undefined, undefined, FLOORS]} frustumCulled={false} instanceColor={glowColors}>
        <boxGeometry args={[W - 0.08, FLOOR_H - 0.12, D - 0.08]} />
        <meshBasicMaterial ref={glowMat} color="black" blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} transparent />
      </instancedMesh>
      <instancedMesh ref={balconies} args={[undefined, undefined, FLOORS]} castShadow frustumCulled={false}>
        <boxGeometry args={[W * 0.56, 0.07, 0.5]} />
        <meshStandardMaterial color="#d2a273" roughness={0.7} />
      </instancedMesh>

      {/* Corner piers grow with the floors */}
      <group ref={piers} position={[tower.x, 0, tower.z]} scale-y={0.001}>
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sz) => (
            <mesh key={`${sx}${sz}`} position={[(sx * W) / 2, HEIGHT / 2, (sz * D) / 2]} castShadow>
              <boxGeometry args={[0.24, HEIGHT, 0.24]} />
              <meshStandardMaterial color="#f7f3eb" roughness={0.6} />
            </mesh>
          )),
        )}
        <mesh position={[0, HEIGHT / 2, D / 2 + 0.02]}>
          <boxGeometry args={[0.08, HEIGHT, 0.08]} />
          <meshStandardMaterial color="#c49a52" metalness={0.6} roughness={0.35} emissive="#c49a52" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Stepped crown with roof garden and aviation beacon */}
      <group ref={crown} position={[tower.x, HEIGHT + 0.1, tower.z]} scale-y={0.001}>
        <RoundedBox args={[W * 0.9, 0.9, D * 0.9]} radius={0.1} position-y={0.45} castShadow>
          <meshStandardMaterial color="#f7f3eb" roughness={0.55} />
        </RoundedBox>
        <RoundedBox args={[W * 0.7, 0.18, D * 0.7]} radius={0.05} position-y={0.99} castShadow>
          <meshStandardMaterial color="#c49a52" metalness={0.5} roughness={0.35} />
        </RoundedBox>
        <RoundedBox args={[W * 0.52, 0.7, D * 0.52]} radius={0.08} position-y={1.43} castShadow>
          <meshStandardMaterial color="#f7f3eb" roughness={0.55} />
        </RoundedBox>
        <mesh position-y={2.15} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.8, 6]} />
          <meshStandardMaterial color="#c49a52" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position-y={2.6}>
          <sphereGeometry args={[0.1, 10, 8]} />
          <meshBasicMaterial ref={beacon} color="#ff3b30" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Crane({ clockRef }: { clockRef: ClockRef }) {
  const group = useRef<THREE.Group>(null);
  const mast = useRef<THREE.Group>(null);
  const top = useRef<THREE.Group>(null);
  const t0 = TOWERS[0];

  useFrame(() => {
    const t = clockRef.current.t;
    const floors = floorsAt(t, 0);
    const h = floors * FLOOR_H + 2.4;
    mast.current?.scale.set(1, h, 1);
    top.current?.position.set(0, h, 0);
    top.current?.rotation.set(0, Math.sin(t * 0.7) * 0.8 + 0.4, 0);
    const appear = clamp01((t - 1.3) / 0.5);
    const leave = clamp01((t - START - FLOORS * PER_FLOOR - 0.8) / 0.7);
    const s = (appear === 0 ? 0 : easeOutBack(appear)) * (1 - leave);
    group.current?.scale.setScalar(Math.max(0.001, s));
  });

  return (
    <group ref={group} position={[t0.x - W / 2 - 1.1, 0, t0.z + D / 2 + 0.6]}>
      <group ref={mast}>
        <mesh position-y={0.5} castShadow>
          <boxGeometry args={[0.36, 1, 0.36]} />
          <meshStandardMaterial color="#f2b632" wireframe />
        </mesh>
      </group>
      <group ref={top}>
        <mesh position={[2.6, 0.15, 0]} castShadow>
          <boxGeometry args={[7, 0.22, 0.26]} />
          <meshStandardMaterial color="#f2b632" roughness={0.5} />
        </mesh>
        <mesh position={[-1.4, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 0.5, 0.55]} />
          <meshStandardMaterial color="#5d6b80" />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.45, 0.5, 0.45]} />
          <meshStandardMaterial color="#f2b632" />
        </mesh>
        <mesh position={[4.8, -0.9, 0]}>
          <boxGeometry args={[0.025, 2, 0.025]} />
          <meshStandardMaterial color="#2b3340" />
        </mesh>
        <RoundedBox args={[0.9, 0.3, 0.6]} radius={0.05} position={[4.8, -2, 0]} castShadow>
          <meshStandardMaterial color="#c49a52" />
        </RoundedBox>
      </group>
    </group>
  );
}

function FloorHighlight({ floor }: { floor: number | null }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const y = (floor ?? 1) * FLOOR_H - FLOOR_H / 2 + 0.05;
    g.position.set(0, THREE.MathUtils.damp(g.position.y, y, 6, dt), 0);
    g.visible = floor !== null;
  });
  return (
    <group ref={group} visible={false}>
      {TOWERS.map((t, i) => (
        <mesh key={i} position={[t.x, 0, t.z]}>
          <boxGeometry args={[W + 0.7, FLOOR_H * 1.1, D + 0.7]} />
          <meshBasicMaterial color={[2, 1.45, 0.7]} transparent opacity={0.35} toneMapped={false} depthWrite={false} />
          <Edges color="#c49a52" threshold={15} />
        </mesh>
      ))}
    </group>
  );
}

/* ────────────────────────── camera & UI hooks ────────────────────────── */

const SPIN_NAME = "towers-spin";

function Spin({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (enabled) group.current?.rotateY(dt * 0.12);
  });
  return (
    <group ref={group} name={SPIN_NAME}>
      {children}
    </group>
  );
}

// During the build the camera slowly circles and rises with the towers;
// afterwards OrbitControls (desktop) or a gentle auto-spin (touch) take over.
function CameraDirector({ clockRef, built, touch }: { clockRef: ClockRef; built: boolean; touch: boolean }) {
  const camera = useThree((s) => s.camera);
  const look = useRef(new THREE.Vector3(0, 1, 0));
  const radius = touch ? 66 : 54;

  useFrame((_, dt) => {
    if (built && !touch) return;
    const t = clockRef.current.t;
    const progress = floorsAt(t, 0) / FLOORS;
    const angle = built ? 0.72 : 0.55 + t * 0.03;
    const y = 18 + progress * 14;
    const target = new THREE.Vector3(Math.sin(angle) * radius, y, Math.cos(angle) * radius);
    camera.position.lerp(target, 1 - Math.exp(-dt * 1.5));
    look.current.lerp(new THREE.Vector3(0, 1 + progress * (TARGET_Y - 1), 0), 1 - Math.exp(-dt * 1.5));
    camera.lookAt(look.current);
  });

  if (!built || touch) return null;
  return (
    <OrbitControls
      target={[0, TARGET_Y, 0]}
      enableZoom={false}
      enablePan={false}
      enableDamping
      autoRotate
      autoRotateSpeed={0.45}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.15}
    />
  );
}

// Moves the DOM hotspot buttons so they sit over their 3D positions.
function HotspotProjector({ hotspotsRef, visible }: { hotspotsRef: RefObject<(HTMLElement | null)[]>; visible: boolean }) {
  const { camera, size, scene } = useThree();
  const points = useMemo(() => HOTSPOT_INFO.map((h) => new THREE.Vector3(...HOTSPOT_POS[h.id])), []);
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const spin = scene.getObjectByName(SPIN_NAME);
    points.forEach((p, i) => {
      const el = hotspotsRef.current[i];
      if (!el) return;
      const projected = v.copy(p);
      if (spin) projected.applyMatrix4(spin.matrixWorld);
      projected.project(camera);
      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      el.style.opacity = visible && projected.z < 1 ? "1" : "0";
      el.style.pointerEvents = visible ? "auto" : "none";
    });
  });
  return null;
}
