"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { GlobalSearch } from "./GlobalSearch";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/lib/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function SiteHeader() {
  const pathname = usePathname();
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block tracking-wider">
              SENTINEL
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium text-muted-foreground">
            {primaryNavigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active(link.href) ? "page" : undefined}
                className={`transition-colors hover:text-foreground/80 ${active(link.href) ? "text-foreground" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex md:hidden mr-4">
          <Dialog>
            <DialogTrigger render={<Button variant="ghost" size="icon" className="-ml-2" aria-label="Open navigation" />}>
              <Menu className="h-5 w-5" />
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader><DialogTitle>Site navigation</DialogTitle><DialogDescription>Browse the reviewed archive.</DialogDescription></DialogHeader>
              <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
                {primaryNavigation.map((link) => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined} className="rounded px-3 py-2 hover:bg-muted">{link.label}</Link>)}
              </nav>
            </DialogContent>
          </Dialog>
          <Link href="/" className="ml-4 flex items-center space-x-2">
            <span className="font-bold inline-block tracking-wider">SENTINEL</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <GlobalSearch />
          </div>
        </div>
      </div>
    </header>
  );
}
