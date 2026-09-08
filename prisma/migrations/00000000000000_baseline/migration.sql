-- CreateTable
CREATE TABLE "Conflict" (
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Person" (
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Operation" (
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Equipment" (
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SourceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "author" TEXT,
    "publishedAt" TEXT,
    "accessedAt" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "archiveUrl" TEXT,
    "sourceType" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "summary" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SourceFamily" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceFamilyId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "publicationDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Source_sourceFamilyId_fkey" FOREIGN KEY ("sourceFamilyId") REFERENCES "SourceFamily" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SourceVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "versionTag" TEXT NOT NULL,
    "accessedAt" DATETIME,
    "url" TEXT,
    "archiveUrl" TEXT,
    "format" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SourceVersion_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceVersionId" TEXT NOT NULL,
    "locator" TEXT,
    "quote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Evidence_sourceVersionId_fkey" FOREIGN KEY ("sourceVersionId") REFERENCES "SourceVersion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "property" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CANDIDATE',
    "editorialNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClaimEvidence" (
    "claimId" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,

    PRIMARY KEY ("claimId", "evidenceId"),
    CONSTRAINT "ClaimEvidence_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClaimEvidence_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "predicate" TEXT NOT NULL,
    "validFrom" TEXT,
    "validTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EntityAlias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "validFrom" TEXT,
    "validTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caption" TEXT,
    "credit" TEXT,
    "sourceUrl" TEXT,
    "license" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_ConflictToOperation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ConflictToOperation_A_fkey" FOREIGN KEY ("A") REFERENCES "Conflict" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ConflictToOperation_B_fkey" FOREIGN KEY ("B") REFERENCES "Operation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ConflictToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ConflictToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "Conflict" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ConflictToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ConflictToEquipment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ConflictToEquipment_A_fkey" FOREIGN KEY ("A") REFERENCES "Conflict" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ConflictToEquipment_B_fkey" FOREIGN KEY ("B") REFERENCES "Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_OperationToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_OperationToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "Operation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OperationToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Conflict_slug_key" ON "Conflict"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_slug_key" ON "Operation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_slug_key" ON "Equipment"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SourceRecord_slug_key" ON "SourceRecord"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SourceFamily_slug_key" ON "SourceFamily"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Source_slug_key" ON "Source"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ConflictToOperation_AB_unique" ON "_ConflictToOperation"("A", "B");

-- CreateIndex
CREATE INDEX "_ConflictToOperation_B_index" ON "_ConflictToOperation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConflictToPerson_AB_unique" ON "_ConflictToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_ConflictToPerson_B_index" ON "_ConflictToPerson"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConflictToEquipment_AB_unique" ON "_ConflictToEquipment"("A", "B");

-- CreateIndex
CREATE INDEX "_ConflictToEquipment_B_index" ON "_ConflictToEquipment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OperationToPerson_AB_unique" ON "_OperationToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_OperationToPerson_B_index" ON "_OperationToPerson"("B");
