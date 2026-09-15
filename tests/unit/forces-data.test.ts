import { describe, expect, test } from "vitest";
import { getForcesForService, getRenownedUnitsForService } from "@/app/forces/forcesData";

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
    for (const force of forces) {
      expect(force.organization.approximateStrength).not.toMatch(/^\d[\d,]+/);
      expect(force.sources.length).toBeGreaterThanOrEqual(1);
      for (const command of force.commands) {
        expect(command.bases).toBeUndefined();
        expect(command.sources.length).toBeGreaterThanOrEqual(1);
        expect(command.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
      }
    }
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

  test("curated unit directory includes traditions and awardee links", () => {
    const armyUnits = getRenownedUnitsForService("INDIAN ARMY");
    const airForceUnits = getRenownedUnitsForService("INDIAN AIR FORCE");
    const navyUnits = getRenownedUnitsForService("INDIAN NAVY");
    const jakRifles = armyUnits.find((unit) => unit.name === "13 JAK Rifles");
    const flyingBullets = airForceUnits.find((unit) => unit.name === "No. 18 Squadron (Flying Bullets)");

    expect(armyUnits.length).toBeGreaterThanOrEqual(6);
    expect(navyUnits.length).toBeGreaterThanOrEqual(3);
    expect(airForceUnits.length).toBeGreaterThanOrEqual(4);
    expect(jakRifles).toMatchObject({
      motto: expect.not.stringContaining("Valour and Honor"),
      warCry: expect.any(String),
    });
    expect(jakRifles?.notableHeroes).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "vikram-batra", award: "Param Vir Chakra" }),
    ]));
    expect(flyingBullets).toMatchObject({ motto: expect.stringContaining("Courage") });
    const mappedAwards = new Set(getRenownedUnitsForService("All").flatMap((unit) => unit.notableHeroes?.map((hero) => hero.award) ?? []));
    expect(["Param Vir Chakra", "Maha Vir Chakra", "Vir Chakra", "Ashoka Chakra", "Kirti Chakra", "Shaurya Chakra"].every((award) => mappedAwards.has(award))).toBe(true);
    for (const unit of getRenownedUnitsForService("All")) {
      expect(unit.sources.length).toBeGreaterThanOrEqual(1);
      expect(unit.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }
  });

  test("unit filters keep only the requested service", () => {
    expect(getRenownedUnitsForService("INDIAN NAVY").every((unit) => unit.service === "INDIAN NAVY")).toBe(true);
    expect(getRenownedUnitsForService("All").some((unit) => unit.service === "INDIAN ARMY")).toBe(true);
    expect(getRenownedUnitsForService("All").some((unit) => unit.service === "INDIAN NAVY")).toBe(true);
    expect(getRenownedUnitsForService("All").some((unit) => unit.service === "INDIAN AIR FORCE")).toBe(true);
  });
});
