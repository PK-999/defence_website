import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { assertTestDatabaseUrl } from "../../scripts/lib/test-database";

const rehearsalPath = path.resolve(`.test-data/migrations-${process.pid}.db`);
const sourcePath = path.resolve("prisma/dev.db");

type MigrationReport = {
  beforeCounts: Record<string, number>;
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
legacy_tables = ('Conflict','Operation','Person','Equipment','SourceRecord','SourceFamily','Source','SourceVersion','Evidence','Claim','ClaimEvidence','_ConflictToOperation','_ConflictToPerson','_ConflictToEquipment','_OperationToPerson')
legacy.executescript(baseline.read_text())
for table in legacy_tables:
    legacy_columns = [row[1] for row in legacy.execute(f'PRAGMA table_info("{table}")')]
    source_columns = {row[1] for row in src.execute(f'PRAGMA table_info("{table}")')}
    columns = [column for column in legacy_columns if column in source_columns]
    if not columns:
        continue
    quoted = ','.join('"' + column + '"' for column in columns)
    rows = src.execute(f'SELECT {quoted} FROM "{table}" ORDER BY rowid').fetchall()
    placeholders = ','.join('?' for _ in columns)
    legacy.executemany(f'INSERT INTO "{table}" ({quoted}) VALUES ({placeholders})', rows)
legacy.commit()
before = {}
for table in legacy_tables:
    columns = [row[1] for row in legacy.execute(f'PRAGMA table_info("{table}")')]
    before[table] = (columns, legacy.execute(f'SELECT {",".join("""""" + column + """""" for column in columns)} FROM "{table}" ORDER BY rowid').fetchall())
legacy.executescript(additive.read_text())
preserved = True
for table, (columns, rows) in before.items():
    after = legacy.execute(f'SELECT {",".join("""""" + column + """""" for column in columns)} FROM "{table}" ORDER BY rowid').fetchall()
    preserved = preserved and rows == after
legacy_counts = {name: legacy.execute(f'SELECT COUNT(*) FROM "{name}"').fetchone()[0] for name in ('Conflict','Operation','Person','Equipment','SourceRecord')}
before_counts = {name: len(before[name][1]) for name in ('Conflict','Operation','Person','Equipment','SourceRecord')}
legacy_status = legacy.execute('SELECT COUNT(*) FROM Conflict WHERE publicationStatus = "DRAFT"').fetchone()[0]
legacy_integrity = legacy.execute('PRAGMA integrity_check').fetchone()[0]
legacy_foreign = legacy.execute('PRAGMA foreign_key_check').fetchall()
fresh = sqlite3.connect(':memory:')
fresh.executescript(baseline.read_text())
fresh.executescript(additive.read_text())
schema = lambda db: sorted((row[0], row[1]) for row in db.execute("SELECT name, sql FROM sqlite_master WHERE type IN ('table','index') AND name NOT LIKE 'sqlite_%'"))
same_schema = schema(legacy) == schema(fresh)
print(json.dumps({'beforeCounts': before_counts, 'counts': legacy_counts, 'drafts': legacy_status, 'integrity': legacy_integrity, 'foreign': legacy_foreign, 'preservedLegacyRows': preserved, 'sameSchema': same_schema}))
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
    expect(report.counts).toEqual(report.beforeCounts);
    expect(report.drafts).toBe(report.counts.Conflict);
    expect(report.integrity).toBe("ok");
    expect(report.foreign).toEqual([]);
    expect(report.preservedLegacyRows).toBe(true);
  });

  test("produces the same schema from the legacy clone and an empty database", () => {
    expect(report.sameSchema).toBe(true);
  });
});
