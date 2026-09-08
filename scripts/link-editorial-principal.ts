import { PrismaClient } from "@prisma/client";

const OWNER_EMAIL = "puneethkakarla@gmail.com";
const issuer = process.env.OWNER_EDITOR_ISSUER?.trim();
const subject = process.env.OWNER_EDITOR_SUBJECT?.trim();

if (!issuer || !subject) {
  console.error("Set OWNER_EDITOR_ISSUER and OWNER_EDITOR_SUBJECT before linking the owner principal.");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const principal = await prisma.editorialPrincipal.update({
    where: { email: OWNER_EMAIL },
    data: { issuer, subject, active: true },
    select: { displayName: true, email: true, issuer: true, subject: true, rolesJson: true, active: true },
  });
  console.log(JSON.stringify(principal, null, 2));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Could not link editorial principal.");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
