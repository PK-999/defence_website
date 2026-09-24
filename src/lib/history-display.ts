export function researchedText(fallbackText: string | null | undefined, dossier?: any): string {
  if (dossier?.executiveSummary) {
    return dossier.executiveSummary;
  }
  if (dossier?.summary) {
    return dossier.summary;
  }
  if (dossier?.context) {
    return dossier.context;
  }
  return fallbackText ?? "";
}
