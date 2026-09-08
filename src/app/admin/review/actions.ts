"use server";

import { prisma } from "@/lib/content";
import { revalidatePath } from "next/cache";
import { reviewClaim } from "@/lib/review/service";
import type { VerificationStatus } from "@/lib/domain/types";

export async function approveClaim(claimId: string, expectedRevision: number, verificationStatus: VerificationStatus, reason: string) {
  const result = await reviewClaim({ claimId, expectedRevision, decision: "APPROVE", verificationStatus, reason }, { client: prisma });
  if (result.success) revalidatePath("/admin/review");
  return result;
}

export async function rejectClaim(claimId: string, expectedRevision: number, reason: string) {
  const result = await reviewClaim({ claimId, expectedRevision, decision: "REJECT", reason }, { client: prisma });
  if (result.success) revalidatePath("/admin/review");
  return result;
}
