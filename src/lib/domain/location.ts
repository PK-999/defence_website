export type Location = {
  coordinates: [number, number];
  precision: "exact" | "approximate";
  sourceUrl: string | null;
  asOf: string | null;
};

export function parseLocation(input: unknown): Location | null {
  if (!input || typeof input !== "object") return null;
  const value = input as { coordinates?: unknown; precision?: unknown; sourceUrl?: unknown; asOf?: unknown };
  if (!Array.isArray(value.coordinates) || value.coordinates.length !== 2) return null;
  const lat = Number(value.coordinates[0]);
  const lng = Number(value.coordinates[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { coordinates: [lat, lng], precision: value.precision === "exact" ? "exact" : "approximate", sourceUrl: typeof value.sourceUrl === "string" && value.sourceUrl.trim() ? value.sourceUrl : null, asOf: typeof value.asOf === "string" && value.asOf.trim() ? value.asOf : null };
}
