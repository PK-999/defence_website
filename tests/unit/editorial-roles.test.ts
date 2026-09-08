import { describe, expect, it } from "vitest";
import { hasEditorialRole, parseEditorialRoles, type EditorialRole } from "@/lib/auth/roles";

describe("editorial roles", () => {
  it("parses only the supported reviewer and publisher roles", () => {
    expect(parseEditorialRoles(JSON.stringify(["REVIEWER", "PUBLISHER", "ADMIN"]))).toEqual(["REVIEWER", "PUBLISHER"]);
    expect(parseEditorialRoles("not-json")).toEqual([]);
  });

  it.each<[EditorialRole, EditorialRole[]]>([
    ["REVIEWER", ["REVIEWER"]],
    ["PUBLISHER", ["PUBLISHER"]],
  ])("checks the %s role exactly", (role, roles) => {
    expect(hasEditorialRole(roles, role)).toBe(true);
    expect(hasEditorialRole([], role)).toBe(false);
  });
});
