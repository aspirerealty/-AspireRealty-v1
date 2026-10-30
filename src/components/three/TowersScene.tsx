"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Edges, Environment, Lightformer, OrbitControls, RoundedBox } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { FLOORS, HOTSPOT_INFO, type HotspotId } from "./towers-data";

// The twin G+47 towers, built up on screen: the site's tiles rise one by one,
// trees grow, then both towers stack floor by floor beside a tower crane.
// The architecture follows the launch posters — reflective glass, wrap-around
// balconies with warm wood soffits, glass railings and slim fins — lit by a
// dusk sky that can switch to night, when the homes glow.

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
  crown: [TOWERS[0].x, HEIGHT + 2.6, TOWERS[0].z],
  breakout: [-1.5, 0.6, 5.5],
  mlcp: [MLCP.x, 3.6, MLCP.z],
  open: [8.5, 0.6, 3.5],
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

type TileKind = "lawn" | "stone" | "water";
type Tile = { x: number; z: number; delay: number; kind: TileKind };

const inside = (x: number, z: number, cx: number, cz: number, hw: number, hd: number) => Math.abs(x - cx) <= hw && Math.abs(z - cz) <= hd;

const TILES: Tile[] = (() => {
  const list: Tile[] = [];
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      const x = -((COLS - 1) * TILE) / 2 + i * TILE;
      const z = -((ROWS - 1) * TILE) / 2 + j * TILE;
      let kind: TileKind = "lawn";
      if (TOWERS.some((t) => inside(x, z, t.x, t.z, W / 2 + 0.6, D / 2 + 0.6))) kind = "stone";
      if (inside(x, z, MLCP.x, MLCP.z, 2, 2)) kind = "stone";
      if (i === 5 || (j === 4 && i > 5)) kind = "stone";
      if ((x === 2 || x === 4) && z === 5) kind = "water";
      list.push({ x, z, kind, delay: 0.1 + (Math.hypot(x, z) / 14) * 0.9 });
    }
  }
  return list;
})();

const TREES: { x: number; z: number; s: number; delay: number; tone: number }[] = (() => {
  const rand = rng(9);
  const list: { x: number; z: number; s: number; delay: number; tone: number }[] = [];
  for (const t of TILES) {
    if (t.kind !== "lawn") continue;
    const n = rand() < 0.55 ? (rand() < 0.4 ? 2 : 1) : 0;
    for (let k = 0; k < n; k++) {
      list.push({ x: t.x + (rand() - 0.5) * 1.3, z: t.z + (rand() - 0.5) * 1.3, s: 0.7 + rand() * 0.5, delay: 1.1 + rand() * 0.8, tone: rand() });
    }
  }
  return list;
})();

const LAMPS: [number, number][] = [-6, -2, 2, 6].flatMap((z) => [
  [-1, z],
  [1, z],
]);

// Which homes have their lights on (seeded so it looks the same every time).
const LIT = (() => {
  const rand = rng(21);
  return TOWERS.map(() => Array.from({ length: FLOORS }, () => rand()));
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
      camera={{ position: [38, 30, 44], fov: 26, near: 1, far: 400 }}
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
      <Sky nightRef={nightRef} />
      <Lights nightRef={nightRef} />
      {/* Studio light shapes that the glass reflects */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#ffc596" position={[0, 6, -40]} scale={[80, 14, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#a9c6ff" position={[40, 26, 10]} rotation-y={-Math.PI / 2} scale={[50, 16, 1]} />
        <Lightformer form="rect" intensity={1} color="#ffffff" position={[-40, 30, 20]} rotation-y={Math.PI / 2} scale={[40, 12, 1]} />
        <Lightformer form="circle" intensity={2} color="#ffffff" position={[0, 60, 0]} rotation-x={Math.PI / 2} scale={18} />
      </Environment>

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
      <ContactShadows position={[0, -TILE_H - 0.02, 0]} scale={70} blur={2.8} far={12} opacity={0.4} color="#1d2b3f" />

      <CameraDirector clockRef={clockRef} built={built} touch={touch} />
      <HotspotProjector hotspotsRef={hotspotsRef} visible={built} />

      <EffectComposer multisampling={touch ? 0 : 4}>
        {touch ? <></> : <N8AO aoRadius={1.4} intensity={1.8} distanceFalloff={1} halfRes quality="medium" />}
        <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.92} luminanceSmoothing={0.2} />
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

// Gradient dome: a warm dusk like the launch posters, deepening to night.
function Sky({ nightRef }: { nightRef: LevelRef }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uNight: { value: 0 } }), []);
  useFrame(() => {
    const m = matRef.current;
    if (m) m.uniforms.uNight.value = nightRef.current;
  });
  return (
    <mesh renderOrder={-1} scale={300}>
      <sphereGeometry args={[1, 32, 16]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`}
        fragmentShader={`
          uniform float uNight;
          varying vec3 vDir;
          void main() {
            float h = clamp(vDir.y, -1.0, 1.0);
            vec3 duskTop = vec3(0.20, 0.33, 0.55);
            vec3 duskMid = vec3(0.86, 0.66, 0.60);
            vec3 duskLow = vec3(1.00, 0.80, 0.60);
            vec3 nightTop = vec3(0.01, 0.02, 0.06);
            vec3 nightMid = vec3(0.03, 0.06, 0.14);
            vec3 nightLow = vec3(0.06, 0.09, 0.18);
            vec3 top = mix(duskTop, nightTop, uNight);
            vec3 mid = mix(duskMid, nightMid, uNight);
            vec3 low = mix(duskLow, nightLow, uNight);
            vec3 col = h > 0.15 ? mix(mid, top, smoothstep(0.15, 0.7, h)) : mix(low, mid, smoothstep(-0.25, 0.15, h));
            gl_FragColor = vec4(col, 1.0);
          }`}
      />
    </mesh>
  );
}

function Lights({ nightRef }: { nightRef: LevelRef }) {
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const sunset = useMemo(() => new THREE.Color("#ffd2a8"), []);
  const moon = useMemo(() => new THREE.Color("#8fa9e8"), []);
  useFrame(() => {
    const n = nightRef.current;
    if (hemi.current) hemi.current.intensity = 1.05 - n * 0.75;
    if (sun.current) {
      sun.current.intensity = 2.6 - n * 2.05;
      sun.current.color.lerpColors(sunset, moon, n);
    }
  });
  return (
    <>
      <hemisphereLight ref={hemi} args={["#fff1e2", "#8a9bb4", 1.05]} />
      <directionalLight
        ref={sun}
        position={[-18, 22, 14]}
        intensity={2.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-camera-far={90}
      />
      <directionalLight position={[18, 8, -14]} intensity={0.5} color="#c9d8ff" />
    </>
  );
}

/* ────────────────────────── ground ────────────────────────── */

// Soft procedural textures for lawn and stone paving.
function useSiteTextures() {
  return useMemo(() => {
    const make = (draw: (ctx: CanvasRenderingContext2D) => void) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 128;
      draw(canvas.getContext("2d")!);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      return tex;
    };
    const lawn = make((ctx) => {
      ctx.fillStyle = "#6ea85a";
      ctx.fillRect(0, 0, 128, 128);
      const rand = rng(4);
      for (let i = 0; i < 900; i++) {
        ctx.fillStyle = rand() > 0.5 ? "rgba(140,190,100,0.35)" : "rgba(70,120,60,0.3)";
        ctx.fillRect(rand() * 128, rand() * 128, 2, 2);
      }
      // mowing stripes
      for (let x = 0; x < 128; x += 32) {
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(x, 0, 16, 128);
      }
    });
    const stone = make((ctx) => {
      ctx.fillStyle = "#e7e0d3";
      ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = "rgba(120,110,95,0.35)";
      ctx.lineWidth = 1.5;
      for (let y = 0; y <= 128; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(128, y);
        ctx.stroke();
        for (let x = (y / 32) % 2 ? 0 : 32; x <= 128; x += 64) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 32);
          ctx.stroke();
        }
      }
    });
    return { lawn, stone };
  }, []);
}

function Tiles({ clockRef }: { clockRef: ClockRef }) {
  const { lawn, stone } = useSiteTextures();
  const geometry = useMemo(() => new THREE.BoxGeometry(TILE - 0.03, TILE_H, TILE - 0.03), []);
  const earth = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5d4632", roughness: 0.95 }), []);
  const materials = useMemo(
    () => ({
      lawn: [earth, earth, new THREE.MeshStandardMaterial({ map: lawn, roughness: 0.95 }), earth, earth, earth],
      stone: [earth, earth, new THREE.MeshStandardMaterial({ map: stone, roughness: 0.7 }), earth, earth, earth],
      water: [earth, earth, new THREE.MeshStandardMaterial({ color: "#3d9fc9", roughness: 0.05, metalness: 0.4, envMapIntensity: 1.6 }), earth, earth, earth],
    }),
    [earth, lawn, stone],
  );

  return (
    <>
      {(["lawn", "stone", "water"] as TileKind[]).map((kind) => (
        <TileGroup key={kind} tiles={TILES.filter((t) => t.kind === kind)} geometry={geometry} material={materials[kind]} clockRef={clockRef} sink={kind === "water" ? 0.14 : 0} />
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
      tmp.scale.setScalar(p === 0 ? 0.001 : 0.5 + e * 0.5);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={meshRef} args={[geometry, material, tiles.length]} castShadow receiveShadow frustumCulled={false} />;
}

// Rounded canopy trees in a few natural greens.
function Trees({ clockRef }: { clockRef: ClockRef }) {
  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => {
    const palette = ["#4f8a45", "#5f9a4f", "#6fa95a", "#467d3e"].map((c) => new THREE.Color(c));
    const arr = new Float32Array(TREES.length * 3);
    TREES.forEach((tree, i) => palette[Math.floor(tree.tone * palette.length)].toArray(arr, i * 3));
    return new THREE.InstancedBufferAttribute(arr, 3);
  }, []);

  useFrame(() => {
    const t = clockRef.current.t;
    if (t > 4) return;
    TREES.forEach((tree, i) => {
      const p = clamp01((t - tree.delay) / 0.5);
      const s = Math.max(0.001, p === 0 ? 0 : easeOutBack(p) * tree.s);
      tmp.position.set(tree.x, 0.35 * s, tree.z);
      tmp.scale.setScalar(s);
      tmp.updateMatrix();
      trunks.current?.setMatrixAt(i, tmp.matrix);
      tmp.position.set(tree.x, 1.05 * s, tree.z);
      tmp.scale.set(s, s * 1.1, s);
      tmp.updateMatrix();
      crowns.current?.setMatrixAt(i, tmp.matrix);
    });
    for (const ref of [trunks, crowns]) if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={trunks} args={[undefined, undefined, TREES.length]} castShadow frustumCulled={false}>
        <cylinderGeometry args={[0.06, 0.09, 0.7, 6]} />
        <meshStandardMaterial color="#5b4332" />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, TREES.length]} castShadow frustumCulled={false} instanceColor={colors}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial roughness={0.9} />
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
            <cylinderGeometry args={[0.03, 0.04, 0.7, 6]} />
            <meshStandardMaterial color="#2f3640" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position-y={0.74}>
            <sphereGeometry args={[0.08, 10, 8]} />
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
      <RoundedBox args={[3.6, 3, 3.4]} radius={0.06} position-y={1.5} castShadow receiveShadow>
        <meshStandardMaterial color="#47515f" roughness={0.6} />
      </RoundedBox>
      {[0.45, 1.2, 1.95, 2.7].map((y) => (
        <RoundedBox key={y} args={[3.75, 0.14, 3.55]} radius={0.04} position-y={y} castShadow receiveShadow>
          <meshStandardMaterial color="#efeae0" roughness={0.6} />
        </RoundedBox>
      ))}
      {/* Vertical timber screen fins */}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-1.6 + i * 0.4, 1.5, 1.76]} castShadow>
          <boxGeometry args={[0.07, 2.9, 0.07]} />
          <meshStandardMaterial color="#a8774c" roughness={0.6} />
        </mesh>
      ))}
      <mesh position-y={3.08}>
        <boxGeometry args={[3.5, 0.12, 3.3]} />
        <meshStandardMaterial color="#6ea85a" roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ────────────────────────── towers ────────────────────────── */

function Tower({ index, clockRef, nightRef }: { index: number; clockRef: ClockRef; nightRef: LevelRef }) {
  const tower = TOWERS[index];
  const slabs = useRef<THREE.InstancedMesh>(null);
  const soffits = useRef<THREE.InstancedMesh>(null);
  const glass = useRef<THREE.InstancedMesh>(null);
  const rooms = useRef<THREE.InstancedMesh>(null);
  const rails = useRef<THREE.InstancedMesh>(null);
  const roomMat = useRef<THREE.MeshBasicMaterial>(null);
  const glassMat = useRef<THREE.MeshStandardMaterial>(null);
  const soffitMat = useRef<THREE.MeshStandardMaterial>(null);
  const frame = useRef<THREE.Group>(null);
  const crown = useRef<THREE.Group>(null);
  const lantern = useRef<THREE.MeshBasicMaterial>(null);
  const beacon = useRef<THREE.MeshBasicMaterial>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const settled = useRef(false);

  const slabGeometry = useMemo(() => new RoundedBoxGeometry(W + 0.22, 0.045, D + 0.22, 2, 0.015), []);

  // Interior brightness per floor: most homes lit, some dark.
  const roomColors = useMemo(() => {
    const arr = new Float32Array(FLOORS * 3);
    LIT[index].forEach((r, f) => {
      const k = r < 0.7 ? 0.65 + r * 0.5 : 0.08;
      arr.set([k, k * 0.92, k * 0.8], f * 3);
    });
    return new THREE.InstancedBufferAttribute(arr, 3);
  }, [index]);

  useFrame(({ clock }) => {
    const t = clockRef.current.t;
    const n = nightRef.current;
    // Warm interiors and soffits brighten as night falls.
    // By day the rooms read dark behind reflective glass; at night they glow.
    roomMat.current?.color.setRGB(0.06 + n * 2.6, 0.07 + n * 1.9, 0.09 + n * 1.05);
    if (glassMat.current) glassMat.current.opacity = 0.88 - n * 0.4;
    soffitMat.current?.emissive.setRGB(0.25 + n * 0.75, 0.13 + n * 0.4, 0.04 + n * 0.12);
    lantern.current?.color.setRGB(1.2 + n * 2.2, 0.95 + n * 1.6, 0.65 + n * 0.8);
    beacon.current?.color.setRGB(Math.sin(clock.elapsedTime * 3) > 0.2 ? 3 : 0.4, 0.15, 0.1);

    const live = floorsAt(t, index);
    const animating = live < FLOORS || t < START + tower.delay + PER_FLOOR * FLOORS + FLOOR_ANIM + 0.2;
    if (!animating && settled.current) return;
    settled.current = !animating;

    for (let f = 0; f < FLOORS; f++) {
      const p = clamp01((t - START - tower.delay - f * PER_FLOOR) / FLOOR_ANIM);
      const e = p === 0 ? 0 : easeOutBack(p);
      const y = f * FLOOR_H + (1 - e) * 1.6;
      const s = p === 0 ? 0.001 : 1;
      const place = (mesh: THREE.InstancedMesh | null, dy: number) => {
        if (!mesh) return;
        tmp.position.set(tower.x, y + dy, tower.z);
        tmp.scale.setScalar(s);
        tmp.updateMatrix();
        mesh.setMatrixAt(f, tmp.matrix);
      };
      place(slabs.current, FLOOR_H);
      place(soffits.current, FLOOR_H - 0.05);
      place(glass.current, FLOOR_H / 2);
      place(rooms.current, FLOOR_H / 2);
      place(rails.current, 0.09);
    }
    for (const m of [slabs, soffits, glass, rooms, rails]) if (m.current) m.current.instanceMatrix.needsUpdate = true;

    frame.current?.scale.set(1, Math.max(0.001, Math.min(FLOORS, live) / FLOORS), 1);
    const cp = clamp01((t - START - tower.delay - FLOORS * PER_FLOOR - 0.1) / 0.6);
    crown.current?.scale.set(1, Math.max(0.001, cp === 0 ? 0 : easeOutBack(cp)), 1);
    if (crown.current) crown.current.visible = cp > 0; // a squashed crown would show as a floating plate
  });

  return (
    <group>
      {/* Concrete balcony slabs wrapping each floor */}
      <instancedMesh ref={slabs} args={[slabGeometry, undefined, FLOORS]} castShadow receiveShadow frustumCulled={false}>
        <meshStandardMaterial color="#f1ede6" roughness={0.5} />
      </instancedMesh>
      {/* Warm wood soffits under every balcony, as on the posters */}
      <instancedMesh ref={soffits} args={[undefined, undefined, FLOORS]} frustumCulled={false}>
        <boxGeometry args={[W + 0.2, 0.02, D + 0.2]} />
        <meshStandardMaterial ref={soffitMat} color="#b57d4b" roughness={0.6} emissive="#3f2007" />
      </instancedMesh>
      {/* Warm-lit rooms seen through the glass */}
      <instancedMesh ref={rooms} args={[undefined, undefined, FLOORS]} frustumCulled={false} instanceColor={roomColors}>
        <boxGeometry args={[W - 0.24, FLOOR_H - 0.1, D - 0.24]} />
        <meshBasicMaterial ref={roomMat} toneMapped={false} />
      </instancedMesh>
      {/* Reflective glass curtain wall */}
      <instancedMesh ref={glass} args={[undefined, undefined, FLOORS]} castShadow frustumCulled={false}>
        <boxGeometry args={[W - 0.08, FLOOR_H - 0.045, D - 0.08]} />
        <meshStandardMaterial ref={glassMat} color="#2b5480" metalness={0.65} roughness={0.07} envMapIntensity={3} transparent opacity={0.88} depthWrite={false} />
      </instancedMesh>
      {/* Glass balustrade around each balcony */}
      <instancedMesh ref={rails} args={[undefined, undefined, FLOORS]} frustumCulled={false}>
        <boxGeometry args={[W + 0.21, 0.07, D + 0.21]} />
        <meshStandardMaterial color="#d6ecff" metalness={0.2} roughness={0.05} transparent opacity={0.1} depthWrite={false} envMapIntensity={1.5} />
      </instancedMesh>

      {/* Aluminium fins + gold LED strips grow with the floors */}
      <group ref={frame} position={[tower.x, 0, tower.z]} scale-y={0.001}>
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sz) => (
            <mesh key={`c${sx}${sz}`} position={[(sx * W) / 2, HEIGHT / 2, (sz * D) / 2]} castShadow>
              <boxGeometry args={[0.16, HEIGHT, 0.16]} />
              <meshStandardMaterial color="#e9e4da" roughness={0.5} />
            </mesh>
          )),
        )}
        {[-1.5, -1, -0.5, 0.5, 1, 1.5].flatMap((x) =>
          [-1, 1].map((sz) => (
            <mesh key={`f${x}${sz}`} position={[x, HEIGHT / 2, (sz * D) / 2 + sz * 0.06]}>
              <boxGeometry args={[0.03, HEIGHT, 0.08]} />
              <meshStandardMaterial color="#c3ccd6" metalness={0.8} roughness={0.3} />
            </mesh>
          )),
        )}
        {[-1.05, -0.35, 0.35, 1.05].flatMap((z) =>
          [-1, 1].map((sx) => (
            <mesh key={`s${z}${sx}`} position={[(sx * W) / 2 + sx * 0.06, HEIGHT / 2, z]}>
              <boxGeometry args={[0.08, HEIGHT, 0.03]} />
              <meshStandardMaterial color="#c3ccd6" metalness={0.8} roughness={0.3} />
            </mesh>
          )),
        )}
        {[-1, 1].map((sz) => (
          <mesh key={`led${sz}`} position={[0, HEIGHT / 2, (sz * D) / 2 + sz * 0.1]}>
            <boxGeometry args={[0.05, HEIGHT, 0.05]} />
            <meshBasicMaterial color={[2.6, 1.8, 0.9]} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Glass lantern crown with a gold rim and aviation beacon */}
      <group ref={crown} position={[tower.x, HEIGHT + FLOOR_H, tower.z]} scale-y={0.001} visible={false}>
        <RoundedBox args={[W * 0.92, 0.3, D * 0.92]} radius={0.05} position-y={0.15} castShadow>
          <meshStandardMaterial color="#f3efe8" roughness={0.5} />
        </RoundedBox>
        <mesh position-y={0.85}>
          <boxGeometry args={[W * 0.7, 1, D * 0.7]} />
          <meshBasicMaterial ref={lantern} color="#ffd9a0" toneMapped={false} />
        </mesh>
        <mesh position-y={0.85}>
          <boxGeometry args={[W * 0.72, 1.02, D * 0.72]} />
          <meshStandardMaterial color="#2a4561" metalness={0.8} roughness={0.05} envMapIntensity={2} transparent opacity={0.45} depthWrite={false} />
        </mesh>
        <RoundedBox args={[W * 0.8, 0.14, D * 0.8]} radius={0.04} position-y={1.42} castShadow>
          <meshStandardMaterial color="#c49a52" metalness={0.7} roughness={0.3} />
        </RoundedBox>
        <mesh position-y={2} castShadow>
          <cylinderGeometry args={[0.03, 0.045, 1, 6]} />
          <meshStandardMaterial color="#c49a52" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position-y={2.55}>
          <sphereGeometry args={[0.09, 10, 8]} />
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
    if (group.current) group.current.visible = s > 0.01;
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
    const y = (floor ?? 1) * FLOOR_H - FLOOR_H / 2;
    g.position.set(0, THREE.MathUtils.damp(g.position.y, y, 6, dt), 0);
    g.visible = floor !== null;
  });
  return (
    <group ref={group} visible={false}>
      {TOWERS.map((t, i) => (
        <mesh key={i} position={[t.x, 0, t.z]}>
          <boxGeometry args={[W + 0.75, FLOOR_H * 1.1, D + 0.75]} />
          <meshBasicMaterial color={[2, 1.45, 0.7]} transparent opacity={0.4} toneMapped={false} depthWrite={false} />
          <Edges color="#ffd38a" threshold={15} />
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
      maxPolarAngle={Math.PI / 2.4}
    />
  );
}

// Moves the DOM annotations so they sit over their 3D positions, hiding any
// that would land behind the floor-picker panel at the bottom.
function HotspotProjector({ hotspotsRef, visible }: { hotspotsRef: RefObject<(HTMLElement | null)[]>; visible: boolean }) {
  const { camera, size, scene } = useThree();
  const points = useMemo(() => HOTSPOT_INFO.map((h) => new THREE.Vector3(...HOTSPOT_POS[h.id])), []);
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const spin = scene.getObjectByName(SPIN_NAME);
    const panelTop = size.height - (size.width < 640 ? 210 : 230);
    points.forEach((p, i) => {
      const el = hotspotsRef.current[i];
      if (!el) return;
      const projected = v.copy(p);
      if (spin) projected.applyMatrix4(spin.matrixWorld);
      projected.project(camera);
      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;
      const show = visible && projected.z < 1 && y < panelTop && y > 40;
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      el.style.opacity = show ? "1" : "0";
      el.style.pointerEvents = show ? "auto" : "none";
    });
  });
  return null;
}
