'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { Force, ServiceLevel } from '@/app/forces/forcesData';

const ForcesMap = dynamic(() => import('./ForcesMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-card animate-pulse rounded-lg flex items-center justify-center border border-border/50 text-muted-foreground">Loading Map Interface...</div>
});

export default function ForcesMapWrapper({ forcesData, activeService }: { forcesData: Force[]; activeService: ServiceLevel }) {
  const [enabled, setEnabled] = useState(false);
  return <div className="space-y-3">
    <div className="rounded border border-border/60 bg-card/40 p-4 text-sm"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold">Force locations</p><p className="text-xs text-muted-foreground">The map loads only after you choose to view it.</p></div><button type="button" onClick={() => setEnabled(true)} className="rounded border border-primary/50 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10">{enabled ? 'Map shown' : 'Show map'}</button></div></div>
    {enabled && <ForcesMap forcesData={forcesData} activeService={activeService} />}
  </div>;
}
