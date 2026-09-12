import { GraphExplorer } from "@/components/GraphExplorer";
import { listPublicEntities } from "@/lib/repositories/collections";
import { prisma } from "@/lib/db";
import { PageHeader, PageShell } from "@/components/PageShell";

export const dynamic = "force-dynamic";

export default async function GraphPage() {
  const query = { page: 1, pageSize: 8, sort: "title" as const };
  const [conflicts, operations, people] = await Promise.all([listPublicEntities("Conflict", query, prisma), listPublicEntities("Operation", query, prisma), listPublicEntities("Person", query, prisma)]);
  const topics = [...conflicts.items, ...operations.items, ...people.items].map((item) => ({ type: item.type, id: item.id, title: item.title }));
  return <PageShell width="wide"><PageHeader title="Connection Explorer" description="Choose a reviewed topic to inspect its capped, one-hop public relationships. The labeled list below the visualization is the complete text equivalent." /><GraphExplorer topics={topics} /></PageShell>;
}
