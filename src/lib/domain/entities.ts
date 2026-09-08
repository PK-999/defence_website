export const entityTypes = ["Conflict", "Operation", "Person", "Equipment", "Unit", "Source"] as const;
export type EntityType = (typeof entityTypes)[number];

export const entityRoutes: Record<EntityType, string> = {
  Conflict: "/conflicts",
  Operation: "/operations",
  Person: "/heroes",
  Equipment: "/arsenal",
  Unit: "/forces/units",
  Source: "/archive",
};

export type EntityRef = { type: EntityType; id: string };

export function isEntityType(value: unknown): value is EntityType {
  return typeof value === "string" && (entityTypes as readonly string[]).includes(value);
}

export function entityKey(ref: EntityRef): string {
  return `${ref.type}:${ref.id}`;
}
