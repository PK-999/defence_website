import zlib from "node:zlib";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type ResearchRecord = Record<string, unknown>;
export type ResearchLedger = Record<string, unknown> & { schemaVersion: number; generatedAt: string };

let cached: Promise<ResearchLedger> | undefined;

export function getResearchLedger(): Promise<ResearchLedger> {
  cached ??= readFile(path.join(process.cwd(), "public/research/ledger.json")).then((payload) => {
    const json = payload[0] === 0x1f && payload[1] === 0x8b ? zlib.gunzipSync(payload).toString("utf8") : payload.toString("utf8");
    return JSON.parse(json) as ResearchLedger;
  });
  return cached;
}

export function recordsFor(ledger: ResearchLedger, section: string): ResearchRecord[] {
  const records = ledger[section];
  return Array.isArray(records) ? records.filter((value): value is ResearchRecord => typeof value === "object" && value !== null && !Array.isArray(value)) : [];
}

export function searchableText(record: ResearchRecord): string {
  return Object.values(record).map((value) => typeof value === "string" ? value : JSON.stringify(value)).join(" ").toLowerCase();
}
