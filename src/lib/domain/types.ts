export type ValidationIssue = {
  code: string;
  path: string;
  message: string;
  severity: "error" | "warning";
};

import type { EntityRef, EntityType } from "./entities";

export type VerificationStatus =
  | "OFFICIALLY_CONFIRMED"
  | "MULTIPLE_CREDIBLE_SOURCES"
  | "DECLASSIFIED_RECORD"
  | "DISPUTED"
  | "SOURCE_CONFLICT"
  | "UNVERIFIED";

export type PublicEvidence = {
  id: string;
  locator: string;
  sourceId: string;
  sourceTitle: string;
  publisher: string;
  versionTag: string;
  sourceHref: string;
  originalUrl: string | null;
  archiveUrl: string | null;
  quote: string | null;
};

export type PublicClaim = {
  id: string;
  property: string;
  value: string;
  verificationStatus: VerificationStatus;
  editorialExplanation: string | null;
  evidence: PublicEvidence[];
};

export type PublicRelationship = {
  id: string;
  source: EntityRef;
  target: EntityRef;
  predicate: string;
  validFrom: string | null;
  validTo: string | null;
  sourceTitle: string;
  targetTitle: string;
  sourceHref: string;
  targetHref: string;
  evidence: PublicEvidence[];
};

export type RelationshipInput = {
  source: EntityRef;
  target: EntityRef;
  predicate: string;
  validFrom?: string | null;
  validTo?: string | null;
};

export type CollectionItem = EntityRef & {
  slug: string;
  title: string;
  summary: string;
  href: string;
  facts: Array<{ label: string; value: string }>;
};

export type CollectionQuery = {
  page: number;
  pageSize: number;
  q?: string;
  service?: string;
  medal?: string;
  conflict?: string;
  year?: string;
  domain?: string;
  category?: string;
  status?: string;
  sort: "title" | "date";
};

export type PageResult<T> = { items: T[]; page: number; pageSize: number; total: number; pageCount: number; invalid: string[] };

export type NormalizationResult<T> = {
  value: T;
  issues: ValidationIssue[];
};
