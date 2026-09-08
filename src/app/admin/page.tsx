import { prisma } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { requireEditor, UnauthorizedError } from "@/lib/auth/editor";
import { AdminAccessNotice } from "@/components/AdminAccessNotice";

export default async function AdminDashboard() {
  try { await requireEditor(); } catch (error) {
    if (error instanceof UnauthorizedError) return <AdminAccessNotice />;
    throw error;
  }
  const [conflictCount, personCount, equipmentCount, sourceCount] = await Promise.all([
    prisma.conflict.count(),
    prisma.person.count(),
    prisma.equipment.count(),
    prisma.sourceRecord.count(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-widest uppercase mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-card">
          <div className="text-sm tracking-wider text-muted-foreground mb-2 uppercase">Total Conflicts</div>
          <div className="text-4xl font-bold text-primary">{conflictCount}</div>
        </Card>
        <Card className="p-6 bg-card">
          <div className="text-sm tracking-wider text-muted-foreground mb-2 uppercase">Total Personnel</div>
          <div className="text-4xl font-bold text-primary">{personCount}</div>
        </Card>
        <Card className="p-6 bg-card">
          <div className="text-sm tracking-wider text-muted-foreground mb-2 uppercase">Total Equipment</div>
          <div className="text-4xl font-bold text-primary">{equipmentCount}</div>
        </Card>
        <Card className="p-6 bg-card">
          <div className="text-sm tracking-wider text-muted-foreground mb-2 uppercase">Total Sources</div>
          <div className="text-4xl font-bold text-primary">{sourceCount}</div>
        </Card>
      </div>
    </div>
  );
}
