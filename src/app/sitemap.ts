import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/lib/config";
import { entityRoutes, type EntityType } from "@/lib/domain/entities";
import { getPublicSlugs } from "@/lib/repositories/entities";

export const dynamic = "force-dynamic";

const staticPaths = ["/", "/about", "/editorial-policy", "/methodology", "/conflicts", "/operations", "/heroes", "/arsenal", "/forces", "/archive", "/graph", "/compare"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entityTypes: EntityType[] = ["Conflict", "Operation", "Person", "Equipment", "Unit", "Source"];
  const entityPaths = (await Promise.all(entityTypes.map(async (type) => (await getPublicSlugs(type)).map((slug) => `${entityRoutes[type]}/${encodeURIComponent(slug)}`)))).flat();
  return [...new Set([...staticPaths, ...entityPaths])].map((pathname) => ({ url: absoluteSiteUrl(pathname) }));
}
