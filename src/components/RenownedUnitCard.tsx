import Link from "next/link";
import type { PublishedUnitDetail } from "@/app/forces/forcesData";

export function RenownedUnitCard({ unit, publicHeroSlugs }: { unit: PublishedUnitDetail; publicHeroSlugs: string[] }) {
  const publicHeroSlugSet = new Set(publicHeroSlugs);

  return <article className="rounded-lg border border-border/60 bg-card p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{unit.service}</p>
        <h3 className="mt-2 text-xl font-semibold">{unit.name}</h3>
      </div>
      <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">{unit.type}</span>
    </div>

    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Motto</dt>
        <dd className="mt-1 text-sm leading-6">{unit.motto}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">War cry</dt>
        <dd className="mt-1 text-sm leading-6">{unit.warCry}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">HQ / base</dt>
        <dd className="mt-1 text-sm leading-6">{unit.baseLocation}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Strength</dt>
        <dd className="mt-1 text-sm leading-6">{unit.strength}</dd>
      </div>
    </dl>

    <div className="mt-5 space-y-3 border-t border-border/60 pt-4 text-sm leading-6">
      <p><span className="font-semibold">History:</span> {unit.history}</p>
      <p><span className="font-semibold">Battle record:</span> {unit.victories}</p>
    </div>

    <div className="mt-5 rounded-md border border-primary/20 bg-primary/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Gallantry record</p>
      <p className="mt-2 text-sm leading-6">{unit.heroes}</p>
      {unit.notableHeroes && unit.notableHeroes.length > 0 && <ul className="mt-3 space-y-2">
        {unit.notableHeroes.map((hero) => <li key={hero.slug} className="text-sm">
          {publicHeroSlugSet.has(hero.slug) ? <Link className="font-semibold text-primary underline" href={`/heroes/${hero.slug}`}>{hero.name}</Link> : <span className="font-semibold">{hero.name}</span>}
          <span className="text-muted-foreground"> — {hero.award}. {hero.note}</span>
        </li>)}
      </ul>}
    </div>

    <div className="mt-5 border-t border-border/60 pt-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sources and references</h4>
      <ol className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
        {unit.sources.map((source, index) => <li key={source.url} className="grid grid-cols-[auto_1fr] gap-2"><span className="font-mono text-primary">[{index + 1}]</span><span><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-foreground underline decoration-border hover:decoration-primary">{source.label}</a> — {source.note}</span></li>)}
      </ol>
    </div>
  </article>;
}
