import { GraphExplorer } from "@/components/GraphExplorer";
import { listPublicEntities } from "@/lib/repositories/collections";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function GraphPage() {
  const query = { page: 1, pageSize: 8, sort: "title" as const };
  const [conflicts, operations, people] = await Promise.all([listPublicEntities("Conflict", query, prisma), listPublicEntities("Operation", query, prisma), listPublicEntities("Person", query, prisma)]);
  const topics = [...conflicts.items, ...operations.items, ...people.items].map((item) => ({ type: item.type, id: item.id, title: item.title }));
  return <div className="mx-auto max-w-7xl px-4 py-10"><div className="mb-10"><h1 className="text-4xl font-bold tracking-tight text-primary">Connection Explorer</h1><p className="mt-3 max-w-2xl text-muted-foreground">Choose a reviewed topic to inspect its capped, one-hop public relationships. The labeled list below the visualization is the complete text equivalent.</p></div><GraphExplorer topics={topics} /></div>;
}
