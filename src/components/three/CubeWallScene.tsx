"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// A wall of white cubes that reacts to the cursor: blocks under the pointer
// sink into a crater with a raised rim, and taps send ripples rolling outward.
// When nobody is interacting, ripples start on their own.

const SIZE = 1;
const GAP = 0.025;
const PITCH = SIZE + GAP;

type Ripple = { x: number; y: number; t0: number };
type Pointer = { x: number; y: number; active: boolean; last: number; tap: boolean };

export default function CubeWallScene({ active }: { active: boolean }) {
  const touch = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={touch ? [1, 1.5] : [1, 2]} camera={{ position: [0, 0, 24], fov: 30 }} gl={{ antialias: false }}>
      <color attach="background" args={["#eef1f5"]} />
      <hemisphereLight args={["#ffffff", "#d5dce6", 1.5]} />
      <directionalLight position={[-5, 7, 20]} intensity={2} />
      {/* Light backing so the gaps between cubes read pale, not dark */}
      <mesh position-z={-3}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#e6eaf0" />
      </mesh>
      <directionalLight position={[10, -6, 8]} intensity={0.4} color="#dfe8ff" />
      <Wall touch={touch} />
      <EffectComposer multisampling={touch ? 0 : 4}>
        {touch ? <></> : <N8AO aoRadius={1.2} intensity={2.6} distanceFalloff={0.8} halfRes quality="medium" />}
      </EffectComposer>
    </Canvas>
  );
}

function Wall({ touch }: { touch: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, camera } = useThree();
  const pointerRef = useRef<Pointer>({ x: 0, y: 0, active: false, last: -10, tap: false });
  const ripplesRef = useRef<Ripple[]>([]);
  const nextAutoRef = useRef(1.2);

  // Enough cubes to cover the visible area at z = 0.
  const grid = useMemo(() => {
    const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, 0));
    const cols = Math.ceil(vp.width / PITCH) + 2;
    const rows = Math.ceil(vp.height / PITCH) + 2;
    const cells: { x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push({ x: (c - (cols - 1) / 2) * PITCH, y: (r - (rows - 1) / 2) * PITCH });
    return { cells, w: cols * PITCH, h: rows * PITCH };
  }, [viewport, camera]);

  const depthRef = useRef<Float32Array>(new Float32Array(0));
  const geometry = useMemo(() => new RoundedBoxGeometry(SIZE, SIZE, SIZE * 1.6, 2, 0.06), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }, dt) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    if (depthRef.current.length !== grid.cells.length) depthRef.current = new Float32Array(grid.cells.length);
    const depth = depthRef.current;
    const pointer = pointerRef.current;
    const ripples = ripplesRef.current;

    if (pointer.active) pointer.last = t;
    if (pointer.tap) {
      ripples.push({ x: pointer.x, y: pointer.y, t0: t });
      pointer.tap = false;
    }

    // Idle: start a ripple somewhere every few seconds.
    if (t > nextAutoRef.current && t - pointer.last > 2.5) {
      ripples.push({ x: (Math.random() - 0.5) * grid.w * 0.7, y: (Math.random() - 0.5) * grid.h * 0.7, t0: t });
      nextAutoRef.current = t + 3.2;
    }
    while (ripples.length && t - ripples[0].t0 > 4) ripples.shift();

    const radius = touch ? 3.2 : 4.2;
    const k = 1 - Math.exp(-dt * 10);
    grid.cells.forEach((cell, i) => {
      let target = 0;
      if (pointer.active) {
        const d = Math.hypot(cell.x - pointer.x, cell.y - pointer.y);
        if (d < radius * 1.6) {
          const n = d / radius;
          // crater in the middle, slight raised rim around it
          target += -2.2 * Math.exp(-n * n * 2.2) + 0.45 * Math.exp(-((n - 1.15) ** 2) * 10);
        }
      }
      for (const r of ripples) {
        const age = t - r.t0;
        const d = Math.hypot(cell.x - r.x, cell.y - r.y);
        const front = age * 9;
        const band = d - front;
        target += -1.6 * Math.exp(-band * band * 0.35) * Math.max(0, 1 - age / 4) * (d < 2 ? d / 2 : 1);
      }
      depth[i] += (target - depth[i]) * k;
      tmp.position.set(cell.x, cell.y, depth[i]);
      // Pushed cubes tilt a little, like the reference
      tmp.rotation.set(depth[i] * 0.04 * Math.sign(cell.y - pointer.y || 1), -depth[i] * 0.04 * Math.sign(cell.x - pointer.x || 1), 0);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const p = pointerRef.current;
    p.x = e.point.x;
    p.y = e.point.y;
    p.active = true;
  };

  return (
    <>
      <instancedMesh ref={meshRef} args={[geometry, undefined, grid.cells.length]} frustumCulled={false}>
        <meshStandardMaterial color="#f7f9fb" roughness={0.6} metalness={0} />
      </instancedMesh>
      {/* Invisible catcher plane for pointer position */}
      <mesh
        position-z={0.9}
        onPointerMove={onMove}
        onPointerLeave={() => (pointerRef.current.active = false)}
        onPointerDown={(e) => {
          onMove(e);
          pointerRef.current.tap = true;
        }}
      >
        <planeGeometry args={[grid.w, grid.h]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}
