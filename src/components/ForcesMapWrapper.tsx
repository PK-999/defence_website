'use client';
import dynamic from 'next/dynamic';
import type { Force, ServiceLevel, Command } from '@/app/forces/forcesData';

const ForcesMap = dynamic(() => import('./ForcesMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[550px] bg-[#050c08] animate-pulse rounded-xl flex flex-col items-center justify-center border border-primary/30 text-muted-foreground font-mono text-xs gap-3">
      <span className="h-3 w-3 rounded-full bg-primary animate-ping" />
      <span>INITIALIZING THEATRE MAP INTERFACE...</span>
    </div>
  )
});

interface ForcesMapWrapperProps {
  forcesData: Force[];
  activeService: ServiceLevel;
  selectedCommandName?: string | null;
  onSelectCommand?: (command: Command | null, force: Force | null) => void;
}

export default function ForcesMapWrapper({
  forcesData,
  activeService,
  selectedCommandName,
  onSelectCommand,
}: ForcesMapWrapperProps) {
  return (
    <div className="w-full h-full min-h-[550px]">
      <ForcesMap
        forcesData={forcesData}
        activeService={activeService}
        selectedCommandName={selectedCommandName}
        onSelectCommand={onSelectCommand}
      />
    </div>
  );
}
