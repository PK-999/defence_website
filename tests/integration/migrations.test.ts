import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { assertTestDatabaseUrl } from "../../scripts/lib/test-database";

const rehearsalPath = path.resolve(`.test-data/migrations-${process.pid}.db`);
const backupSource = existsSync(path.resolve(".local-backups"))
  ? readdirSync(path.resolve(".local-backups"), { withFileTypes: true }).find((entry) => entry.isFile() && entry.name.endsWith(".db"))
  : undefined;
const sourcePath = backupSource ? path.resolve(".local-backups", backupSource.name) : path.resolve("prisma/dev.db");

type MigrationReport = {
  counts: Record<string, number>;
  drafts: number;
  integrity: string;
  foreign: unknown[];
  preservedLegacyRows: boolean;
  sameSchema: boolean;
};

let report: MigrationReport;

beforeAll(async () => {
  await mkdir(path.dirname(rehearsalPath), { recursive: true });
  assertTestDatabaseUrl(`file:${rehearsalPath}`);
  const script = String.raw`
import json, sqlite3, sys
from pathlib import Path
source, output, baseline, additive = map(Path, sys.argv[1:])
src = sqlite3.connect(source.as_uri() + '?mode=ro', uri=True)
legacy = sqlite3.connect(output)
src.backup(legacy)
legacy_tables = ('Conflict','Operation','Person','Equipment','SourceRecord','SourceFamily','Source','SourceVersion','Evidence','Claim','ClaimEvidence','_ConflictToOperation','_ConflictToPerson','_ConflictToEquipment','_OperationToPerson')
before = {}
for table in legacy_tables:
    columns = [row[1] for row in legacy.execute(f'PRAGMA table_info("{table}")')]
    before[table] = (columns, legacy.execute(f'SELECT {",".join("""""" + column + """""" for column in columns)} FROM "{table}" ORDER BY rowid').fetchall())
has_publication = any(row[1] == 'publicationStatus' for row in legacy.execute('PRAGMA table_info("Conflict")'))
if not has_publication:
    legacy.executescript(additive.read_text())
preserved = True
for table, (columns, rows) in before.items():
    after = legacy.execute(f'SELECT {",".join("""""" + column + """""" for column in columns)} FROM "{table}" ORDER BY rowid').fetchall()
    preserved = preserved and rows == after
legacy_counts = {name: legacy.execute(f'SELECT COUNT(*) FROM "{name}"').fetchone()[0] for name in ('Conflict','Operation','Person','Equipment','SourceRecord')}
legacy_status = legacy.execute('SELECT COUNT(*) FROM Conflict WHERE publicationStatus = "DRAFT"').fetchone()[0]
legacy_integrity = legacy.execute('PRAGMA integrity_check').fetchone()[0]
legacy_foreign = legacy.execute('PRAGMA foreign_key_check').fetchall()
fresh = sqlite3.connect(':memory:')
fresh.executescript(baseline.read_text())
fresh.executescript(additive.read_text())
schema = lambda db: sorted((row[0], row[1]) for row in db.execute("SELECT name, sql FROM sqlite_master WHERE type IN ('table','index') AND name NOT LIKE 'sqlite_%'"))
same_schema = schema(legacy) == schema(fresh)
print(json.dumps({'counts': legacy_counts, 'drafts': legacy_status, 'integrity': legacy_integrity, 'foreign': legacy_foreign, 'preservedLegacyRows': preserved, 'sameSchema': same_schema}))
legacy.close(); fresh.close(); src.close()
`;
  const output = execFileSync("python3", [
    "-c", script, sourcePath, rehearsalPath,
    path.resolve("prisma/migrations/00000000000000_baseline/migration.sql"),
    path.resolve("prisma/migrations/20260907041000_add_publication_and_review/migration.sql"),
  ], { encoding: "utf8" });
  report = JSON.parse(output) as MigrationReport;
});

afterAll(async () => {
  if (existsSync(rehearsalPath)) await rm(rehearsalPath, { force: true });
});

describe("additive migration rehearsal", () => {
  test("preserves legacy rows while defaulting publication to DRAFT", () => {
    expect(report.counts).toMatchObject({ Conflict: 7, Operation: 20, Person: 1967, Equipment: 11, SourceRecord: 25 });
    expect(report.drafts).toBe(7);
    expect(report.integrity).toBe("ok");
    expect(report.foreign).toEqual([]);
    expect(report.preservedLegacyRows).toBe(true);
  });

  test("produces the same schema from the legacy clone and an empty database", () => {
    expect(report.sameSchema).toBe(true);
  });
});
