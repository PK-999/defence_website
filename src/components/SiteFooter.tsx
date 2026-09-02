import * as React from "react";
import Link from "next/link";
import { Separator } from "./ui/separator";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-8 md:py-12 mt-12">
      <div className="container mx-auto px-4 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold tracking-wider">SENTINEL</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              A source-first interactive digital archive of India's military history, connecting conflicts, operations, people, units, and technology through verified public sources.
            </p>
            <div className="pt-2">
              <p className="text-xs font-medium text-primary">
                Independent educational archive. Not an official Government of India or Armed Forces website.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider">EDITORIAL</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">About the Archive</Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-foreground transition-colors">Editorial Policy</Link>
              </li>
              <li>
                <Link href="/sources" className="hover:text-foreground transition-colors">Source Classification</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider">TRUST</h4>
            <div className="p-4 bg-muted/30 rounded-md border border-border/40">
              <p className="text-sm font-medium">Every story should lead back to evidence.</p>
              <p className="text-xs text-muted-foreground mt-2">
                We rely exclusively on officially declassified records, primary government sources, and reputable historical texts.
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 opacity-40" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SENTINEL Indian Defence Archive. All content is for educational purposes.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
