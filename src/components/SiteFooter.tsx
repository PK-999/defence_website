import * as React from "react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { secondaryNavigation } from "@/lib/navigation";
import { Shield, Radio, Terminal } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-primary/20 bg-[#030906] py-10 mt-16 relative overflow-hidden text-xs">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="container mx-auto px-4 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-mono font-bold text-sm tracking-widest text-primary glow-text-primary">
                SENTINEL
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                SYSTEM VER 5.1
              </span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              A futuristic, open-source digital intelligence wiki and archive documenting the Indian Armed Forces, historical conflicts, gallantry heroes, military commands, and defence technology.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-primary/80 pt-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              <span>TRANSMISSION COMPLETE · OPEN ACCESS EDUCATION ARCHIVE</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-mono font-semibold tracking-widest text-primary uppercase flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Directives
            </h4>
            <ul className="space-y-2 text-muted-foreground font-mono">
              {secondaryNavigation.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors flex items-center gap-1">
                    <span className="text-primary/50">{">"}</span> {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/intel" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="text-primary/50">{">"}</span> Intel Ledger
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-mono font-semibold tracking-widest text-primary uppercase flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              Source Integrity
            </h4>
            <div className="p-3 bg-card/60 rounded border border-primary/20 space-y-1.5">
              <p className="font-medium text-foreground text-[11px]">Primary Source Grounding</p>
              <p className="text-muted-foreground text-[10px] leading-relaxed">
                Records ground in official gazette notifications, Ministry of Defence publications, historical archives, and parliamentary records.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6 opacity-20 border-primary/20" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-muted-foreground font-mono text-[11px]">
          <p>© {new Date().getFullYear()} SENTINEL DEFENCE ARCHIVE. For public education and historical preservation.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
