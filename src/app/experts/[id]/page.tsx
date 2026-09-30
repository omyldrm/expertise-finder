import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { getDirectory, getEmployee } from "@/lib/directory";
import { reviewStatus } from "@/lib/matching";
import { Avatar, BackLink, Divider, panel, primaryButton, secondaryButton, teamsChatUrl } from "@/components/finder-ui";

export async function generateMetadata({ params }: PageProps<"/experts/[id]">) {
  const employee = await getEmployee((await params).id);
  return { title: employee ? `${employee.name} · Expertise Finder` : "Expertise Finder" };
}

export default async function ExpertPage({ params }: PageProps<"/experts/[id]">) {
  const employee = await getEmployee((await params).id);
  if (!employee) notFound();

  const { employees } = await getDirectory();
  const peers = employees.filter((e) => e.expertise === employee.expertise && e.id !== employee.id);
  const now = new Date();

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 pt-8 pb-10 sm:px-10">
      <BackLink href="/results">Back to results</BackLink>

      <div className={`${panel} flex flex-col gap-6 p-7 md:flex-row md:items-center`}>
        <Avatar initials={employee.initials} className="size-24 text-[28px]" />
        <div className="flex grow flex-col gap-1.5">
          <h1 className="text-[28px] font-semibold">{employee.name}</h1>
          <div className="text-base text-muted-foreground">
            {employee.role} · {employee.department} · {employee.city}, {employee.country}
          </div>
          <div className="text-sm text-muted-foreground">
            Speaks {employee.language} · {employee.locationType} · {employee.timezone}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {employee.email && (
            <a href={teamsChatUrl(employee.email)} target="_blank" rel="noopener noreferrer" className={`${primaryButton} px-6`}>
              Message in Teams
            </a>
          )}
          <Link href={{ pathname: "/requests/new", query: { expert: employee.id } }} className={secondaryButton}>
            Send request
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${panel} flex flex-col gap-4 p-6`}>
          <h2 className="text-[17px] font-semibold">Expertise</h2>
          <div className="flex flex-col gap-1.5">
            <span className="w-fit rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
              {employee.expertise}
            </span>
            <div className="text-[13px] text-muted-foreground">{employee.department} department</div>
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold">Also knows this area</div>
            {peers.length ? (
              peers.map((p) => (
                <Link key={p.id} href={`/experts/${p.id}`} className="flex items-center gap-2.5 text-sm hover:text-primary">
                  <Avatar initials={p.initials} className="size-8 text-xs" />
                  <span>
                    {p.name} <span className="text-muted-foreground">· {p.city}</span>
                  </span>
                </Link>
              ))
            ) : (
              <div className="text-[13px] text-muted-foreground">Nobody else yet</div>
            )}
          </div>
        </section>

        <section className={`${panel} flex flex-col gap-4 p-6`}>
          <h2 className="text-[17px] font-semibold">Knowledge they own</h2>
          {employee.documents.length === 0 && (
            <div className="text-[13px] text-muted-foreground">No documents owned yet</div>
          )}
          {employee.documents.map((d, i) => {
            const status = reviewStatus(d.lastReviewed, now);
            return (
              <div key={d.id} className="flex flex-col gap-4">
                {i > 0 && <Divider />}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[15px]">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    {d.title}
                  </div>
                  <div className={status.stale ? "text-[13px] font-medium text-warning" : "text-[13px] text-muted-foreground"}>
                    {status.label}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className={`${panel} flex flex-col gap-4 p-6`}>
          <h2 className="text-[17px] font-semibold">Contact</h2>
          <dl className="flex flex-col gap-3 text-[15px]">
            {employee.email && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-[13px] text-muted-foreground">Email</dt>
                <dd><a href={`mailto:${employee.email}`} className="text-primary break-all">{employee.email}</a></dd>
              </div>
            )}
            {employee.phone && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-[13px] text-muted-foreground">Phone</dt>
                <dd><a href={`tel:${employee.phone.replace(/\s+/g, "")}`} className="text-primary">{employee.phone}</a></dd>
              </div>
            )}
            {employee.slack && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-[13px] text-muted-foreground">Slack</dt>
                <dd>{employee.slack}</dd>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <dt className="text-[13px] text-muted-foreground">Works from</dt>
              <dd>{employee.city} · {employee.locationType}</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
