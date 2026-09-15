import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";

const BASE_URL = "https://gallantryawards.gov.in";
const OUTPUT_PATH = path.resolve("data/research/gallantry-awardees.json");

type AwardDefinition = {
  id: number;
  name: "Param Vir Chakra" | "Ashoka Chakra";
  slug: "param-vir-chakra" | "ashoka-chakra";
};

type ListingItem = {
  id: string;
  image: string;
  name: string;
  category_title: string;
};

type SearchResponse = {
  total_records: number;
  total_pages: number;
  current_page: number;
  data: ListingItem[];
};

type AwardeeResearchRecord = {
  officialId: string;
  name: string;
  award: AwardDefinition["name"];
  awardSlug: AwardDefinition["slug"];
  actionDate: string | null;
  actionYear: string | null;
  posthumous: boolean;
  service: string | null;
  serviceNumber: string | null;
  rank: string | null;
  unit: string | null;
  warOperationBattle: string | null;
  residentOf: string | null;
  parentage: string[];
  sourceUrl: string;
  profileUrls: string[];
  citationUrls: string[];
  bibliography: Array<{ title: string; url: string | null }>;
};

const AWARDS: AwardDefinition[] = [
  { id: 8, name: "Param Vir Chakra", slug: "param-vir-chakra" },
  { id: 11, name: "Ashoka Chakra", slug: "ashoka-chakra" },
];

function cleanText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function absoluteUrl(value: string): string {
  return new URL(value, BASE_URL).toString();
}

async function fetchText(url: string, init?: RequestInit): Promise<{ response: Response; text: string }> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          "User-Agent": "SENTINEL historical research (source capture; contact via repository owner)",
          ...(init?.headers ?? {}),
        },
        signal: AbortSignal.timeout(45_000),
      });
      if (!response.ok) throw new Error(`HTTP_${response.status}:${url}`);
      return { response, text: await response.text() };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}

async function createSearchSession(): Promise<{ csrf: string; cookie: string }> {
  const { response, text } = await fetchText(`${BASE_URL}/awardees`);
  const csrf = text.match(/var csrfHash = '([^']+)'/)?.[1];
  if (!csrf) throw new Error("GALLANTRY_CSRF_NOT_FOUND");
  const cookie = response.headers.getSetCookie().map((value) => value.split(";", 1)[0]).join("; ");
  return { csrf, cookie };
}

async function searchAward(categoryId: number, page: number, session: { csrf: string; cookie: string }): Promise<SearchResponse> {
  const body = new URLSearchParams({
    csrf_test_name: session.csrf,
    orderby: "asc",
    sortby: "name",
    title: "",
    awards: "",
    category: "",
    year: "",
    id: String(categoryId),
    page: page === 1 ? "" : String(page),
    height: "240",
  });
  const { text } = await fetchText(`${BASE_URL}/ajax_data/loadsearchdata`, {
    method: "POST",
    headers: {
      Cookie: session.cookie,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
    },
    body,
  });
  return JSON.parse(text) as SearchResponse;
}

async function listAwardees(award: AwardDefinition): Promise<ListingItem[]> {
  const session = await createSearchSession();
  const first = await searchAward(award.id, 1, session);
  const pages = [first];
  for (let page = 2; page <= first.total_pages; page += 1) pages.push(await searchAward(award.id, page, session));
  const rows = pages.flatMap((item) => item.data);
  if (rows.length !== first.total_records) throw new Error(`AWARDEE_COUNT_MISMATCH:${award.name}:${rows.length}:${first.total_records}`);
  return rows;
}

function tableDetails(document: Document): Map<string, string> {
  const details = new Map<string, string>();
  for (const row of document.querySelectorAll("#tabAllChakra0 tr")) {
    const cells = [...row.querySelectorAll("td")].map((cell) => cleanText(cell.textContent));
    if (cells.length >= 2 && cells[0] && cells[1]) details.set(cells[0].toLowerCase(), cells[1]);
  }
  return details;
}

function detailValue(details: Map<string, string>, label: RegExp): string | null {
  for (const [key, value] of details) if (label.test(key)) return value || null;
  return null;
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function extractActionDate(value: string | null): string | null {
  if (!value) return null;
  return value.match(/\b\d{1,2}-\d{1,2}-\d{4}\b/)?.[0]
    ?? value.match(/\b\d{1,2}\s+[A-Za-z]+\s+\d{4}\b/)?.[0]
    ?? null;
}

async function researchAwardee(item: ListingItem, award: AwardDefinition): Promise<AwardeeResearchRecord> {
  const sourceUrl = `${BASE_URL}/awardee/${encodeURIComponent(item.id)}`;
  const { text } = await fetchText(sourceUrl);
  const document = new JSDOM(text).window.document;
  const details = tableDetails(document);
  const awardAndDate = detailValue(details, /award.*date of action/);
  const actionDate = extractActionDate(awardAndDate);
  const parentage = [
    detailValue(details, /^son of$/),
    detailValue(details, /^daughter of$/),
    detailValue(details, /mother'?s name/),
  ].filter((value): value is string => Boolean(value));
  const profileUrls = unique([...document.querySelectorAll("#tabProfile iframe, #tabProfile a")]
    .map((element) => element.getAttribute("src") ?? element.getAttribute("href") ?? "")
    .filter((value) => value && !value.startsWith("#"))
    .map(absoluteUrl));
  const citationUrls = unique([...document.querySelectorAll("#tabParam1 img, #tabParam1 a, #ci iframe, #ci a")]
    .map((element) => element.getAttribute("src") ?? element.getAttribute("href") ?? "")
    .filter((value) => value && !value.startsWith("#"))
    .map(absoluteUrl));
  const bibliography = [...document.querySelectorAll("#tabbib li")].map((element) => ({
    title: cleanText(element.textContent),
    url: element.querySelector("a")?.getAttribute("href")?.trim() || null,
  })).filter((entry) => entry.title);

  return {
    officialId: item.id,
    name: cleanText(document.querySelector(".card-title")?.textContent) || cleanText(item.name).replace(/\.{3,}$/, ""),
    award: award.name,
    awardSlug: award.slug,
    actionDate,
    actionYear: actionDate?.match(/\d{4}/)?.[0] ?? null,
    posthumous: /posthumous/i.test(awardAndDate ?? ""),
    service: detailValue(details, /^service$/),
    serviceNumber: detailValue(details, /service number/),
    rank: detailValue(details, /^rank$/),
    unit: detailValue(details, /unit.*regiment.*corps/),
    warOperationBattle: detailValue(details, /war.*operation.*battle/),
    residentOf: detailValue(details, /resident of/),
    parentage,
    sourceUrl,
    profileUrls,
    citationUrls,
    bibliography,
  };
}

async function mapWithConcurrency<T, R>(values: T[], concurrency: number, task: (value: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(values.length);
  let cursor = 0;
  async function worker(): Promise<void> {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(values[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, () => worker()));
  return results;
}

async function isReachableAsset(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "SENTINEL historical research (source-link verification)" },
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    await response.body?.cancel();
    return response.ok;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const awardees: AwardeeResearchRecord[] = [];
  for (const award of AWARDS) {
    const listing = await listAwardees(award);
    const researched = await mapWithConcurrency(listing, 4, (item) => researchAwardee(item, award));
    awardees.push(...researched);
  }
  const assets = unique(awardees.flatMap((item) => [...item.profileUrls, ...item.citationUrls]));
  const assetChecks = await mapWithConcurrency(assets, 10, async (url) => [url, await isReachableAsset(url)] as const);
  const reachableAssets = new Set(assetChecks.filter(([, reachable]) => reachable).map(([url]) => url));
  for (const awardee of awardees) {
    awardee.profileUrls = awardee.profileUrls.filter((url) => reachableAssets.has(url));
    awardee.citationUrls = awardee.citationUrls.filter((url) => reachableAssets.has(url));
  }
  const counts = Object.fromEntries(AWARDS.map((award) => [award.name, awardees.filter((item) => item.award === award.name).length]));
  if (counts["Param Vir Chakra"] !== 21 || counts["Ashoka Chakra"] !== 98) {
    throw new Error(`CANONICAL_COUNT_MISMATCH:${JSON.stringify(counts)}`);
  }
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify({
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      title: "Gallantry Awards",
      publisher: "Ministry of Defence, Government of India",
      url: `${BASE_URL}/awards`,
      scope: "Canonical Param Vir Chakra and Ashoka Chakra recipient records, including official detail, profile and citation links when published.",
    },
    counts,
    awardees,
  }, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({
    output: OUTPUT_PATH,
    counts,
    profiles: awardees.filter((item) => item.profileUrls.length > 0).length,
    citations: awardees.filter((item) => item.citationUrls.length > 0).length,
    unreachableAssetsOmitted: assets.length - reachableAssets.size,
  }, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
