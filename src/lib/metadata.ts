import type { Metadata } from "next";
import { absoluteSiteUrl, parseSiteUrl } from "@/lib/config";

export function publicMetadata(input: { title: string; description?: string | null; pathname: string }): Metadata {
  const description = input.description?.trim() || "A source-first interactive digital archive of India's military history.";
  const canonical = absoluteSiteUrl(input.pathname);
  return {
    title: `${input.title} | SENTINEL`,
    description,
    metadataBase: parseSiteUrl(process.env.SITE_URL),
    alternates: { canonical },
    openGraph: { title: input.title, description, url: canonical, siteName: "SENTINEL Indian Defence Archive", type: "article" },
  };
}
