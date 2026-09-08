import { prisma } from "@/lib/db";
import { reconcileSearchIndex } from "@/lib/search/service";
const count = await reconcileSearchIndex(prisma); console.log(`Reconciled ${count} public search documents.`); await prisma.$disconnect();
