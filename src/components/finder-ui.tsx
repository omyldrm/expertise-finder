import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchLevel } from "@/lib/experts";

export const panel = "rounded-xl border border-border bg-card";

export const field =
  "h-11 w-full rounded-lg border border-input bg-card px-3 text-[15px] text-foreground outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25";

export const primaryButton =
  "inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-primary px-7 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-[#163a9c] disabled:opacity-60";

export const secondaryButton =
  "inline-flex h-12 items-center justify-center rounded-lg border border-input bg-card px-6 text-[15px] font-medium text-foreground transition-colors hover:bg-muted";

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-border font-semibold text-muted-foreground",
        className,
      )}
    >
      {initials}
    </div>
  );
}

const BADGE: Record<MatchLevel, string> = {
  "Strong match": "bg-primary text-primary-foreground",
  "Good match": "bg-accent text-accent-foreground",
  "Partial match": "border border-input bg-card text-muted-foreground",
};

export function MatchBadge({ level }: { level: MatchLevel }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", BADGE[level])}>{level}</span>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex w-fit items-center gap-1.5 text-sm text-primary hover:text-[#163a9c]">
      <ArrowLeft className="size-4" />
      {children}
    </Link>
  );
}

export function Divider() {
  return <div className="h-px bg-[#e6e6e2]" />;
}

export function teamsChatUrl(email: string) {
  return `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(email)}`;
}
