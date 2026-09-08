export type CollectionEvidenceIssue = { code: string; path: string; message: string };

type CollectionEvidenceInput = {
  sources?: Array<{ sourceId: string }>;
  evidence?: Array<{ id: string; sourceId: string }>;
  claims?: Array<{ id: string; evidenceIds: string[] }>;
  relationships?: Array<{ id: string; evidenceIds: string[] }>;
};

export function validateCollectionEvidenceInput(input: CollectionEvidenceInput): CollectionEvidenceIssue[] {
  const issues: CollectionEvidenceIssue[] = [];
  const unique = (items: string[], path: string, code: string) => {
    const seen = new Set<string>();
    items.forEach((item, index) => { if (seen.has(item)) issues.push({ code, path: `${path}[${index}]`, message: `Duplicate identifier: ${item}` }); else seen.add(item); });
  };
  const sourceIds = (input.sources ?? []).map((source) => source.sourceId);
  const evidenceIds = (input.evidence ?? []).map((item) => item.id);
  unique(sourceIds, "sources", "DUPLICATE_SOURCE");
  unique(evidenceIds, "evidence", "DUPLICATE_EVIDENCE");
  unique((input.claims ?? []).map((item) => item.id), "claims", "DUPLICATE_CLAIM");
  unique((input.relationships ?? []).map((item) => item.id), "relationships", "DUPLICATE_RELATIONSHIP");
  const sourceSet = new Set(sourceIds);
  (input.evidence ?? []).forEach((item, index) => { if (!sourceSet.has(item.sourceId)) issues.push({ code: "UNKNOWN_SOURCE", path: `evidence[${index}].sourceId`, message: `Unknown source: ${item.sourceId}` }); });
  const evidenceSet = new Set(evidenceIds);
  [...(input.claims ?? []), ...(input.relationships ?? [])].forEach((item, index) => item.evidenceIds.forEach((evidenceId) => { if (!evidenceSet.has(evidenceId)) issues.push({ code: "UNKNOWN_EVIDENCE", path: `evidenceLinks[${index}]`, message: `Unknown evidence: ${evidenceId}` }); }));
  return issues;
}
