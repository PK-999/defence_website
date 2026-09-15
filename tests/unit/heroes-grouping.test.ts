import { describe, expect, test } from "vitest";
import { extractHeroYear, groupHeroesByAwardAndYear, parseHeroDecorations } from "@/lib/heroes/grouping";

describe("hero award grouping", () => {
  test("parses decorations and falls back to an explicit action year", () => {
    expect(parseHeroDecorations('["Param Vir Chakra", "Vir Chakra"]')).toEqual(["Param Vir Chakra", "Vir Chakra"]);
    expect(extractHeroYear("", "Action date shown by the memorial profile: 1999-07-03.")).toBe("1999");
    expect(extractHeroYear("1947", "Action date shown by the memorial profile: 1948-04-08.")).toBe("1948");
    expect(extractHeroYear("1965", "On 22 August 2008, he led an operation against terrorists.")).toBe("2008");
    expect(extractHeroYear(null, "No date is documented.")).toBe("Year not documented");
  });

  test("orders the six award sections and years within each section", () => {
    const groups = groupHeroesByAwardAndYear([
      { type: "Person", id: "a", slug: "a", title: "A", summary: "", href: "/heroes/a", facts: [], awards: ["Vir Chakra"], year: "1971" },
      { type: "Person", id: "b", slug: "b", title: "B", summary: "", href: "/heroes/b", facts: [], awards: ["Param Vir Chakra", "Vir Chakra"], year: "1999" },
      { type: "Person", id: "c", slug: "c", title: "C", summary: "", href: "/heroes/c", facts: [], awards: ["Ashoka Chakra"], year: "Year not documented" },
      { type: "Person", id: "d", slug: "d", title: "D", summary: "", href: "/heroes/d", facts: [], awards: ["Shaurya Chakra"], year: "2008" },
    ]);

    expect(groups.map((group) => group.award)).toEqual(["Param Vir Chakra", "Vir Chakra", "Ashoka Chakra", "Shaurya Chakra"]);
    expect(groups.find((group) => group.award === "Vir Chakra")?.years.map((year) => year.year)).toEqual(["1999", "1971"]);
    expect(groups.find((group) => group.award === "Param Vir Chakra")?.years[0].items[0].title).toBe("B");
  });
});
