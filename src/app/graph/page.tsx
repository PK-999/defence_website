import { ScrambleText } from "@/components/ScrambleText";
import { GraphExplorer } from "@/components/GraphExplorer";

export default function GraphPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-primary mb-4 uppercase">
          <ScrambleText text="Connection Explorer" />
        </h1>
        <p className="text-xl text-muted-foreground font-mono">
          Visualize the complex web of relationships between conflicts, operations, people, and equipment.
        </p>
      </div>
      
      <GraphExplorer />
    </div>
  );
}
