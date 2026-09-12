import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(__dirname, "..");
const dataRoot = path.join(root, "docs/research/2026-09-09-defence-corpus/data");
const outputRoot = path.join(root, "public/research");

const files = {
  coverage: "coverage.json",
  announcementCoverage: "announcement-coverage.json",
  awardObservations: "award-observations.json",
  historicalAwardRoster: "historical-award-roster.json",
  officialAwardAnnouncements: "official-award-announcements.json",
  biographicalFacts: "biographical-facts.json",
  citationBriefs: "citation-briefs.json",
  pvcRecipientProfiles: "pvc-recipient-profiles.json",
  equipmentDiscovery: "equipment-discovery.json",
  equipmentPrimaryFacts: "equipment-primary-facts.json",
  conflictOperationDiscovery: "conflict-operation-discovery.json",
  operationPrimaryFacts: "operation-primary-facts.json",
  personConflictLinks: "person-conflict-links.json",
  equipmentOperationLinks: "equipment-operation-links.json",
  sources: "sources.json",
  evidenceIssues: "evidence-issues.json",
} as const;

async function main(): Promise<void> {
  const ledger: Record<string, unknown> = {};
  for (const [key, file] of Object.entries(files)) ledger[key] = JSON.parse(await readFile(path.join(dataRoot, file), "utf8")) as unknown;
  ledger.generatedAt = new Date().toISOString();
  ledger.schemaVersion = 1;
  await mkdir(outputRoot, { recursive: true });
  await writeFile(path.join(outputRoot, "ledger.json"), `${JSON.stringify(ledger)}\n`, "utf8");
  console.log(JSON.stringify({ output: "public/research/ledger.json", sections: Object.fromEntries(Object.entries(ledger).filter(([, value]) => Array.isArray(value)).map(([key, value]) => [key, (value as unknown[]).length])) }, null, 2));
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
