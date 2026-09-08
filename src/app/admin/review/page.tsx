import { prisma } from "@/lib/content";
import { ClaimReviewCard } from "@/components/ClaimReviewCard";
import { ShieldAlert } from "lucide-react";
import { requireEditorRole, UnauthorizedError } from "@/lib/auth/editor";
import { AdminAccessNotice } from "@/components/AdminAccessNotice";

export default async function ReviewDashboard() {
  try { await requireEditorRole("REVIEWER"); } catch (error) {
    if (error instanceof UnauthorizedError) return <AdminAccessNotice />;
    throw error;
  }
  const candidateClaims = await prisma.claim.findMany({
    where: { status: "CANDIDATE" },
    include: {
      evidence: {
        include: {
          evidence: {
            include: { sourceVersion: { include: { source: { select: { title: true, publisher: true, author: true, slug: true } } } } }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 max-w-5xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-yellow-500" />
          Review Exception Dashboard
        </h1>
        <p className="text-muted-foreground">
          Human review is required before candidate claims can appear in published records.
        </p>
      </div>

      <div className="bg-card/30 border border-border/40 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Pending Approvals</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary font-mono text-sm rounded-full">
            {candidateClaims.length} items
          </span>
        </div>

        {candidateClaims.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border/40 rounded-lg">
            No pending claims in the queue. The automated factory is idle.
          </div>
        ) : (
          <div className="space-y-4">
            {candidateClaims.map((claim) => (
              <ClaimReviewCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
