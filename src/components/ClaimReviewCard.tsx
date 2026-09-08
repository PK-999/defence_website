"use client";

import { useState } from "react";
import { Check, X, ShieldAlert, Loader2 } from "lucide-react";
import { approveClaim, rejectClaim } from "@/app/admin/review/actions";
import type { VerificationStatus } from "@/lib/domain/types";

type ClaimEvidence = { evidence: { quote: string | null; locator: string | null; authorityType: string; authorityBasis: string | null; sourceVersion: { versionTag: string; source: { title: string; publisher: string | null; author: string | null; slug: string } } } };
type ReviewClaim = {
  id: string;
  status: string;
  entityType: string;
  entityId: string;
  property: string;
  value: string;
  revision: number;
  evidence?: ClaimEvidence[];
};

export function ClaimReviewCard({ claim }: { claim: ReviewClaim }) {
  const [isPending, setIsPending] = useState(false);
  const [reason, setReason] = useState("Reviewed against the linked source evidence and recorded for editorial accountability.");
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("MULTIPLE_CREDIBLE_SOURCES");
  const [message, setMessage] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsPending(true);
    try {
      const result = await approveClaim(claim.id, claim.revision, verificationStatus, reason);
      setMessage(result.success ? "Approved. The queue will refresh." : result.message);
    } catch { setMessage("The review could not be completed. Try again."); } finally { setIsPending(false); }
  };

  const handleReject = async () => {
    setIsPending(true);
    try {
      const result = await rejectClaim(claim.id, claim.revision, reason);
      setMessage(result.success ? "Rejected. The queue will refresh." : result.message);
    } catch { setMessage("The review could not be completed. Try again."); } finally { setIsPending(false); }
  };

  if (claim.status !== "CANDIDATE") return null;

  return (
    <div className="border border-border/40 bg-card rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50"></div>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-foreground">
            {claim.entityType} ID: {claim.entityId}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 font-mono">
            {claim.property}
          </span>
        </div>
        
        <div className="pl-8 flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Extracted Value:</span>
          <span className="font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{claim.value}</span>
        </div>

        {claim.evidence && claim.evidence.length > 0 && (
          <div className="pl-8 space-y-2 text-sm text-muted-foreground border-l-2 border-muted ml-8 pl-4">
            {claim.evidence.map(({ evidence }) => (
              <div key={`${evidence.sourceVersion.source.slug}:${evidence.locator}`}>
                {evidence.quote ? <p className="italic">&quot;{evidence.quote}&quot;</p> : <p className="italic">Quote hidden; inspect the cited locator.</p>}
                <div className="text-xs mt-1 font-mono text-primary/60">{evidence.sourceVersion.source.title} · {evidence.sourceVersion.versionTag} · Locator: {evidence.locator}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex flex-col gap-2 min-w-52">
          <label className="text-xs text-muted-foreground" htmlFor={`review-reason-${claim.id}`}>Review reason</label>
          <textarea id={`review-reason-${claim.id}`} value={reason} onChange={(event) => setReason(event.target.value)} rows={2} className="rounded border border-border bg-background px-2 py-1 text-xs" />
          <label className="text-xs text-muted-foreground" htmlFor={`verification-${claim.id}`}>Verification status</label>
          <select id={`verification-${claim.id}`} value={verificationStatus} onChange={(event) => setVerificationStatus(event.target.value as VerificationStatus)} className="rounded border border-border bg-background px-2 py-1 text-xs">
            <option value="OFFICIALLY_CONFIRMED">Officially confirmed</option>
            <option value="MULTIPLE_CREDIBLE_SOURCES">Multiple credible sources</option>
            <option value="DECLASSIFIED_RECORD">Declassified record</option>
            <option value="DISPUTED">Disputed</option>
            <option value="SOURCE_CONFLICT">Source conflict</option>
            <option value="UNVERIFIED">Unverified</option>
          </select>
        </div>
        <button 
          onClick={handleReject}
          disabled={isPending}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
          Reject
        </button>
        <button 
          onClick={handleApprove}
          disabled={isPending}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Approve (Gold)
        </button>
      </div>
      {message && <p role="status" className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
