import { z } from "zod";

export const EntityBaseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  shortTitle: z.string().optional(),
  summary: z.string(),
  status: z.enum(["draft", "reviewed", "published"]),
  sourceIds: z.array(z.string()),
  tags: z.array(z.string()),
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
});

export const ConflictSchema = EntityBaseSchema.extend({
  type: z.literal("conflict"),
  dateStart: z.string(),
  dateEnd: z.string().optional(),
  theatres: z.array(z.string()),
  serviceIds: z.array(z.string()),
  operationIds: z.array(z.string()),
  eventIds: z.array(z.string()),
  personIds: z.array(z.string()),
  unitIds: z.array(z.string()),
  equipmentIds: z.array(z.string()),
  outcomeSummary: z.string().optional(),
  contextSummary: z.string().optional(),
});

export const MediaRefSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  credit: z.string().optional(),
  sourceUrl: z.string().optional(),
  license: z.string().optional(),
});

export const PersonSchema = EntityBaseSchema.extend({
  type: z.literal("person"),
  fullName: z.string(),
  serviceId: z.string(),
  rank: z.string().optional(),
  unitIds: z.array(z.string()),
  awardIds: z.array(z.string()).optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  operationIds: z.array(z.string()).optional(),
  conflictIds: z.array(z.string()).optional(),
  eventIds: z.array(z.string()).optional(),
  portrait: MediaRefSchema.optional(),
});

export const OperationSchema = EntityBaseSchema.extend({
  type: z.literal("operation"),
  category: z.enum([
    "combat",
    "evacuation",
    "humanitarian",
    "peacekeeping",
    "maritime-security",
    "rescue",
    "other",
  ]),
  dateStart: z.string(),
  dateEnd: z.string().optional(),
  serviceIds: z.array(z.string()),
  conflictIds: z.array(z.string()).optional(),
  eventIds: z.array(z.string()).optional(),
  personIds: z.array(z.string()).optional(),
  unitIds: z.array(z.string()).optional(),
  equipmentIds: z.array(z.string()).optional(),
});

export const EquipmentSpecSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.string(),
  unit: z.string().optional(),
  sourceIds: z.array(z.string()),
  note: z.string().optional(),
});

export const EquipmentSchema = EntityBaseSchema.extend({
  type: z.literal("equipment"),
  domain: z.enum(["air", "land", "sea", "missile", "space-isr", "support"]),
  category: z.string(),
  serviceIds: z.array(z.string()),
  manufacturerIds: z.array(z.string()).optional(),
  originCountries: z.array(z.string()),
  developmentModel: z.enum([
    "indigenous",
    "joint-development",
    "license-produced",
    "imported",
    "mixed",
  ]),
  serviceStatus: z.enum([
    "active",
    "retired",
    "under-development",
    "planned",
    "limited",
  ]),
  inductedYear: z.number().optional(),
  retiredYear: z.number().optional(),
  variants: z.array(z.string()).optional(),
  specs: z.array(EquipmentSpecSchema),
});

export const UnitSchema = EntityBaseSchema.extend({
  type: z.literal("unit"),
  serviceId: z.string(),
  unitType: z.string(),
  parentUnitId: z.string().optional(),
  historicalOnly: z.boolean().optional(),
});

export const SourceRecordSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  publisher: z.string(),
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  accessedAt: z.string(),
  url: z.string(),
  archiveUrl: z.string().optional(),
  sourceType: z.enum([
    "official-webpage",
    "official-report",
    "parliament",
    "gallantry-citation",
    "press-release",
    "academic",
    "book",
    "news",
    "photo",
    "map",
    "interview",
    "video",
    "other",
  ]),
  tier: z.enum(["A", "B", "C", "D", "DISCOVERY"]),
  summary: z.string().optional(),
  notes: z.string().optional(),
});

export const TimelineEventSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  dateStart: z.string(),
  dateEnd: z.string().optional(),
  summary: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  significance: z.string().optional(),
  sourceIds: z.array(z.string()),
  personIds: z.array(z.string()).optional(),
  unitIds: z.array(z.string()).optional(),
  equipmentIds: z.array(z.string()).optional(),
});
