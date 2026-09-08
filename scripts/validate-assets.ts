import { readFile, stat } from "node:fs/promises";
import path from "node:path";

type MapAsset = { path: string; provider: string; attribution: string; source: string; license: string; byteBudget: number };
type MapManifest = { assets: MapAsset[] };

export async function validateMapAssets(root = process.cwd()): Promise<string[]> {
  const errors: string[] = [];
  let manifest: MapManifest;
  try { manifest = JSON.parse(await readFile(path.join(root, "public/maps/manifest.json"), "utf8")) as MapManifest; } catch { return ["public/maps/manifest.json is missing or invalid JSON"]; }
  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) errors.push("Map manifest must contain at least one asset.");
  for (const asset of manifest.assets ?? []) {
    if (!asset.path || !asset.provider || !asset.attribution || !asset.source || !asset.license || !Number.isFinite(asset.byteBudget)) { errors.push(`Incomplete manifest entry: ${asset.path ?? "unknown"}`); continue; }
    const filePath = path.join(root, "public", asset.path.replace(/^\//, ""));
    try {
      const bytes = (await stat(filePath)).size;
      if (bytes > asset.byteBudget) errors.push(`${asset.path} exceeds ${asset.byteBudget} bytes (${bytes}).`);
      const data = JSON.parse(await readFile(filePath, "utf8")) as { type?: string; features?: unknown[] };
      if (data.type !== "FeatureCollection" || !Array.isArray(data.features)) errors.push(`${asset.path} is not a FeatureCollection.`);
    } catch { errors.push(`${asset.path} is missing or invalid JSON.`); }
  }
  return errors;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  validateMapAssets().then((errors) => { if (errors.length) { errors.forEach((error) => console.error(error)); process.exitCode = 1; } else console.log("Map assets validated."); });
}
