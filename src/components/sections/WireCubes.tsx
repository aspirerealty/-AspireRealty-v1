"use client";

import { useEffect, useRef } from "react";

// Background of floating wireframe cubes drifting through 3D space, drawn on
// a 2D canvas (no 3D library needed). The camera slowly travels through the
// field and leans toward the cursor.

type Cube = { x: number; y: number; z: number; s: number; rx: number; ry: number; vx: number; vy: number };

const EDGES = [
  [0, 1], [1, 3], [3, 2], [2, 0],
  [4, 5], [5, 7], [7, 6], [6, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];
const CORNERS = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z])));

export default function WireCubes({ color = "214, 180, 122", density = 70 }: { color?: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let seed = 42;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const DEPTH = 40;
    const cubes: Cube[] = Array.from({ length: density }, () => ({
      x: (rand() - 0.5) * 60,
      y: (rand() - 0.5) * 36,
      z: rand() * DEPTH + 2,
      s: 0.5 + Math.pow(rand(), 3) * 3,
      rx: rand() * Math.PI,
      ry: rand() * Math.PI,
      vx: (rand() - 0.5) * 0.4,
      vy: (rand() - 0.5) * 0.4,
    }));

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const camYaw = mouse.x * 0.15 + Math.sin(now / 9000) * 0.1;
      const camPitch = mouse.y * 0.1;
      const focal = Math.min(w, h) * 1.1;

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (const c of cubes) {
        if (!reduce) {
          c.z -= dt * 2.2; // travel forward through the field
          c.rx += dt * c.vx;
          c.ry += dt * c.vy;
          if (c.z < 0.8) {
            c.z += DEPTH;
            c.x = (rand() - 0.5) * 60;
            c.y = (rand() - 0.5) * 36;
          }
        }
        const sx = Math.sin(c.rx), cx = Math.cos(c.rx), sy = Math.sin(c.ry), cy = Math.cos(c.ry);
        const pts = CORNERS.map(([px, py, pz]) => {
          // rotate cube, then apply camera yaw/pitch
          let x = px * c.s, y = py * c.s, z = pz * c.s;
          [y, z] = [y * cx - z * sx, y * sx + z * cx];
          [x, z] = [x * cy + z * sy, -x * sy + z * cy];
          x += c.x; y += c.y; z += c.z;
          [x, z] = [x * Math.cos(camYaw) - z * Math.sin(camYaw), x * Math.sin(camYaw) + z * Math.cos(camYaw)];
          [y, z] = [y * Math.cos(camPitch) - z * Math.sin(camPitch), y * Math.sin(camPitch) + z * Math.cos(camPitch)];
          return z > 0.5 ? [w / 2 + (x / z) * focal, h / 2 + (y / z) * focal] : null;
        });
        const fade = Math.min(1, c.z / 4) * (1 - c.z / (DEPTH + 2));
        ctx.strokeStyle = `rgba(${color}, ${0.06 + fade * 0.32})`;
        ctx.beginPath();
        for (const [a, b] of EDGES) {
          const p = pts[a];
          const q = pts[b];
          if (!p || !q) continue;
          ctx.moveTo(p[0], p[1]);
          ctx.lineTo(q[0], q[1]);
        }
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [color, density]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />;
}
