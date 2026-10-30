// Works around a Next.js static-export bug on Windows: segment prefetch files
// should be written as `__next.about.__PAGE__.txt`, but Windows path
// separators make Next write `__next.about\__PAGE__.txt` (a folder) instead,
// so client-side prefetches 404. This flattens them. No-op on Linux/macOS
// (e.g. AWS Amplify builds).
import { promises as fs } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");

async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) await flatten(full, dir);
    else await walk(full);
  }
}

// Move every file under `segDir` to `<parent>/<segDir name>.<relative path with dots>`.
async function flatten(segDir, parent) {
  const files = [];
  const collect = async (d) => {
    for (const e of await fs.readdir(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) await collect(p);
      else files.push(p);
    }
  };
  await collect(segDir);
  for (const file of files) {
    const rel = path.relative(parent, file).split(path.sep).join(".");
    await fs.rename(file, path.join(parent, rel));
  }
  await fs.rm(segDir, { recursive: true });
}

if (process.platform === "win32") {
  await walk(outDir);
  console.log("Flattened Next.js segment prefetch files for Windows build.");
}
