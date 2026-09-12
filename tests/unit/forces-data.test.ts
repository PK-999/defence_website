import { describe, expect, test } from "vitest";
import { getForcesForService } from "@/app/forces/forcesData";

describe("forces directory data", () => {
  test("returns the complete directory for the all-services view", () => {
    const forces = getForcesForService("All");

    expect(forces.map((force) => force.name)).toEqual([
      "INDIAN ARMY",
      "INDIAN NAVY",
      "INDIAN AIR FORCE",
      "TRI-SERVICE COMMANDS",
    ]);
    expect(forces.flatMap((force) => force.commands).map((command) => command.name)).toContain("Northern Command");
  });

  test("filters command data without dropping headquarters or coverage", () => {
    const [force] = getForcesForService("INDIAN ARMY");
    const northern = force.commands.find((command) => command.name === "Northern Command");

    expect(northern).toMatchObject({
      hq: "Udhampur",
      coverage: "Jammu & Kashmir, Ladakh",
      hqCoordinates: [32.9255, 75.1354],
    });
    expect(northern?.coverageStates).toContain("Ladakh");
  });
});
