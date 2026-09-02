import * as React from "react";
import { Badge } from "./ui/badge";
import { CheckCircle2, AlertTriangle, HelpCircle, FileText } from "lucide-react";

export type VerificationStatus =
  | "OFFICIALLY_CONFIRMED"
  | "MULTIPLE_CREDIBLE_SOURCES"
  | "DISPUTED"
  | "UNVERIFIED"
  | "DECLASSIFIED_RECORD"
  | "SOURCE_CONFLICT";

export type SourceTier = "A" | "B" | "C" | "D" | "DISCOVERY";

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  let icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let label = status.replace(/_/g, " ");

  switch (status) {
    case "OFFICIALLY_CONFIRMED":
    case "DECLASSIFIED_RECORD":
      variant = "default";
      icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
      break;
    case "MULTIPLE_CREDIBLE_SOURCES":
      variant = "secondary";
      icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
      break;
    case "DISPUTED":
    case "SOURCE_CONFLICT":
      variant = "destructive";
      icon = <AlertTriangle className="w-3 h-3 mr-1" />;
      break;
    case "UNVERIFIED":
      variant = "outline";
      icon = <HelpCircle className="w-3 h-3 mr-1 text-muted-foreground" />;
      break;
  }

  return (
    <Badge variant={variant} className="text-[10px] tracking-wider uppercase font-medium">
      {icon}
      {label}
    </Badge>
  );
}

export function SourceBadge({ tier, label }: { tier: SourceTier; label?: string }) {
  let variant: "default" | "secondary" | "outline" = "outline";
  
  if (tier === "A") variant = "default";
  if (tier === "B" || tier === "C") variant = "secondary";

  return (
    <Badge variant={variant} className="text-[10px] tracking-wider uppercase font-medium bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border-border/50">
      <FileText className="w-3 h-3 mr-1" />
      TIER {tier}{label ? ` - ${label}` : ""}
    </Badge>
  );
}
