import Link from "next/link";
import { PageHeader, PageShell } from "@/components/PageShell";
import { listPublicUnits } from "@/lib/repositories/entities";
import { prisma } from "@/lib/db";
import ForcesMapWrapper from "@/components/ForcesMapWrapper";
import { getForcesForService, type ServiceLevel } from "./forcesData";
export const dynamic = "force-dynamic";
const tabs = ["overview", "organization", "units"] as const;
const services: ServiceLevel[] = ["All", "INDIAN ARMY", "INDIAN NAVY", "INDIAN AIR FORCE", "TRI-SERVICE COMMANDS"];

export default async function ForcesPage({ searchParams }: { searchParams: Promise<{ service?: string; tab?: string }> }) {
  const params = await searchParams;
  const tab = tabs.includes(params.tab as typeof tabs[number]) ? params.tab as typeof tabs[number] : "overview";
  const activeService = services.includes(params.service as ServiceLevel) ? params.service as ServiceLevel : "All";
  const forces = getForcesForService(activeService);
  const units = await listPublicUnits(params.service, prisma);
  const link = (next: { service?: ServiceLevel; tab: typeof tabs[number] }) => {
    const query = new URLSearchParams({ tab: next.tab });
    if (next.service && next.service !== "All") query.set("service", next.service);
    return `/forces?${query.toString()}`;
  };

  return <PageShell width="wide">
    <PageHeader title="Forces" description="Command structures, headquarters, areas of responsibility, and selected bases across India’s armed forces." />
    <section className="mb-8 rounded-lg border border-primary/30 bg-primary/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary">Reference directory</p>
          <h2 className="mt-2 text-2xl font-semibold">Indian force organization</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Browse the command-level reference data restored from the earlier Forces directory. HQ coordinates and coverage are approximate reference locations; they are not a live operational picture.</p>
        </div>
        <span className="rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">Legacy reference data</span>
      </div>
    </section>
    <div className="mb-8 flex flex-wrap gap-2" aria-label="Force service filters">
      {services.map((service) => <Link key={service} href={link({ service, tab })} aria-current={activeService === service ? "page" : undefined} className={`rounded-full border px-3 py-1 text-sm ${activeService === service ? "border-primary text-primary" : "border-border"}`}>{service === "All" ? "All services" : service}</Link>)}
    </div>
    <nav aria-label="Forces sections" className="flex gap-4 border-b border-border pb-2">
      {tabs.map((name) => <Link key={name} href={link({ service: activeService, tab: name })} aria-current={tab === name ? "page" : undefined} className={`pb-2 capitalize ${tab === name ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>{name}</Link>)}
    </nav>
    {tab === "overview" && <>
      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {forces.map((force) => <article key={force.name} className="rounded-lg border border-border/60 bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Service</p><h2 className="mt-1 text-2xl font-semibold">{force.name}</h2></div><span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">{force.commands.length} commands</span></div>
          <p className="mt-4 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Recorded strength:</span> {force.organization.approximateStrength}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3"><div><p className="text-xs uppercase tracking-wide text-muted-foreground">Officer ranks</p><p className="mt-1 text-sm">{force.organization.officers.length} levels</p></div><div><p className="text-xs uppercase tracking-wide text-muted-foreground">JCO ranks</p><p className="mt-1 text-sm">{force.organization.jcos.length} levels</p></div><div><p className="text-xs uppercase tracking-wide text-muted-foreground">Other ranks</p><p className="mt-1 text-sm">{force.organization.ors.length} levels</p></div></div>
        </article>)}
      </section>
      <section className="mt-10"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Command directory</p><h2 className="mt-1 text-2xl font-semibold">Headquarters and coverage</h2></div><p className="text-sm text-muted-foreground">{forces.reduce((total, force) => total + force.commands.length, 0)} command records</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{forces.flatMap((force) => force.commands.map((command) => <article key={`${force.name}-${command.name}`} className="rounded-lg border border-border/60 bg-card p-5"><p className="text-xs font-semibold uppercase tracking-wide text-primary">{force.name}</p><h3 className="mt-2 text-xl font-semibold">{command.name}</h3><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Headquarters</dt><dd className="mt-1 font-medium">{command.hq}</dd></div><div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Area of responsibility</dt><dd className="mt-1 text-muted-foreground">{command.coverage}</dd></div><div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Mapped states/territories</dt><dd className="mt-1 text-muted-foreground">{command.coverageStates.length > 0 ? command.coverageStates.join(", ") : "Theatre or training responsibility"}</dd></div></dl>{command.bases && command.bases.length > 0 && <p className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Listed bases:</span> {command.bases.length}</p>}</article>))}</div></section>
      <section className="mt-10"><ForcesMapWrapper forcesData={forces} activeService={activeService} /></section>
    </>}
    {tab === "organization" && <section className="mt-8 space-y-6"><div><p className="max-w-3xl text-sm leading-6 text-muted-foreground">The rank groupings below preserve the organization detail from the reference directory. Command hierarchy is presented at the command level; unit-level parentage remains in the reviewed Units collection when available.</p></div>{forces.map((force) => <article key={force.name} className="rounded-lg border border-border/60 bg-card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">{force.commands.length} commands</p><h2 className="mt-1 text-2xl font-semibold">{force.name}</h2></div><p className="text-sm text-muted-foreground">{force.organization.approximateStrength}</p></div><div className="mt-5 grid gap-5 md:grid-cols-3"><div><h3 className="font-semibold">Officers</h3><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{force.organization.officers.map((rank) => <li key={rank}>{rank}</li>)}</ul></div><div><h3 className="font-semibold">JCOs</h3><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{force.organization.jcos.map((rank) => <li key={rank}>{rank}</li>)}</ul></div><div><h3 className="font-semibold">Other ranks</h3><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{force.organization.ors.map((rank) => <li key={rank}>{rank}</li>)}</ul></div></div></article>)}</section>}
    {tab === "units" && <section className="mt-8"><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold">Published units</h2><span className="text-sm text-muted-foreground">{units.length} records</span></div>{units.length === 0 ? <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">No reviewed units are available for this service.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{units.map((unit) => <Link key={unit.id} href={`/forces/units/${unit.slug}`} className="rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-primary/60"><p className="text-xs uppercase text-primary">{unit.unitType}</p><h3 className="mt-2 text-xl font-semibold">{unit.title}</h3><p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{unit.summary}</p></Link>)}</div>}</section>}
  </PageShell>;
}
