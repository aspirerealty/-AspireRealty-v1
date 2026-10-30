"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Procedural model of the two G+47 towers. On first view the towers rise
// floor by floor, then the windows light up as dusk turns to night.

const FLOORS = 47;
const FLOOR_H = 0.32;
const HEIGHT = FLOORS * FLOOR_H;
const CORE = 4.2; // tower footprint (square)
const WINDOWS_PER_SIDE = 5;
const BUILD_SECONDS = 4.5;
const LIGHTS_SECONDS = 3;

const TOWERS: { x: number; z: number; rot: number }[] = [
  { x: -3.4, z: 0.8, rot: 0 },
  { x: 3.6, z: -1.6, rot: Math.PI / 2 },
];

const GLASS = new THREE.Color("#1c3552");
const LIT = new THREE.Color("#ffc983");

type Props = {
  active: boolean;
  replayKey: number;
  onProgress: (floor: number) => void;
};

export default function TowersScene({ active, replayKey, onProgress }: Props) {
  // On touch screens, dragging the model would block page scrolling, so it
  // spins on its own instead of using OrbitControls.
  const touch = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: touch ? [38, 17, 46] : [30, 15, 36], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <hemisphereLight args={["#ffd7b0", "#0b1b2b", 1.1]} />
      <directionalLight position={[-12, 18, 10]} intensity={1.6} color="#ffb37a" />
      <directionalLight position={[10, 6, -12]} intensity={0.5} color="#7aa7ff" />

      <Spin enabled={touch}>
        <Towers replayKey={replayKey} onProgress={onProgress} />
        <Podium />
        <Sparkles count={40} scale={[22, 18, 22]} position={[0, 9, 0]} size={2.5} speed={0.25} color="#d6b47a" opacity={0.6} />
      </Spin>

      {touch ? (
        <LookAt y={HEIGHT * 0.45} />
      ) : (
        <OrbitControls
          target={[0, HEIGHT * 0.45, 0]}
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.1}
        />
      )}
    </Canvas>
  );
}

function Spin({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (enabled && group.current) group.current.rotation.y += dt * 0.12;
  });
  return <group ref={group}>{children}</group>;
}

function LookAt({ y }: { y: number }) {
  const camera = useThree((state) => state.camera);
  useLayoutEffect(() => camera.lookAt(0, y, 0), [camera, y]);
  return null;
}

function Towers({ replayKey, onProgress }: { replayKey: number; onProgress: (floor: number) => void }) {
  const slabs = useRef<THREE.InstancedMesh>(null);
  const windows = useRef<THREE.InstancedMesh>(null);
  const cores = useRef<(THREE.Mesh | null)[]>([]);
  const crowns = useRef<(THREE.Group | null)[]>([]);
  const fins = useRef<(THREE.Group | null)[]>([]);
  const clock = useRef({ t: 0, floors: -1, lightStep: -1 });

  // Static layout of every slab and window; visibility is toggled via scale.
  const layout = useMemo(() => {
    const slabMatrices: THREE.Matrix4[] = [];
    const windowMatrices: { m: THREE.Matrix4; floor: number; threshold: number }[] = [];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    TOWERS.forEach((tower) => {
      for (let f = 0; f < FLOORS; f++) {
        const y = f * FLOOR_H + FLOOR_H;
        slabMatrices.push(new THREE.Matrix4().compose(new THREE.Vector3(tower.x, y, tower.z), q.setFromAxisAngle(up, tower.rot), new THREE.Vector3(1, 1, 1)));
        for (let side = 0; side < 4; side++) {
          const angle = tower.rot + (side * Math.PI) / 2;
          const normal = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
          const tangent = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));
          for (let w = 0; w < WINDOWS_PER_SIDE; w++) {
            const offset = (w - (WINDOWS_PER_SIDE - 1) / 2) * (CORE / WINDOWS_PER_SIDE);
            const pos = new THREE.Vector3(tower.x, y - FLOOR_H / 2, tower.z)
              .addScaledVector(normal, CORE / 2 + 0.01)
              .addScaledVector(tangent, offset);
            m.compose(pos, new THREE.Quaternion().setFromAxisAngle(up, angle), new THREE.Vector3(1, 1, 1));
            windowMatrices.push({ m: m.clone(), floor: f, threshold: rand() });
          }
        }
      }
    });
    return { slabMatrices, windowMatrices };
  }, []);

  useEffect(() => {
    clock.current = { t: 0, floors: -1, lightStep: -1 };
  }, [replayKey]);

  useLayoutEffect(() => {
    windows.current?.setColorAt(0, GLASS);
  }, []);

  const hidden = useMemo(() => new THREE.Matrix4().makeScale(0, 0, 0), []);

  useFrame((_, dt) => {
    const c = clock.current;
    c.t += Math.min(dt, 0.1);
    const build = Math.min(1, c.t / BUILD_SECONDS);
    const eased = 1 - Math.pow(1 - build, 3);
    const floors = Math.round(eased * FLOORS);
    const lights = Math.max(0, Math.min(1, (c.t - BUILD_SECONDS * 0.6) / LIGHTS_SECONDS));
    const lightStep = Math.round(lights * 40);

    // Cores and crowns grow with the build.
    cores.current.forEach((core) => {
      if (!core) return;
      const h = Math.max(0.001, floors * FLOOR_H);
      core.scale.y = h;
      core.position.y = h / 2;
    });
    fins.current.forEach((group) => {
      if (group) group.scale.y = Math.max(0.001, floors / FLOORS);
    });
    crowns.current.forEach((crown) => {
      if (!crown) return;
      crown.visible = floors === FLOORS;
      crown.scale.y = THREE.MathUtils.lerp(crown.scale.y, crown.visible ? 1 : 0.01, 0.08);
    });

    if (floors === c.floors && lightStep === c.lightStep) return;
    c.floors = floors;
    c.lightStep = lightStep;
    onProgress(floors);

    const s = slabs.current;
    const w = windows.current;
    if (!s || !w) return;
    layout.slabMatrices.forEach((m, i) => s.setMatrixAt(i, i % FLOORS < floors ? m : hidden));
    s.instanceMatrix.needsUpdate = true;
    const color = new THREE.Color();
    layout.windowMatrices.forEach(({ m, floor, threshold }, i) => {
      w.setMatrixAt(i, floor < floors ? m : hidden);
      w.setColorAt(i, threshold < lights * 0.65 ? color.copy(LIT).multiplyScalar(0.8 + threshold * 0.6) : GLASS);
    });
    w.instanceMatrix.needsUpdate = true;
    if (w.instanceColor) w.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      {TOWERS.map((tower, i) => (
        <group key={i}>
          <mesh ref={(el) => void (cores.current[i] = el)} position={[tower.x, 0, tower.z]} rotation={[0, tower.rot, 0]}>
            <boxGeometry args={[CORE, 1, CORE]} />
            <meshStandardMaterial color="#2a3d55" roughness={0.35} metalness={0.4} />
          </mesh>
          {/* Gold vertical fins on the corners */}
          <group ref={(el) => void (fins.current[i] = el)} position={[tower.x, 0, tower.z]} rotation={[0, tower.rot, 0]}>
            {[-1, 1].map((sx) =>
              [-1, 1].map((sz) => (
                <mesh key={`${sx}${sz}`} position={[(sx * CORE) / 2, HEIGHT / 2, (sz * CORE) / 2]}>
                  <boxGeometry args={[0.08, HEIGHT, 0.08]} />
                  <meshStandardMaterial color="#c49a52" metalness={0.8} roughness={0.3} transparent opacity={0.85} />
                </mesh>
              )),
            )}
          </group>
          <group ref={(el) => void (crowns.current[i] = el)} position={[tower.x, HEIGHT, tower.z]} rotation={[0, tower.rot, 0]} visible={false}>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[CORE * 0.8, 1, CORE * 0.8]} />
              <meshStandardMaterial color="#e7dcc8" roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.4, 0]}>
              <boxGeometry args={[CORE * 0.5, 0.8, CORE * 0.5]} />
              <meshStandardMaterial color="#e7dcc8" emissive="#ffc983" emissiveIntensity={0.35} />
            </mesh>
            <mesh position={[0, 2.2, 0]}>
              <boxGeometry args={[0.12, 0.9, 0.12]} />
              <meshStandardMaterial color="#c49a52" emissive="#c49a52" emissiveIntensity={0.6} />
            </mesh>
          </group>
        </group>
      ))}

      <instancedMesh ref={slabs} args={[undefined, undefined, layout.slabMatrices.length]}>
        <boxGeometry args={[CORE + 0.5, 0.05, CORE + 0.5]} />
        <meshStandardMaterial color="#d8d2c6" roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={windows} args={[undefined, undefined, layout.windowMatrices.length]}>
        <planeGeometry args={[(CORE / WINDOWS_PER_SIDE) * 0.72, FLOOR_H * 0.62]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Podium() {
  const trees = useMemo(() => {
    const list: [number, number][] = [];
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      list.push([Math.cos(a) * 9.5, Math.sin(a) * 6.2]);
    }
    return list;
  }, []);

  return (
    <group>
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[22, 1.2, 15]} />
        <meshStandardMaterial color="#3b4a5c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[21, 14]} />
        <meshStandardMaterial color="#2f5b3a" roughness={1} />
      </mesh>
      {trees.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.5]} />
            <meshStandardMaterial color="#5a4030" />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.45, 12, 10]} />
            <meshStandardMaterial color={i % 2 ? "#3f7a4f" : "#4d8a59"} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
