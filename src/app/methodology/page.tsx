import { EditorialPage } from "@/components/EditorialPage";
export const metadata = { title: "Methodology | SENTINEL" };

export default function MethodologyPage() {
  return <EditorialPage title="Methodology" intro="Every published fact should be traceable to a reviewed source version and locator.">
    <section>
      <h2>Source and evidence</h2>
      <p>Editors record who published a source, its version, publication and access dates, URL, rights notes, and the passage or page that supports a claim. Quotes appear only when display rights are established; otherwise the source and locator remain visible.</p>
    </section>
    <section>
      <h2 id="source-classification">Source classification</h2>
      <p>Official Government of India, Ministry of Defence and service publications are the authority for award citations, appointments, procurement facts and official campaign accounts. Technical first-party records, scholarly work and reputable contemporary reporting supplement them. Wikipedia is used as a discovery and cross-checking source—with attribution—not as the sole authority for consequential or time-variable claims.</p>
    </section>
    <section>
      <h2>Dates, variants and uncertainty</h2>
      <p>Personnel totals, command appointments, equipment inventories and specifications change. The archive preserves an effective date, variant and scope where the source supplies them; an undated figure is not silently presented as current. Approximate map points identify public city-level headquarters references, not precise facilities, operational boundaries or live deployments.</p>
    </section>
    <section>
      <h2>Research dossiers</h2>
      <p>Selected conflicts, operations, awardees, units and equipment records include editorial research dossiers. Their prose paraphrases the linked material, and numbered inline citations lead to a full references list. When researched text exists, it replaces weaker legacy narrative rather than appearing beside unsupported assertions.</p>
    </section>
    <section>
      <h2>Review and publication</h2>
      <p>Imported records start as drafts. An allowlisted editor reviews evidence and records an audit reason before publication. A changed published narrative returns to review and must be published again. Missing biographies remain explicitly incomplete; names or decorations alone are not enough to invent a life story.</p>
    </section>
  </EditorialPage>;
}
