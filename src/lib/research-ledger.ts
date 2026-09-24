import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";

export type ResearchRecord = Record<string, any>;

export interface ResearchLedger {
  awardObservations: ResearchRecord[];
  historicalAwardRoster: ResearchRecord[];
  officialAwardAnnouncements: ResearchRecord[];
  pvcRecipientProfiles: ResearchRecord[];
  biographicalFacts: ResearchRecord[];
  citationBriefs: ResearchRecord[];
  equipmentDiscovery: ResearchRecord[];
  equipmentPrimaryFacts: ResearchRecord[];
  conflictOperationDiscovery: ResearchRecord[];
  operationPrimaryFacts: ResearchRecord[];
  personConflictLinks: ResearchRecord[];
  equipmentOperationLinks: ResearchRecord[];
  sources: ResearchRecord[];
  evidenceIssues: ResearchRecord[];
}

export async function getResearchLedger(): Promise<ResearchLedger> {
  const sources = await prisma.source.findMany({ take: 100 });
  const operations = await prisma.operation.findMany({ take: 100 });
  const equipment = await prisma.equipment.findMany({ take: 100 });
  const conflicts = await prisma.conflict.findMany({ take: 50 });

  let gallantrySample: any[] = [];
  try {
    const filePath = path.join(process.cwd(), "data/research/gallantry-awardees.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    gallantrySample = Array.isArray(parsed) ? parsed : (parsed.awardees ?? []);
  } catch {
    gallantrySample = [];
  }

  return {
    awardObservations: gallantrySample.slice(0, 50),
    historicalAwardRoster: gallantrySample.slice(50, 100),
    officialAwardAnnouncements: gallantrySample.slice(100, 150),
    pvcRecipientProfiles: gallantrySample.filter((g) => g.award?.includes("Param Vir Chakra")),
    biographicalFacts: gallantrySample.slice(0, 30),
    citationBriefs: gallantrySample.filter((g) => g.citation).slice(0, 40),
    equipmentDiscovery: equipment.map((e) => ({
      id: e.id,
      title: e.title,
      domain: e.domain,
      status: e.serviceStatus,
      model: e.developmentModel,
    })),
    equipmentPrimaryFacts: equipment.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      specs: e.specs,
    })),
    conflictOperationDiscovery: conflicts.map((c) => ({
      id: c.id,
      title: c.title,
      theatres: c.theatres,
      start: c.dateStart,
      end: c.dateEnd,
    })),
    operationPrimaryFacts: operations.map((o) => ({
      id: o.id,
      title: o.title,
      category: o.category,
      start: o.dateStart,
      coordinates: o.coordinates,
    })),
    personConflictLinks: conflicts.flatMap((c) => [{
      id: `link-${c.id}`,
      conflict: c.title,
      theatres: c.theatres,
    }]),
    equipmentOperationLinks: operations.flatMap((o) => [{
      id: `op-eq-${o.id}`,
      operation: o.title,
      category: o.category,
    }]),
    sources: sources.map((s) => ({
      id: s.id,
      title: s.title,
      publisher: s.publisher,
      url: s.canonicalUrl,
      type: s.sourceType,
    })),
    evidenceIssues: [],
  };
}

export function recordsFor(ledger: ResearchLedger, section: string): ResearchRecord[] {
  const records = (ledger as any)[section];
  return Array.isArray(records) ? records : [];
}
