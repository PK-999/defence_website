import { prisma } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { requireEditor, UnauthorizedError } from "@/lib/auth/editor";
import { AdminAccessNotice } from "@/components/AdminAccessNotice";

export default async function AdminEquipment() {
  try { await requireEditor(); } catch (error) {
    if (error instanceof UnauthorizedError) return <AdminAccessNotice />;
    throw error;
  }
  const equipment = await prisma.equipment.findMany({
    orderBy: { title: 'asc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-widest uppercase">Manage Equipment</h1>
        <Button>+ NEW EQUIPMENT</Button>
      </div>

      <div className="border border-border/40 rounded-lg bg-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border/40 uppercase tracking-wider text-xs text-muted-foreground">
            <tr>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Domain</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map(item => (
              <tr key={item.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4 uppercase text-muted-foreground text-xs tracking-wider">{item.domain}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs tracking-wider uppercase">
                    {item.serviceStatus}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="outline" size="sm">EDIT</Button>
                </td>
              </tr>
            ))}
            {equipment.length === 0 && (
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
