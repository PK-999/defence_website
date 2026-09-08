-- AlterTable
ALTER TABLE "SourceVersion" ADD COLUMN "contentHash" TEXT;
ALTER TABLE "SourceVersion" ADD COLUMN "httpStatus" INTEGER;
ALTER TABLE "SourceVersion" ADD COLUMN "parserVersion" TEXT;
ALTER TABLE "SourceVersion" ADD COLUMN "rawStoragePath" TEXT;

-- AlterTable
ALTER TABLE "EntityAlias" ADD COLUMN "normalizedAlias" TEXT;

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "content" TEXT,
    "serviceId" TEXT,
    "unitType" TEXT NOT NULL,
    "parentUnitId" TEXT,
    "motto" TEXT,
    "warCry" TEXT,
    "establishedDate" TEXT,
    "disbandedDate" TEXT,
    "ranksJson" TEXT,
    "awardsJson" TEXT,
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "contentKind" TEXT NOT NULL DEFAULT 'EDITORIAL',
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Unit_parentUnitId_fkey" FOREIGN KEY ("parentUnitId") REFERENCES "Unit" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "previousValue" TEXT NOT NULL,
    "nextValue" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ImportRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inputHash" TEXT NOT NULL,
    "schemaVersion" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "reportJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ImportIdentity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceSystem" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ImportProposal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "importRunId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "expectedRevision" INTEGER NOT NULL,
    "proposedDataJson" TEXT NOT NULL,
    "originalDataJson" TEXT NOT NULL,
    "issuesJson" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CANDIDATE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImportProposal_importRunId_fkey" FOREIGN KEY ("importRunId") REFERENCES "ImportRun" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EntityEvidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    CONSTRAINT "EntityEvidence_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RelationshipEvidence" (
    "relationshipId" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,

    PRIMARY KEY ("relationshipId", "evidenceId"),
    CONSTRAINT "RelationshipEvidence_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "Relationship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RelationshipEvidence_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SearchDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleNormalized" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "summaryNormalized" TEXT NOT NULL,
    "bodyNormalized" TEXT NOT NULL,
    "entityRevision" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "SearchAlias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "normalizedAlias" TEXT NOT NULL,
    CONSTRAINT "SearchAlias_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "SearchDocument" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EntityFacet" (
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    PRIMARY KEY ("entityType", "entityId", "name", "value")
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conflict" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortTitle" TEXT,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "status" TEXT NOT NULL,
    "dateStart" TEXT NOT NULL,
    "dateEnd" TEXT,
    "theatres" TEXT NOT NULL,
    "coordinates" TEXT,
    "referenceUrl" TEXT,
    "outcomeSummary" TEXT,
    "contextSummary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "contentKind" TEXT NOT NULL DEFAULT 'EDITORIAL',
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "dateStartPrecision" TEXT NOT NULL DEFAULT 'unknown',
    "dateEndPrecision" TEXT NOT NULL DEFAULT 'unknown'
);
INSERT INTO "new_Conflict" ("content", "contextSummary", "coordinates", "createdAt", "dateEnd", "dateStart", "id", "outcomeSummary", "referenceUrl", "shortTitle", "slug", "status", "summary", "theatres", "title", "updatedAt") SELECT "content", "contextSummary", "coordinates", "createdAt", "dateEnd", "dateStart", "id", "outcomeSummary", "referenceUrl", "shortTitle", "slug", "status", "summary", "theatres", "title", "updatedAt" FROM "Conflict";
DROP TABLE "Conflict";
ALTER TABLE "new_Conflict" RENAME TO "Conflict";
CREATE UNIQUE INDEX "Conflict_slug_key" ON "Conflict"("slug");
CREATE INDEX "Conflict_publicationStatus_contentKind_title_id_idx" ON "Conflict"("publicationStatus", "contentKind", "title", "id");
CREATE TABLE "new_Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "status" TEXT NOT NULL,
    "rank" TEXT,
    "birthDate" TEXT,
    "deathDate" TEXT,
    "serviceBranch" TEXT,
    "decorations" TEXT,
    "conflict" TEXT,
    "year" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "contentKind" TEXT NOT NULL DEFAULT 'EDITORIAL',
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "birthDatePrecision" TEXT NOT NULL DEFAULT 'unknown',
    "deathDatePrecision" TEXT NOT NULL DEFAULT 'unknown'
);
INSERT INTO "new_Person" ("birthDate", "conflict", "content", "createdAt", "deathDate", "decorations", "fullName", "id", "rank", "serviceBranch", "slug", "status", "summary", "title", "updatedAt", "year") SELECT "birthDate", "conflict", "content", "createdAt", "deathDate", "decorations", "fullName", "id", "rank", "serviceBranch", "slug", "status", "summary", "title", "updatedAt", "year" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");
CREATE INDEX "Person_publicationStatus_contentKind_title_id_idx" ON "Person"("publicationStatus", "contentKind", "title", "id");
CREATE TABLE "new_Operation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "status" TEXT NOT NULL,
    "dateStart" TEXT NOT NULL,
    "dateEnd" TEXT,
    "coordinates" TEXT,
    "referenceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "contentKind" TEXT NOT NULL DEFAULT 'EDITORIAL',
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "dateStartPrecision" TEXT NOT NULL DEFAULT 'unknown',
    "dateEndPrecision" TEXT NOT NULL DEFAULT 'unknown'
);
INSERT INTO "new_Operation" ("category", "content", "coordinates", "createdAt", "dateEnd", "dateStart", "id", "referenceUrl", "slug", "status", "summary", "title", "updatedAt") SELECT "category", "content", "coordinates", "createdAt", "dateEnd", "dateStart", "id", "referenceUrl", "slug", "status", "summary", "title", "updatedAt" FROM "Operation";
DROP TABLE "Operation";
ALTER TABLE "new_Operation" RENAME TO "Operation";
CREATE UNIQUE INDEX "Operation_slug_key" ON "Operation"("slug");
CREATE INDEX "Operation_publicationStatus_contentKind_title_id_idx" ON "Operation"("publicationStatus", "contentKind", "title", "id");
CREATE TABLE "new_Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "status" TEXT NOT NULL,
    "developmentModel" TEXT NOT NULL,
    "serviceStatus" TEXT NOT NULL,
    "inductedYear" INTEGER,
    "retiredYear" INTEGER,
    "originCountries" TEXT NOT NULL,
    "specs" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "contentKind" TEXT NOT NULL DEFAULT 'EDITORIAL',
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "variantLabel" TEXT,
    "statusAsOf" TEXT
);
INSERT INTO "new_Equipment" ("category", "content", "createdAt", "developmentModel", "domain", "id", "inductedYear", "originCountries", "retiredYear", "serviceStatus", "slug", "specs", "status", "summary", "title", "updatedAt") SELECT "category", "content", "createdAt", "developmentModel", "domain", "id", "inductedYear", "originCountries", "retiredYear", "serviceStatus", "slug", "specs", "status", "summary", "title", "updatedAt" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
CREATE UNIQUE INDEX "Equipment_slug_key" ON "Equipment"("slug");
CREATE INDEX "Equipment_publicationStatus_contentKind_title_id_idx" ON "Equipment"("publicationStatus", "contentKind", "title", "id");
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceFamilyId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "author" TEXT,
    "publicationDate" TEXT,
    "publisher" TEXT,
    "canonicalUrl" TEXT,
    "sourceType" TEXT,
    "tier" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "rightsNotes" TEXT,
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "contentKind" TEXT NOT NULL DEFAULT 'EDITORIAL',
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Source_sourceFamilyId_fkey" FOREIGN KEY ("sourceFamilyId") REFERENCES "SourceFamily" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Source" ("author", "createdAt", "id", "publicationDate", "slug", "sourceFamilyId", "title", "updatedAt") SELECT "author", "createdAt", "id", "publicationDate", "slug", "sourceFamilyId", "title", "updatedAt" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
CREATE UNIQUE INDEX "Source_slug_key" ON "Source"("slug");
CREATE INDEX "Source_publicationStatus_contentKind_title_id_idx" ON "Source"("publicationStatus", "contentKind", "title", "id");
CREATE TABLE "new_Evidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceVersionId" TEXT NOT NULL,
    "locator" TEXT,
    "quote" TEXT,
    "evidenceType" TEXT NOT NULL DEFAULT 'TEXT',
    "rightsSafeToDisplay" BOOLEAN NOT NULL DEFAULT false,
    "reviewerNote" TEXT,
    "authorityType" TEXT NOT NULL DEFAULT 'unknown',
    "authorityBasis" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Evidence_sourceVersionId_fkey" FOREIGN KEY ("sourceVersionId") REFERENCES "SourceVersion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Evidence" ("createdAt", "id", "locator", "quote", "sourceVersionId", "updatedAt") SELECT "createdAt", "id", "locator", "quote", "sourceVersionId", "updatedAt" FROM "Evidence";
DROP TABLE "Evidence";
ALTER TABLE "new_Evidence" RENAME TO "Evidence";
CREATE TABLE "new_Claim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "property" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CANDIDATE',
    "editorialNote" TEXT,
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Claim" ("createdAt", "editorialNote", "entityId", "entityType", "id", "property", "status", "updatedAt", "value", "verificationStatus") SELECT "createdAt", "editorialNote", "entityId", "entityType", "id", "property", "status", "updatedAt", "value", "verificationStatus" FROM "Claim";
DROP TABLE "Claim";
ALTER TABLE "new_Claim" RENAME TO "Claim";
CREATE TABLE "new_Relationship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "predicate" TEXT NOT NULL,
    "validFrom" TEXT,
    "validTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CANDIDATE',
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "fingerprint" TEXT
);
INSERT INTO "new_Relationship" ("createdAt", "id", "predicate", "sourceId", "sourceType", "targetId", "targetType", "updatedAt", "validFrom", "validTo") SELECT "createdAt", "id", "predicate", "sourceId", "sourceType", "targetId", "targetType", "updatedAt", "validFrom", "validTo" FROM "Relationship";
DROP TABLE "Relationship";
ALTER TABLE "new_Relationship" RENAME TO "Relationship";
CREATE UNIQUE INDEX "Relationship_fingerprint_key" ON "Relationship"("fingerprint");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Unit_slug_key" ON "Unit"("slug");

-- CreateIndex
CREATE INDEX "Unit_publicationStatus_contentKind_title_id_idx" ON "Unit"("publicationStatus", "contentKind", "title", "id");

-- CreateIndex
CREATE INDEX "Unit_serviceId_unitType_idx" ON "Unit"("serviceId", "unitType");

-- CreateIndex
CREATE INDEX "ReviewAudit_entityType_entityId_createdAt_idx" ON "ReviewAudit"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ImportRun_inputHash_key" ON "ImportRun"("inputHash");

-- CreateIndex
CREATE INDEX "ImportIdentity_entityType_entityId_idx" ON "ImportIdentity"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "ImportIdentity_sourceSystem_externalId_entityType_key" ON "ImportIdentity"("sourceSystem", "externalId", "entityType");

-- CreateIndex
CREATE UNIQUE INDEX "ImportProposal_importRunId_entityType_entityId_key" ON "ImportProposal"("importRunId", "entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityEvidence_entityType_entityId_section_evidenceId_key" ON "EntityEvidence"("entityType", "entityId", "section", "evidenceId");

-- CreateIndex
CREATE INDEX "SearchDocument_entityType_titleNormalized_id_idx" ON "SearchDocument"("entityType", "titleNormalized", "id");

-- CreateIndex
CREATE UNIQUE INDEX "SearchDocument_entityType_entityId_key" ON "SearchDocument"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "SearchAlias_normalizedAlias_idx" ON "SearchAlias"("normalizedAlias");

-- CreateIndex
CREATE UNIQUE INDEX "SearchAlias_documentId_normalizedAlias_key" ON "SearchAlias"("documentId", "normalizedAlias");

-- CreateIndex
CREATE INDEX "EntityFacet_entityType_name_value_entityId_idx" ON "EntityFacet"("entityType", "name", "value", "entityId");
