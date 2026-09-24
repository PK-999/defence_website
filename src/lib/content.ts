import { getPublicConflict, getPublicOperation } from "@/lib/repositories/entities";

export async function getConflict(slug: string) {
  return getPublicConflict(slug);
}

export async function getOperation(slug: string) {
  return getPublicOperation(slug);
}
