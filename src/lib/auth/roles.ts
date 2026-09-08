export const editorialRoles = ["REVIEWER", "PUBLISHER"] as const;
export type EditorialRole = (typeof editorialRoles)[number];

export function parseEditorialRoles(value: unknown): EditorialRole[] {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? (() => {
          try {
            const parsed: unknown = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];
  return editorialRoles.filter((role) => values.some((item) => item === role));
}

export function hasEditorialRole(roles: readonly EditorialRole[], role: EditorialRole): boolean {
  return roles.includes(role);
}
