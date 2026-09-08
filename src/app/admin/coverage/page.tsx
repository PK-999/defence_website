import React from 'react';
import { prisma } from '@/lib/content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { requireEditor, UnauthorizedError } from "@/lib/auth/editor";
import { AdminAccessNotice } from "@/components/AdminAccessNotice";

export default async function CoverageDashboard() {
  try { await requireEditor(); } catch (error) {
    if (error instanceof UnauthorizedError) return <AdminAccessNotice />;
    throw error;
  }
  const sourceCount = await prisma.source.count();
  const claimsCount = await prisma.claim.count();
  const evidenceCount = await prisma.evidence.count();
  
  const sourcesByTier = await prisma.sourceFamily.groupBy({
    by: ['tier'],
    _count: {
      id: true
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">Bounded Exhaustiveness Coverage</h1>
          <p className="text-[var(--text-secondary)] mt-2">Map of our internal coverage against the Known Universe.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[var(--surface-glass)] border-[var(--border-subtle)]">
          <CardHeader>
            <CardTitle className="text-xl text-[var(--accent-primary)]">Claims recorded</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-mono text-[var(--text-primary)]">{claimsCount}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[var(--surface-glass)] border-[var(--border-subtle)]">
          <CardHeader>
            <CardTitle className="text-xl text-[var(--accent-primary)]">Pieces of Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-mono text-[var(--text-primary)]">{evidenceCount}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[var(--surface-glass)] border-[var(--border-subtle)]">
          <CardHeader>
            <CardTitle className="text-xl text-[var(--accent-primary)]">Source Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-mono text-[var(--text-primary)]">{sourceCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="bg-[var(--surface-glass)] border-[var(--border-subtle)]">
          <CardHeader>
            <CardTitle className="text-xl text-[var(--text-primary)]">Source Tier Distribution</CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">Distribution of Source Families by authoritative tier.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 font-mono">
              {sourcesByTier.map(t => (
                <li key={t.tier} className="flex justify-between border-b border-[var(--border-subtle)] pb-2 text-[var(--text-secondary)]">
                  <span>Tier {t.tier}</span>
                  <span className="text-[var(--text-primary)]">{t._count.id}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface-glass)] border-[var(--border-subtle)]">
          <CardHeader>
            <CardTitle className="text-xl text-[var(--text-primary)]">Review coverage</CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">Coverage calculations are not available until reviewed source mappings are complete.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center p-3 border border-[var(--border-subtle)] rounded bg-[var(--bg-1)]">
                <span className="text-[var(--text-secondary)]">Aircraft in Indian Service</span>
                <span className="text-yellow-500">REVIEW NOT CALCULATED</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-[var(--border-subtle)] rounded bg-[var(--bg-1)]">
                <span className="text-[var(--text-secondary)]">Kargil War (1999)</span>
                <span className="text-yellow-500">REVIEW NOT CALCULATED</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
