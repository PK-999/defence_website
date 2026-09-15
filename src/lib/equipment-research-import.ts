export type EquipmentResearchRow = Record<string, unknown>;

export type EquipmentImportRow = {
  externalId: string;
  slug: string;
  title: string;
  domain: "army" | "navy" | "airforce";
  category: string;
  summary: string;
  content: string;
  status: string;
  developmentModel: "unknown";
  serviceStatus: "Deployed" | "Decommissioned" | "Planned";
  inductedYear: number | null;
  retiredYear: number | null;
  originCountries: string[];
  specs: Array<Record<string, string | null>>;
  variantLabel: string | null;
  statusAsOf: string | null;
};

const canonicalDomains = new Set(["army", "navy", "airforce"]);
const canonicalStatuses = new Set(["Deployed", "Decommissioned", "Planned"]);
const undocumented = /^not documented$/i;

function text(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed && !undocumented.test(trimmed) ? trimmed : null;
}

function display(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not documented";
  if (typeof value === "string") return value.trim() || "Not documented";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function listDisplay(value: unknown): string {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.map(display).join(", ");
    } catch {
      // Preserve the original source wording when it is not JSON.
    }
  }
  return display(value);
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function sourceId(value: unknown): string | null {
  const raw = text(value);
  return raw ? slugify(raw) : null;
}

function year(value: unknown): number | null {
  const parsed = text(value);
  if (!parsed) return null;
  const match = /^(\d{4})/.exec(parsed);
  return match ? Number(match[1]) : null;
}

function originCountries(value: unknown): string[] {
  const parsed = text(value);
  if (!parsed) return [];
  return [parsed];
}

function spec(label: string, value: unknown, source: string | null, locator: string, note?: string): Record<string, string | null> {
  return {
    label,
    value: display(value),
    sourceId: source,
    locator,
    ...(note ? { note } : {}),
  };
}

export function mapEquipmentResearchRecord(record: EquipmentResearchRow): EquipmentImportRow {
  const externalId = text(record.record_id);
  const title = text(record.system_name) ?? text(record.designation);
  const domain = text(record.domain);
  const category = text(record.category);
  const serviceStatus = text(record.service_status);
  if (!externalId || !title || !domain || !category) throw new Error("Equipment research row is missing its identity or taxonomy fields.");
  if (!canonicalDomains.has(domain)) throw new Error(`Equipment research row has a non-canonical domain: ${domain}`);
  if (!canonicalStatuses.has(serviceStatus ?? "")) throw new Error(`Equipment research row has an invalid service status: ${serviceStatus ?? "missing"}`);

  const normalizedDomain = domain as EquipmentImportRow["domain"];
  const normalizedStatus = serviceStatus as EquipmentImportRow["serviceStatus"];
  const source = sourceId(record.source_key);
  const locator = `Source table ${display(record.source_table)}, row ${display(record.source_row)}`;
  const role = display(record.role_purpose);
  const quantity = display(record.quantity_raw ?? record.quantity);
  const sourceStatus = display(record.source_status);
  const verification = display(record.verification_status).replace(/_/g, " ");
  const sourceUrl = display(record.source_url);
  const services = listDisplay(record.service_domains);
  const notes = display(record.notes);
  const variant = text(record.variant);
  const statusAsOf = text(record.status_as_of);
  const summary = `${title} is listed for ${services} as ${normalizedStatus.toLowerCase()}. Role: ${role}. Quantity: ${quantity}. This is a dated, source-attributed research snapshot, not a live readiness count.`;
  const content = [
    "This record is part of the Indian defence equipment research snapshot covering historical, deployed, and planned systems.",
    `Role or purpose: ${role}. Quantity recorded by the source: ${quantity}. Source status: ${sourceStatus}.`,
    `Verification status: ${verification}. A missing independent verification means the row remains a research record and should not be read as a current order-of-battle claim.`,
    `Source: ${sourceUrl} (${locator}).`,
    `Notes: ${notes}.`,
  ].join("\n\n");
  const specs = [
    spec("Quantity", quantity, source, locator),
    spec("Service domains", listDisplay(record.service_domains), source, locator),
    spec("Role or purpose", record.role_purpose, source, locator),
    spec("Manufacturer", record.make_manufacturer, source, locator),
    spec("Country of origin", record.country_of_origin, source, locator),
    spec("Commissioned or inducted date", record.commissioned_or_inducted_date, source, locator),
    spec("Retired or decommissioned date", record.retired_or_decommissioned_date, source, locator),
    spec("Dimensions", record.dimensions, source, locator),
    spec("Specifications", record.specifications, source, locator),
    spec("Original source status", record.source_status, source, locator),
    spec("Verification status", record.verification_status, source, locator),
    spec("Source", record.source_url, source, locator),
    spec("Tags", record.tags, source, locator),
  ];

  return {
    externalId,
    slug: `equipment-${slugify(title)}-${slugify(externalId)}`,
    title,
    domain: normalizedDomain,
    category,
    summary,
    content,
    status: text(record.status) ?? "Not documented",
    developmentModel: "unknown",
    serviceStatus: normalizedStatus,
    inductedYear: year(record.commissioned_or_inducted_date),
    retiredYear: year(record.retired_or_decommissioned_date),
    originCountries: originCountries(record.country_of_origin),
    specs,
    variantLabel: variant,
    statusAsOf,
  };
}

export function equipmentSourceSlug(sourceKey: string): string {
  return `research-${slugify(sourceKey)}`;
}

export function equipmentSourceId(sourceKey: string): string {
  return `equipment-source-${slugify(sourceKey)}`;
}

export function equipmentResearchSlug(title: string, externalId: string): string {
  return `equipment-${slugify(title)}-${slugify(externalId)}`;
}
