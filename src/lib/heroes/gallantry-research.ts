import research from "../../../data/research/gallantry-awardees.json";
import fullDatabase from "../../../data/research/gallantry-database.json";
import canonicalDetails from "../../../data/research/gallantry-canonical-details.json";
import { formatDisplayDate } from "@/lib/domain/dates";

export const RESEARCHED_AWARDS = [
  "Param Vir Chakra",
  "Maha Vir Chakra",
  "Vir Chakra",
  "Ashoka Chakra",
  "Kirti Chakra",
  "Shaurya Chakra",
] as const;

export type ResearchedAward = (typeof RESEARCHED_AWARDS)[number];

export type GallantryBibliographyEntry = {
  title: string;
  url: string | null;
};

export type GallantryAwardee = {
  officialId: string;
  name: string;
  award: ResearchedAward;
  awardSlug: string;
  actionDate: string;
  actionYear: string;
  posthumous: boolean | null;
  service: string | null;
  serviceNumber: string | null;
  rank: string | null;
  unit: string;
  warOperationBattle: string | null;
  residentOf: string | null;
  parentage: string[];
  photoUrl: string | null;
  birthDate: string | null;
  deathDate: string | null;
  serviceEntryDate: string | null;
  awardedDate: string | null;
  biography: string | null;
  citationDetails: string | null;
  sourceUrl: string;
  profileUrls: string[];
  citationUrls: string[];
  bibliography: GallantryBibliographyEntry[];
};

type FullDatabaseRow = {
  Award: string;
  Name: string;
  Rank: string;
  Unit: string;
  Year: string;
  Citation: string;
  "Photo URL": string;
  "Birth Date": string;
  "Death Date": string;
  "Service Entry Date": string;
  "Gallantry Action Date": string;
  "Awarded Date": string;
  Biography: string;
  "Citation Details": string;
  "Official Awardee URL": string;
  "Profile PDF URL": string;
  "Citation Source URL": string;
  "Source URLs": string;
};

type ResearchDataset = {
  schemaVersion: number;
  generatedAt: string;
  source: {
    title: string;
    publisher: string;
    url: string;
    scope: string;
  };
  counts: Record<ResearchedAward, number>;
  recordCounts: Record<ResearchedAward, number>;
  awardees: GallantryAwardee[];
};

const legacyResearch = research as ResearchDataset;
const databaseRows = fullDatabase as FullDatabaseRow[];
const canonicalDetailRows = canonicalDetails as Record<string, Record<string, string>>;
const knownAward = (value: string | null | undefined): value is ResearchedAward => RESEARCHED_AWARDS.includes(value as ResearchedAward);

function usable(value: string | null | undefined): string | null {
  const normalised = value?.trim();
  return normalised && !["N/A", "NOT DOCUMENTED", "CITATION NOT AVAILABLE"].includes(normalised.toUpperCase()) ? normalised : null;
}

function normaliseDate(value: string | null | undefined): string | null {
  const input = usable(value);
  if (!input) return null;
  const legacy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(input);
  if (legacy) return `${legacy[3]}-${legacy[2]}-${legacy[1]}`;
  const iso = /^(\d{4}-\d{2}-\d{2})(?:T.*)?$/.exec(input);
  return iso?.[1] ?? (/^\d{4}$/.test(input) ? input : input);
}

function dateYear(value: string | null): string | null {
  const year = value?.match(/^(?:19|20)\d{2}/)?.[0];
  return year ?? null;
}

function officialIdFromUrl(value: string | null | undefined): string | null {
  return value?.match(/\/awardee\/([^/?#]+)/)?.[1] ?? null;
}

function officialUrls(value: string | null | undefined): string[] {
  return value?.split(";").map((url) => url.trim()).filter((url) => /^https:\/\/gallantryawards\.gov\.in\//.test(url)) ?? [];
}

function bestDatabaseRows(): Map<string, FullDatabaseRow> {
  const rows = new Map<string, FullDatabaseRow>();
  for (const row of databaseRows) {
    const id = officialIdFromUrl(row["Official Awardee URL"]);
    if (!id) continue;
    const current = rows.get(id);
    const score = (candidate: FullDatabaseRow) => [candidate.Biography, candidate["Citation Details"], candidate["Profile PDF URL"], candidate["Photo URL"]]
      .filter((value) => usable(value)).reduce((total, value) => total + value.length, 0);
    if (!current || score(row) > score(current)) rows.set(id, row);
  }
  return rows;
}

function mergeUrls(...values: Array<string | null | undefined>): string[] {
  return [...new Set(values.flatMap(officialUrls))];
}

function buildAwardees(): GallantryAwardee[] {
  const databaseById = bestDatabaseRows();
  const legacyById = new Map(legacyResearch.awardees.map((awardee) => [awardee.officialId, awardee]));
  const ids = new Set([...databaseById.keys(), ...legacyById.keys()]);

  return [...ids].flatMap((officialId) => {
    const row = databaseById.get(officialId);
    const legacy = legacyById.get(officialId);
    const detail = canonicalDetailRows[officialId];
    const award = knownAward(row?.Award) ? row.Award : legacy?.award;
    if (!award) return [];
    const value = (rowKey: keyof FullDatabaseRow, detailKey = rowKey) => usable(row?.[rowKey]) ?? usable(detail?.[detailKey]);
    const actionDate = normaliseDate(value("Gallantry Action Date")) ?? normaliseDate(legacy?.actionDate) ?? "Not documented";
    const biography = value("Biography");
    const citationDetails = value("Citation Details");
    const sourceUrl = value("Official Awardee URL") ?? usable(detail?.["Official Awardee URL"]) ?? legacy?.sourceUrl ?? `https://gallantryawards.gov.in/awardee/${officialId}`;
    const actionYear = dateYear(actionDate) ?? value("Year") ?? legacy?.actionYear ?? "Year not documented";
    const posthumous = legacy?.posthumous ?? (/posthumous|martyred|killed in action/i.test(`${detail?.["Award / Date of Action"] ?? ""} ${biography ?? ""} ${citationDetails ?? ""}`) ? true : null);
    const profileUrls = mergeUrls(value("Profile PDF URL"), legacy?.profileUrls.join(";"));
    const citationUrls = mergeUrls(value("Citation"), value("Citation Source URL"), detail?.["Citation PDF URL"], legacy?.citationUrls.join(";"));
    const parentage = legacy?.parentage?.length ? legacy.parentage : [detail?.["Son Of"], detail?.["Daughter Of"], detail?.["Mother's Name"]].filter((item): item is string => Boolean(usable(item)));

    return [{
      officialId,
      name: value("Name") ?? legacy?.name ?? "Name not documented",
      award,
      awardSlug: award.toLowerCase().replaceAll(" ", "-"),
      actionDate,
      actionYear,
      posthumous,
      service: legacy?.service ?? usable(detail?.Service),
      serviceNumber: legacy?.serviceNumber ?? usable(detail?.["Service Number"]),
      rank: value("Rank") ?? legacy?.rank ?? null,
      unit: value("Unit") ?? legacy?.unit ?? "N/A",
      warOperationBattle: legacy?.warOperationBattle ?? usable(detail?.["War/Operation/Battle"]),
      residentOf: legacy?.residentOf ?? usable(detail?.["Resident Of"]),
      parentage,
      photoUrl: value("Photo URL"),
      birthDate: normaliseDate(value("Birth Date")),
      deathDate: normaliseDate(value("Death Date")),
      serviceEntryDate: normaliseDate(value("Service Entry Date")),
      awardedDate: normaliseDate(value("Awarded Date")),
      biography,
      citationDetails,
      sourceUrl,
      profileUrls,
      citationUrls,
      bibliography: legacy?.bibliography ?? [],
    } satisfies GallantryAwardee];
  });
}

const awardees = buildAwardees();
const countByAward = (rows: GallantryAwardee[]) => Object.fromEntries(RESEARCHED_AWARDS.map((award) => [award, rows.filter((row) => row.award === award).length])) as Record<ResearchedAward, number>;
const recordCounts = Object.fromEntries(RESEARCHED_AWARDS.map((award) => [award, databaseRows.filter((row) => row.Award === award).length])) as Record<ResearchedAward, number>;

export const gallantryResearch: ResearchDataset = {
  schemaVersion: 2,
  generatedAt: legacyResearch.generatedAt,
  source: {
    title: "Gallantry Awards official directory",
    publisher: "Ministry of Defence, Government of India",
    url: "https://gallantryawards.gov.in/awards",
    scope: "Unique official awardee profiles merged from the enriched full directory snapshot; source-row totals are retained separately.",
  },
  counts: countByAward(awardees),
  recordCounts,
  awardees,
};

const PVC_STORIES: Record<string, { title: string; body: string }> = {
  "1045": {
    title: "The defence of Tain Dhar",
    body: "At Tain Dhar near Naushera in February 1948, Jadunath Singh led his section through repeated attacks. The official citation records that, after most of the post had been killed or wounded, he left cover for a final counter-attack before being fatally hit.",
  },
  "1049": {
    title: "The delaying stand at Badgam",
    body: "Major Somnath Sharma deployed with 4 Kumaon despite a fractured arm. At Badgam on 3 November 1947, he moved between positions while his outnumbered company held the approach to Srinagar airfield, buying time for reinforcements before he was killed by a mortar burst.",
  },
  "1051": {
    title: "A road opened under fire",
    body: "During the 1948 advance to Rajouri, Rama Raghoba Rane repeatedly cleared mines and roadblocks while exposed to fire. His engineers kept armour and guns moving through the Naushera–Rajouri axis, turning obstacle clearance into the essential first move of the advance.",
  },
  "1053": {
    title: "Successive positions at Tithwal",
    body: "Company Havildar Major Piru Singh continued forward after his company suffered severe casualties in the Tithwal sector. Wounded more than once, he attacked successive machine-gun positions and was killed at the final trench.",
  },
  "5036": {
    title: "Holding Richhmar Gali",
    body: "Karam Singh helped hold a forward post in the Tithwal sector through repeated attacks in October 1948. Though wounded, he moved between trenches, encouraged the defenders and personally challenged attackers who entered the position.",
  },
  "1054": {
    title: "The roadblock at Elizabethville",
    body: "Serving with the UN mission in the Congo in 1961, Gurbachan Singh Salaria led a small force against a roadblock threatening UN headquarters. The official record credits the charge with breaking a numerically larger force; he died of his wounds after the action.",
  },
  "1055": {
    title: "Sirijap post on Pangong Lake",
    body: "Dhan Singh Thapa commanded the isolated Sirijap post during the October 1962 fighting. His men resisted repeated assaults and close combat after artillery and mortar fire had cut the position off; he survived and was later repatriated from captivity.",
  },
  "1056": {
    title: "Three attacks at Tongpeng La",
    body: "At Tongpeng La in October 1962, Joginder Singh’s platoon repelled repeated attacks despite casualties and dwindling ammunition. Wounded in the thigh, he continued directing fire and led a bayonet charge before being taken prisoner; he later died in captivity.",
  },
  "1057": {
    title: "Moving between the platoons at Rezang La",
    body: "Major Shaitan Singh crossed exposed ground between the isolated platoon positions of C Company, 13 Kumaon, during the defence of Rezang La. Severely wounded, he continued directing the battle and ordered his men to leave him rather than risk more lives carrying him out.",
  },
  "1058": {
    title: "The recoilless rifle at Asal Uttar",
    body: "Abdul Hamid used a jeep-mounted recoilless rifle against opposing armour during the Battle of Asal Uttar in September 1965. He changed positions between engagements and continued firing under tank fire until his vehicle was struck and he was killed.",
  },
  "1059": {
    title: "Armour leadership in the Phillora sector",
    body: "Ardeshir Tarapore led the Poona Horse through the armoured fighting around Phillora and Chawinda in September 1965. Although wounded, he remained with the regiment through several days of combat before being killed by shell fire.",
  },
  "1062": {
    title: "The bunkers at Gangasagar",
    body: "During the 1971 assault at Gangasagar, Albert Ekka attacked positions holding up his company. Despite serious wounds, he cleared a bunker and then silenced a medium machine gun from close range before succumbing to his injuries.",
  },
  "3432": {
    title: "Air defence over Srinagar",
    body: "Flying Officer Nirmal Jit Singh Sekhon scrambled from Srinagar during an air raid on 14 December 1971. The official record describes him engaging the attacking aircraft despite the odds; his Gnat was lost in the action.",
  },
  "1060": {
    title: "The counter-attack at Basantar",
    body: "Second Lieutenant Arun Khetarpal took his troop forward to reinforce the bridgehead during the Battle of Basantar. After his tank was hit, he continued engaging opposing armour and declined to withdraw while the position remained threatened.",
  },
  "1061": {
    title: "Holding Jarpal",
    body: "Major Hoshiar Singh led his company in the capture and defence of Jarpal in the Basantar sector. Wounded during counter-attacks, he moved among the trenches and later manned a machine gun after its crew was hit.",
  },
  "1064": {
    title: "The assault on Quaid Post",
    body: "In June 1987, Bana Singh led the final assault on the high-altitude post later renamed in his honour. His party climbed through severe weather, approached by a difficult route and cleared the position at close quarters.",
  },
  "1063": {
    title: "An ambush during Operation Pawan",
    body: "Major Ramaswamy Parameswaran was returning from a search mission in Sri Lanka when his column was ambushed in November 1987. Though shot, he engaged the attacker, took control of the situation and continued directing his command before dying of his wounds.",
  },
  "1066": {
    title: "The approach to Khalubar",
    body: "Captain Manoj Kumar Pandey led successive attacks on positions during the advance to Khalubar in July 1999. The official account records him clearing bunkers despite wounds and pressing the assault until he was fatally hit.",
  },
  "1065": {
    title: "From Point 5140 to Point 4875",
    body: "Captain Vikram Batra led the capture of Point 5140 and later went forward at Point 4875 to support another company. During the latter action he continued leading from the front and was killed while the contested position was being secured.",
  },
  "1068": {
    title: "The climb to Tiger Hill",
    body: "Yogendra Singh Yadav climbed the exposed approach to Tiger Hill with the assault group in July 1999. Hit by multiple bullets, he continued to the objective and attacked positions that were preventing the rest of the platoon from advancing.",
  },
  "1067": {
    title: "The machine-gun post at Flat Top",
    body: "During the attack on Flat Top in July 1999, Sanjay Kumar advanced on a machine-gun position that had stopped his section. Wounded, he reached the post, used a captured weapon and continued toward a second position.",
  },
};

function normaliseName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:late|retd|honorary|hony|then|captain|capt|major|maj|lieutenant|lt|colonel|col|subedar|sub|naib|company|havildar|quarter|master|lance|naik|rifleman|flying|officer|shri|smt)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function displayAwardeeName(value: string): string {
  const prefixes = [
    "company quarter master havildar",
    "company havildar major",
    "lieutenant colonel",
    "subedar major",
    "second lieutenant",
    "squadron leader",
    "flying officer",
    "honorary captain",
    "honorary lieutenant",
    "naib subedar",
    "quarter master havildar",
    "wing commander",
    "lance naik",
    "captain",
    "major",
    "subedar",
    "havildar",
    "lieutenant",
    "colonel",
    "brigadier",
    "general",
    "naik",
    "rifleman",
    "sergeant",
    "constable",
    "inspector",
    "late shri",
    "late",
    "shri",
    "smt",
    "mr",
    "mrs",
    "ms",
  ];
  let cleaned = value.replace(/\s+/g, " ").trim();
  cleaned = cleaned.replace(/^\d+\s*\/\s*(?:lt|l\/?nk|nk|sep)\.?\s+/i, "");
  let changed = true;
  while (changed && cleaned) {
    changed = false;
    const parenthetical = /^\([^)]*\)\s*/.exec(cleaned);
    if (parenthetical) {
      cleaned = cleaned.slice(parenthetical[0].length).trim();
      changed = true;
      continue;
    }
    const lower = cleaned.toLocaleLowerCase("en-IN");
    const prefix = prefixes.find((candidate) => lower === candidate || lower.startsWith(`${candidate} `) || lower.startsWith(`${candidate}(`));
    if (prefix) {
      cleaned = cleaned.slice(prefix.length).replace(/^[\s,./-]+/, "").trim();
      changed = true;
    }
  }
  return cleaned
    .toLocaleLowerCase("en-IN")
    .replace(/(^|[\s.-])([a-z])/g, (_, boundary: string, letter: string) => `${boundary}${letter.toUpperCase()}`)
    .replace(/\bIi\b/g, "II")
    .replace(/\bIaf\b/g, "IAF")
    .replace(/\bIps\b/g, "IPS");
}

export function getAwardBySlug(slug: string): ResearchedAward | null {
  return RESEARCHED_AWARDS.find((award) => award.toLowerCase().replaceAll(" ", "-") === slug) ?? null;
}

export function getAwardees(award?: ResearchedAward): GallantryAwardee[] {
  return gallantryResearch.awardees
    .filter((awardee) => !award || awardee.award === award)
    .slice()
    .sort((left, right) => Number(right.actionYear) - Number(left.actionYear) || left.name.localeCompare(right.name));
}

export function groupAwardeesByYear(award: ResearchedAward): Array<{ year: string; awardees: GallantryAwardee[] }> {
  const groups = new Map<string, GallantryAwardee[]>();
  for (const awardee of getAwardees(award)) groups.set(awardee.actionYear, [...(groups.get(awardee.actionYear) ?? []), awardee]);
  return [...groups].map(([year, awardees]) => ({ year, awardees }));
}

export function getAwardeeById(officialId: string): GallantryAwardee | null {
  return gallantryResearch.awardees.find((awardee) => awardee.officialId === officialId) ?? null;
}

export function findAwardeeByName(name: string): GallantryAwardee | null {
  const needle = normaliseName(name);
  return gallantryResearch.awardees.find((awardee) => {
    const candidate = normaliseName(awardee.name);
    return candidate === needle || candidate.endsWith(needle) || needle.endsWith(candidate);
  }) ?? null;
}

export function getAwardeeStory(awardee: GallantryAwardee): { title: string; body: string } {
  return PVC_STORIES[awardee.officialId] ?? {
    title: "Official award record",
    body: `The Ministry of Defence records ${displayAwardeeName(awardee.name)} as a ${awardee.award} recipient${awardee.rank ? `, serving as ${awardee.rank}` : ""}${awardee.unit !== "N/A" ? ` with ${awardee.unit}` : ""}. The official profile and citation links below preserve the published account; some counter-insurgency citations are withheld or abbreviated for security reasons.`,
  };
}

function published(value: string | null | undefined): value is string {
  return Boolean(value?.trim() && value.trim().toUpperCase() !== "N/A");
}

export function getAwardeeBiography(awardee: GallantryAwardee): string {
  if (published(awardee.biography)) return awardee.biography;
  const name = displayAwardeeName(awardee.name);
  const sentences = [
    `The Ministry of Defence Gallantry Awards record identifies ${name} as a recipient of the ${awardee.award} for an action dated ${formatDisplayDate(awardee.actionDate)}${awardee.posthumous ? "; the award is recorded posthumously" : ""}.`,
  ];
  if (published(awardee.rank) || published(awardee.service) || published(awardee.unit)) {
    const role = [
      published(awardee.rank) ? `served as ${awardee.rank}` : null,
      published(awardee.service) ? `in the ${awardee.service}` : null,
      published(awardee.unit) ? `with ${awardee.unit}` : null,
    ].filter(Boolean).join(" ");
    sentences.push(`The official service fields state that ${name} ${role}.`);
  }
  if (published(awardee.warOperationBattle)) sentences.push(`The directory associates the action with ${awardee.warOperationBattle}.`);
  return sentences.join(" ");
}
