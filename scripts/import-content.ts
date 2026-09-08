import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { importContent, type ImportMode } from "../src/lib/import/service";

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const inputPath = argument("--input");
  const reportPath = argument("--report");
  const mode = (argument("--mode") ?? "validate") as ImportMode;
  if (!inputPath) throw new Error("IMPORT_INPUT_REQUIRED");
  if (!(mode === "validate" || mode === "dry-run" || mode === "apply")) throw new Error("IMPORT_MODE_INVALID");
  if (mode === "apply" && process.env.IMPORT_APPLY_CONFIRM !== "I_UNDERSTAND") throw new Error("IMPORT_APPLY_CONFIRM_REQUIRED");
  const resolvedInput = path.resolve(inputPath);
  const input = JSON.parse(await readFile(resolvedInput, "utf8")) as unknown;
  const report = await importContent(input, mode, mode === "apply" ? { databaseUrl: process.env.DATABASE_URL } : {});
  if (reportPath) {
    const resolvedReport = path.resolve(reportPath);
    await mkdir(path.dirname(resolvedReport), { recursive: true });
    await writeFile(resolvedReport, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  console.log(JSON.stringify(report, null, 2));
  if (report.errors.length > 0) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
