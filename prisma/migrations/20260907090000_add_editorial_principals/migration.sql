CREATE TABLE "EditorialPrincipal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "issuer" TEXT,
    "subject" TEXT,
    "rolesJson" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "EditorialPrincipal_email_key" ON "EditorialPrincipal"("email");
CREATE UNIQUE INDEX "EditorialPrincipal_issuer_subject_key" ON "EditorialPrincipal"("issuer", "subject");
CREATE INDEX "EditorialPrincipal_active_email_idx" ON "EditorialPrincipal"("active", "email");

INSERT INTO "EditorialPrincipal" ("id", "displayName", "email", "rolesJson", "active", "createdAt", "updatedAt")
VALUES ('owner-puneeth-kakarla', 'Puneeth Kakarla', 'puneethkakarla@gmail.com', '["REVIEWER","PUBLISHER"]', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT("email") DO NOTHING;
