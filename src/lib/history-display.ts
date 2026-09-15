import type { HistoryDossier } from "./history-dossiers";

export function researchedText(legacyText: string | null | undefined, dossier?: HistoryDossier | null): string {
  return dossier?.overviewParagraphs?.join("\n\n") ?? dossier?.overview ?? legacyText ?? "";
}
