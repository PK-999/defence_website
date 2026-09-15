import { describe, expect, test } from "vitest";
import {
  gallantryResearch,
  getAwardeeBiography,
  getAwardeeById,
  getAwardeeStory,
  getAwardees,
  groupAwardeesByYear,
  displayAwardeeName,
} from "@/lib/heroes/gallantry-research";

describe("official gallantry research corpus", () => {
  test("contains the complete official recipient corpus for all six awards", () => {
    const awardees = getAwardees();
    expect(gallantryResearch.counts).toEqual({
      "Param Vir Chakra": 21,
      "Maha Vir Chakra": 155,
      "Vir Chakra": 879,
      "Ashoka Chakra": 98,
      "Kirti Chakra": 332,
      "Shaurya Chakra": 1401,
    });
    expect(gallantryResearch.recordCounts).toEqual({
      "Param Vir Chakra": 21,
      "Maha Vir Chakra": 214,
      "Vir Chakra": 1338,
      "Ashoka Chakra": 98,
      "Kirti Chakra": 496,
      "Shaurya Chakra": 2143,
    });
    expect(awardees).toHaveLength(2886);
    expect(new Set(awardees.map((awardee) => awardee.officialId))).toHaveLength(2886);
    expect(awardees.filter((awardee) => awardee.award === "Param Vir Chakra")).toHaveLength(21);
    expect(awardees.filter((awardee) => awardee.award === "Maha Vir Chakra")).toHaveLength(155);
    expect(awardees.filter((awardee) => awardee.award === "Vir Chakra")).toHaveLength(879);
    expect(awardees.filter((awardee) => awardee.award === "Ashoka Chakra")).toHaveLength(98);
    expect(awardees.filter((awardee) => awardee.award === "Kirti Chakra")).toHaveLength(332);
    expect(awardees.filter((awardee) => awardee.award === "Shaurya Chakra")).toHaveLength(1401);
  });

  test("keeps every record traceable to the official portal", () => {
    for (const awardee of getAwardees()) {
      expect(awardee.actionDate).toMatch(/^(?:\d{4}-\d{2}-\d{2}|Not documented)$/);
      expect(awardee.actionYear).toMatch(/^\d{4}$/);
      expect(awardee.unit.length).toBeGreaterThan(0);
      expect(awardee.sourceUrl).toBe(`https://gallantryawards.gov.in/awardee/${awardee.officialId}`);
      expect(awardee.photoUrl === null || /^https:\/\/gallantryawards\.gov\.in\//.test(awardee.photoUrl)).toBe(true);
      for (const url of [...awardee.profileUrls, ...awardee.citationUrls]) expect(url).toMatch(/^https:\/\/gallantryawards\.gov\.in\//);
    }
  });

  test("exposes the enriched dates, biography, and citation details", () => {
    const piru = getAwardees("Param Vir Chakra").find((awardee) => awardee.name === "PIRU SINGH");
    expect(piru).toMatchObject({
      birthDate: "1918-05-20",
      serviceEntryDate: "1936-05-20",
      actionDate: "1948-07-18",
    });
    expect(piru?.biography).toContain("Company Havildar Major");
    expect(piru?.citationDetails).not.toBe("Not documented");
  });

  test("removes rank and honorific prefixes from display names", () => {
    expect(displayAwardeeName("SECOND LIEUTENANT ARUN KHETARPAL")).toBe("Arun Khetarpal");
    expect(displayAwardeeName("Captain Vikram Batra")).toBe("Vikram Batra");
    expect(displayAwardeeName("LIEUTENANT COLONEL(Then MAJOR) DHAN SINGH THAPA")).toBe("Dhan Singh Thapa");
  });

  test("groups newest official award/action record year first", () => {
    const acYears = groupAwardeesByYear("Ashoka Chakra").map((group) => Number(group.year));
    expect(acYears).toEqual(acYears.slice().sort((left, right) => right - left));
  });

  test("provides an individual medal story for all 21 PVC recipients", () => {
    const pvc = getAwardees("Param Vir Chakra");
    expect(pvc.map(getAwardeeStory)).toHaveLength(21);
    for (const story of pvc.map(getAwardeeStory)) {
      expect(story.title).not.toBe("Official award record");
      expect(story.body.length).toBeGreaterThan(100);
    }
  });

  test("builds a source-faithful biography for every official record", () => {
    const awardee = getAwardeeById("3601");
    expect(awardee).not.toBeNull();
    const biography = getAwardeeBiography(awardee!);
    expect(biography).toContain("P M Raman");
    expect(biography).toContain("2/LT");
    expect(biography).toContain("3 SIKH LI");
    expect(biography).toContain("26-01-1956");
    expect(biography).toContain("posthumously");
  });
});
