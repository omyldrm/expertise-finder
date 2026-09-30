"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Expertise Finder", href: "/", match: (p: string) => p === "/" || p.startsWith("/results") || p.startsWith("/experts") },
  { label: "Documents", href: "/documents", match: (p: string) => p.startsWith("/documents") },
  { label: "My requests", href: "/requests", match: (p: string) => p.startsWith("/requests") },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="flex h-16 shrink-0 items-center gap-8 overflow-x-auto border-b border-border bg-card px-4 sm:px-10">
      <Link href="/" className="shrink-0">
        <Image src="/sd-worx-logo.svg" alt="SD Worx" width={100} height={32} priority />
      </Link>
      <nav className="flex grow gap-5 self-stretch text-[15px] sm:gap-7">
        {NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center border-b-2 whitespace-nowrap",
                active
                  ? "border-primary font-semibold text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div aria-hidden className="ml-auto size-9 shrink-0 rounded-full bg-border" />
    </header>
  );
}
