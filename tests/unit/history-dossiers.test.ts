import { describe, expect, test } from "vitest";
import { CONFLICT_DOSSIERS, OPERATION_DOSSIERS } from "@/lib/history-dossiers";

const PUBLIC_CONFLICT_SLUGS = [
  "kargil-1999",
  "indo-pak-1971",
  "indo-pak-1965",
  "siachen-1984",
  "goa-1961",
  "sino-indian-1962",
  "indo-pak-1947",
];

const PUBLIC_OPERATION_SLUGS = [
  "kargil-infiltration-discovered",
  "battle-of-badgam-1947",
  "operation-cactus",
  "battle-of-basantar-1971",
  "battle-of-longewala",
  "operation-trident",
  "battle-of-asal-uttar",
  "tangail-airdrop-1971",
  "operation-polo",
  "battle-of-chawinda-1965",
  "battle-of-rezang-la-1962",
  "naval-action-mormugao-1961",
  "operation-bison-1948",
  "operation-meghdoot-1984",
  "operation-safed-sagar",
  "kargil-battle-of-tololing",
  "kargil-tiger-hill",
  "kargil-point-5140",
  "battle-of-namka-chu-1962",
  "operation-rajiv-1987",
  "battle-of-haji-pir-1965",
];

function validateDossier(dossier: (typeof CONFLICT_DOSSIERS)[string]) {
  expect(dossier.overview.length).toBeGreaterThan(120);
  expect(dossier.keyPoints.length).toBeGreaterThanOrEqual(2);
  expect(dossier.sources.length).toBeGreaterThanOrEqual(1);
  for (const source of dossier.sources) expect(source.url).toMatch(/^https:\/\//);
}

describe("history research dossiers", () => {
  test("covers every published conflict", () => {
    expect(Object.keys(CONFLICT_DOSSIERS).sort()).toEqual(PUBLIC_CONFLICT_SLUGS.sort());
    for (const dossier of Object.values(CONFLICT_DOSSIERS)) validateDossier(dossier);
  });

  test("covers every published operation and battle", () => {
    expect(Object.keys(OPERATION_DOSSIERS).sort()).toEqual(PUBLIC_OPERATION_SLUGS.sort());
    for (const dossier of Object.values(OPERATION_DOSSIERS)) validateDossier(dossier);
  });

  test("keeps conflict overview and research prose distinct and substantial", () => {
    for (const dossier of Object.values(CONFLICT_DOSSIERS)) {
      expect(dossier.overviewParagraphs).toHaveLength(4);
      expect(dossier.researchParagraphs).toHaveLength(4);
      expect(dossier.overviewParagraphs).not.toEqual(dossier.researchParagraphs);
    }
  });
});
