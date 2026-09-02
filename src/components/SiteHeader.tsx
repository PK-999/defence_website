"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { GlobalSearch } from "./GlobalSearch";

const NAV_LINKS = [
  { name: "HISTORY", href: "/history" },
  { name: "PEOPLE", href: "/people" },
  { name: "OPERATIONS", href: "/operations" },
  { name: "ARSENAL", href: "/arsenal" },
  { name: "FORCES", href: "/forces" },
  { name: "GRAPH", href: "/graph" },
  { name: "ARCHIVE", href: "/archive" },
];

export function SiteHeader() {
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-foreground/80"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex md:hidden mr-4">
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
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
