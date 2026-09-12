export type SiteEnvironment = "development" | "test" | "production";

function deploymentUrl(raw: string | undefined): string | undefined {
  const explicit = raw?.trim();
  if (explicit) return explicit;
  const vercelUrl = process.env.VERCEL_URL?.trim();
  return vercelUrl ? `https://${vercelUrl}` : undefined;
}

export function parseSiteUrl(raw: string | undefined, environment: SiteEnvironment = (process.env.NODE_ENV as SiteEnvironment) || "development"): URL {
  const value = deploymentUrl(raw);
  if (!value) {
    if (environment === "production") throw new Error("SITE_URL is required in production.");
    return new URL("http://localhost:3000/");
  }
  let url: URL;
  try { url = new URL(value); } catch { throw new Error("SITE_URL must be a valid absolute URL."); }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("SITE_URL must use http or https.");
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
}

export function absoluteSiteUrl(pathname: string, raw = process.env.SITE_URL, environment: SiteEnvironment = (process.env.NODE_ENV as SiteEnvironment) || "development"): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, parseSiteUrl(raw, environment)).toString();
}
