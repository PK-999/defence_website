export const PUBLICATION_STATUS = "PUBLISHED" as const;
export const PUBLIC_CONTENT_KIND = "EDITORIAL" as const;

export const publicPublicationWhere = {
  publicationStatus: PUBLICATION_STATUS,
  contentKind: PUBLIC_CONTENT_KIND,
  reviewedAt: { not: null },
  reviewedBy: { not: null },
};

export function publicWhere<T extends Record<string, unknown> = Record<string, unknown>>(): T {
  return { ...publicPublicationWhere } as unknown as T;
}
