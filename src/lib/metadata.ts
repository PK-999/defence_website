import type { Metadata } from "next";

export function publicMetadata({
  title,
  description,
  pathname,
}: {
  title: string;
  description?: string | null;
  pathname?: string;
}): Metadata {
  const pageTitle = title.includes("SENTINEL") ? title : `${title} | SENTINEL`;
  const desc = description || "SENTINEL — The Indian Armed Forces Historical and Operational Intelligence Archive.";

  return {
    title: pageTitle,
    description: desc,
    openGraph: {
      title: pageTitle,
      description: desc,
      url: pathname,
      siteName: "SENTINEL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
    },
  };
}
