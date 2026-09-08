// @ts-expect-error Prisma 5.22's config type omits the skills extension used by this repository.
import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});
