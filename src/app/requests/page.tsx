import Link from "next/link";
import { connection } from "next/server";
import { Check, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDirectory } from "@/lib/directory";
import { Avatar, panel, primaryButton } from "@/components/finder-ui";

export const metadata = { title: "My requests · Expertise Finder" };

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Brussels",
});

export default async function RequestsPage({ searchParams }: PageProps<"/requests">) {
  await connection();
  const { posted } = await searchParams;
  const requests = await prisma.expertRequest.findMany({ orderBy: { createdAt: "desc" } });
  const { employees } = await getDirectory();
  const justPosted = requests.find((r) => r.id === posted);

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 pt-8 pb-10 sm:px-10 lg:px-[120px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[34px] font-semibold">My requests</h1>
        <Link href="/requests/new" className={primaryButton}>
          <Plus className="size-4" strokeWidth={2.5} />
          Create request
        </Link>
      </div>

      {justPosted && (
        <div role="status" className="flex items-start gap-3 rounded-xl bg-accent p-5 text-sm text-accent-foreground">
          <Check className="mt-0.5 size-4 shrink-0" strokeWidth={3} />
          <span>
            <strong className="font-semibold">Request posted.</strong>{" "}
            {justPosted.notifiedExpertIds.length
              ? `${justPosted.notifiedExpertIds.length} ${justPosted.notifiedExpertIds.length === 1 ? "colleague was" : "colleagues were"} notified. You'll hear back in Teams.`
              : "Nobody matched yet. Colleagues with related expertise can still pick it up."}
          </span>
        </div>
      )}

      {requests.length === 0 && (
        <div className={`${panel} flex flex-col items-start gap-3 p-6`}>
          <div className="text-base font-semibold">No requests yet</div>
          <p className="text-sm text-muted-foreground">
            When nobody fits your search, post a request and matching colleagues get notified.
          </p>
        </div>
      )}

      {requests.map((r) => {
        const notified = employees.filter((e) => r.notifiedExpertIds.includes(e.id));
        return (
          <article
            key={r.id}
            className={`${panel} flex flex-col gap-4 p-6 ${r.id === justPosted?.id ? "border-primary" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{r.title}</h2>
                <div className="text-[13px] text-muted-foreground">
                  {dateFormat.format(r.createdAt)} · {r.country} · {r.domain} · Needed by: {r.neededBy}
                </div>
              </div>
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                {r.status}
              </span>
            </div>
            <p className="text-[15px] whitespace-pre-line">{r.description}</p>
            {r.links.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="text-[13px] font-semibold">Attached</div>
                {r.links.map((link) =>
                  /^https?:\/\//i.test(link) ? (
                    <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="text-sm break-all text-primary">
                      {link}
                    </a>
                  ) : (
                    <span key={link} className="text-sm break-all">{link}</span>
                  ),
                )}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 border-t border-[#e6e6e2] pt-4">
              <span className="text-[13px] text-muted-foreground">Notified:</span>
              {notified.length ? (
                notified.map((e) => (
                  <Link key={e.id} href={`/experts/${e.id}`} className="flex items-center gap-2 text-sm hover:text-primary">
                    <Avatar initials={e.initials} className="size-7 text-[11px]" />
                    {e.name}
                  </Link>
                ))
              ) : (
                <span className="text-sm">Nobody yet</span>
              )}
            </div>
          </article>
        );
      })}
    </main>
  );
}
