import { prisma } from "@/lib/content";
import { Button } from "@/components/ui/button";

export default async function AdminConflicts() {
  const conflicts = await prisma.conflict.findMany({
    orderBy: { dateStart: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-widest uppercase">Manage Conflicts</h1>
        <Button>+ NEW CONFLICT</Button>
      </div>

      <div className="border border-border/40 rounded-lg bg-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border/40 uppercase tracking-wider text-xs text-muted-foreground">
            <tr>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Slug</th>
              <th className="p-4 font-semibold">Date Start</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {conflicts.map(conflict => (
              <tr key={conflict.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="p-4 font-medium">{conflict.title}</td>
                <td className="p-4 font-mono text-muted-foreground">{conflict.slug}</td>
                <td className="p-4 text-muted-foreground">{conflict.dateStart}</td>
                <td className="p-4 text-right">
                  <Button variant="outline" size="sm">EDIT</Button>
                </td>
              </tr>
            ))}
            {conflicts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
