import type { EntityType } from "./entities";

export interface ValidationIssue {
  code: string;
  path: string;
  message: string;
  severity: "warning" | "error";
}

export interface NormalizationResult<T> {
  value: T;
  issues: ValidationIssue[];
}

export interface CollectionQuery {
  page: number;
  pageSize: number;
  q?: string;
  sort?: string;
  service?: string;
  year?: string;
  conflict?: string;
  medal?: string;
  domain?: string;
  category?: string;
  status?: string;
}

export interface CollectionItem {
  type: EntityType;
  id: string;
  slug: string;
  title: string;
  summary: string;
  href: string;
  facts: Array<{ label: string; value: string }>;
  awards?: string[];
  year?: string;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface PublicEvidence {
  id: string;
  sourceHref: string;
  sourceTitle: string;
  versionTag?: string;
  publisher?: string;
  locator?: string;
  quote?: string | null;
  originalUrl?: string | null;
  archiveUrl?: string | null;
}

export interface PublicClaim {
  id: string;
  property: string;
  value: string;
  verificationStatus: string;
  evidence: PublicEvidence[];
}
