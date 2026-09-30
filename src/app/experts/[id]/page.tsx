import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { EXPERTS, getExpert } from "@/lib/experts";
import { Avatar, BackLink, Divider, panel, primaryButton, secondaryButton, teamsChatUrl } from "@/components/finder-ui";

export function generateStaticParams() {
  return EXPERTS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: PageProps<"/experts/[id]">) {
  const expert = getExpert((await params).id);
  return { title: expert ? `${expert.name} · Expertise Finder` : "Expertise Finder" };
}

export default async function ExpertPage({ params }: PageProps<"/experts/[id]">) {
  const expert = getExpert((await params).id);
  if (!expert) notFound();

  const endorsers = expert.endorsedBy.map(getExpert).filter((e) => e !== undefined);
  const shownEndorsers = endorsers.slice(0, 3);

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 pt-8 pb-10 sm:px-10">
      <BackLink href="/results">Back to results</BackLink>

      <div className={`${panel} flex flex-col gap-6 p-7 md:flex-row md:items-center`}>
        <Avatar initials={expert.initials} className="size-24 text-[28px]" />
        <div className="flex grow flex-col gap-1.5">
          <h1 className="text-[28px] font-semibold">{expert.name}</h1>
          <div className="text-base text-muted-foreground">
            {expert.role} · {expert.team} · {expert.city}
          </div>
          <div className="text-sm text-muted-foreground">
            Speaks {expert.languages.join(", ")} · {expert.availability}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={teamsChatUrl(expert.email)} target="_blank" rel="noopener noreferrer" className={`${primaryButton} px-6`}>
            Message in Teams
          </a>
          <Link href={{ pathname: "/requests/new", query: { expert: expert.id } }} className={secondaryButton}>
            Send request
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${panel} flex flex-col gap-4 p-6`}>
          <h2 className="text-[17px] font-semibold">Expertise areas</h2>
          {expert.expertise.map((x, i) => (
            <div key={x.area} className="flex flex-col gap-4">
              {i > 0 && <Divider />}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between gap-4 text-[15px]">
                  <span>{x.area}</span>
                  <span className={x.level === "proven" ? "font-semibold text-accent-foreground" : "font-semibold text-muted-foreground"}>
                    {x.level === "proven" ? "Proven" : "Self-declared"}
                  </span>
                </div>
                <div className="text-[13px] text-muted-foreground">{x.note}</div>
              </div>
            </div>
          ))}
        </section>

        <section className={`${panel} flex flex-col gap-4 p-6`}>
          <h2 className="text-[17px] font-semibold">Knowledge they own</h2>
          {expert.documents.map((d, i) => (
            <div key={d.title} className="flex flex-col gap-4">
              {i > 0 && <Divider />}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[15px]">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  {d.title}
                </div>
                <div className={d.stale ? "text-[13px] font-medium text-warning" : "text-[13px] text-muted-foreground"}>
                  {d.status}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className={`${panel} flex flex-col gap-4 p-6`}>
          <h2 className="text-[17px] font-semibold">Recently helped with</h2>
          {expert.helpedWith.map((h) => (
            <div key={h.title} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-[15px]">{h.title}</div>
                <div className="text-[13px] text-muted-foreground">{h.source}</div>
              </div>
              <Divider />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <div className="text-sm font-semibold">Endorsed by</div>
            {endorsers.length ? (
              <div className="flex items-center gap-1.5">
                {shownEndorsers.map((e) => (
                  <Link key={e.id} href={`/experts/${e.id}`} title={e.name} aria-label={e.name}>
                    <Avatar initials={e.initials} className="size-8 text-xs" />
                  </Link>
                ))}
                {endorsers.length > shownEndorsers.length && (
                  <span className="text-[13px] text-muted-foreground">
                    + {endorsers.length - shownEndorsers.length} more
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[13px] text-muted-foreground">No endorsements yet</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
