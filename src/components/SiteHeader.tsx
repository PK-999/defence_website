"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Shield, Radar } from "lucide-react";
import { Button } from "./ui/button";
import { GlobalSearch } from "./GlobalSearch";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/lib/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { TacticalSoundToggle } from "./TacticalSoundToggle";
import { GlitchText } from "./GlitchText";

export function SiteHeader() {
  const pathname = usePathname();
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/25 bg-[#050d09]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[#050d09]/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 justify-between">
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded bg-primary/10 border border-primary/40 flex items-center justify-center group-hover:border-primary group-hover:shadow-[0_0_12px_rgba(131,214,92,0.4)] transition-all">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold tracking-widest text-base text-primary">
                <GlitchText text="SENTINEL" />
              </span>
              <span className="text-[8px] font-mono tracking-widest uppercase text-muted-foreground -mt-1 hidden sm:inline-block">
                DEFENCE ARCHIVE
              </span>
            </div>
          </Link>

          {/* Classification Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span>CLEARANCE: PUBLIC</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-mono font-medium">
            {primaryNavigation.map((link) => {
              const isActive = active(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-3 py-1.5 rounded transition-all uppercase tracking-wider ${
                    isActive
                      ? "text-primary bg-primary/10 font-semibold shadow-[0_0_10px_rgba(131,214,92,0.15)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary shadow-[0_0_6px_#83d65c]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex md:hidden mr-2">
          <Dialog>
            <DialogTrigger render={<Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" aria-label="Open navigation" />}>
              <Menu className="h-5 w-5" />
            </DialogTrigger>
            <DialogContent className="max-w-xs bg-card/95 border-primary/30 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="font-mono text-primary flex items-center gap-2">
                  <Radar className="w-4 h-4 text-primary animate-spin" />
                  ARCHIVE DIRECTORY
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-mono">
                  Select tactical intelligence channel
                </DialogDescription>
              </DialogHeader>
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1.5 mt-4 font-mono text-sm">
                {primaryNavigation.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active(link.href) ? "page" : undefined}
                    className={`rounded px-3 py-2 border transition-all flex items-center justify-between ${
                      active(link.href)
                        ? "bg-primary/15 text-primary border-primary/40 font-bold"
                        : "border-border/30 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-primary/50">{">"}</span>
                  </Link>
                ))}
              </nav>
            </DialogContent>
          </Dialog>
        </div>

        {/* Right: Search & Sound Controls */}
        <div className="flex items-center gap-2">
          <div className="w-full max-w-[200px] sm:max-w-xs">
            <GlobalSearch />
          </div>
          <TacticalSoundToggle />
        </div>
      </div>
    </header>
  );
}
