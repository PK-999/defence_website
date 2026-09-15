import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.SENTINEL_TEST_RUN === "1" ? ".next-test" : ".next",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "gallantryawards.gov.in", pathname: "/assets/uploads/**" },
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./prisma/dev.db", "./prisma/dev.db.gz", "./data/research/*.json"],
  },
  async redirects() {
    return [
      {
        source: '/history/:slug*',
        destination: '/conflicts/:slug*',
        permanent: true,
      },
      { source: '/people/:slug*', destination: '/heroes/:slug*', permanent: true },
      { source: '/equipment/:slug*', destination: '/arsenal/:slug*', permanent: true },
      { source: '/sources/:slug*', destination: '/archive/:slug*', permanent: true },
    ]
  },
};

export default nextConfig;
