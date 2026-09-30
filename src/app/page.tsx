import Form from "next/form";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { BROWSE_AREAS, COUNTRIES, DOMAINS, LANGUAGES, RECENT_SEARCHES, URGENCIES } from "@/lib/experts";
import { Divider, field, panel, primaryButton } from "@/components/finder-ui";

const FILTERS = [
  { name: "country", label: "Filter 1 · Country", any: "Any country", options: COUNTRIES },
  { name: "domain", label: "Filter 2 · Domain", any: "Any domain", options: DOMAINS },
  { name: "language", label: "Language", any: "Any", options: LANGUAGES },
] as const;

export default async function SearchPage({ searchParams }: PageProps<"/">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  return (
    <main className="flex flex-1 flex-col gap-12 px-4 py-10 sm:px-10 lg:flex-row lg:px-[120px] lg:py-16">
      <section className="flex min-w-0 grow flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="font-mono text-xs tracking-[0.08em] text-muted-foreground">EXPERTISE FINDER</div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-[44px]">Who can help with this?</h1>
          <p className="max-w-[640px] text-[17px] text-muted-foreground">
            Describe the question or customer request. We match it to colleagues based on what they have actually
            worked on, written and answered.
          </p>
        </div>

        <Form action="/results" className={`${panel} flex flex-col gap-5 p-6`}>
          <label htmlFor="q" className="text-sm font-semibold">
            Describe your request
          </label>
          <textarea
            id="q"
            name="q"
            required
            defaultValue={query}
            placeholder="A customer in the Netherlands is hiring an expat and asks how the 30% ruling affects their payroll setup."
            className={`${field} h-[110px] resize-none px-4 py-3.5 text-base`}
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {FILTERS.map((f) => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label htmlFor={f.name} className="text-[13px] text-muted-foreground">
                  {f.label}
                </label>
                <select id={f.name} name={f.name} defaultValue="" className={field}>
                  <option value="">{f.any}</option>
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="urgency" className="text-[13px] text-muted-foreground">
                Urgency
              </label>
              <select id="urgency" name="urgency" defaultValue="This week" className={field}>
                {URGENCIES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Searches employee profiles, documents they own and Teams answers on the intranet.
            </p>
            <button type="submit" className={`${primaryButton} shrink-0 text-base`}>
              <Search className="size-[18px]" strokeWidth={2.2} />
              Find experts
            </button>
          </div>
        </Form>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Browse by expertise area</h2>
          <div className="flex flex-wrap gap-2.5">
            {BROWSE_AREAS.map((area) => (
              <Link
                key={area}
                href={{ pathname: "/results", query: { q: area } }}
                className="rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground hover:border-primary hover:text-primary"
              >
                {area}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <aside className="flex w-full shrink-0 flex-col gap-5 lg:w-[340px]">
        <div className={`${panel} flex flex-col gap-3.5 p-6`}>
          <h2 className="text-base font-semibold">Nobody fits?</h2>
          <p className="text-sm leading-normal text-muted-foreground">
            Post a request. Colleagues with related expertise get notified and can pick it up.
          </p>
          <Link
            href="/requests/new"
            className="flex h-11 items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-primary text-[15px] font-semibold text-primary hover:bg-accent"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            Create request
          </Link>
        </div>
        <div className={`${panel} flex flex-col gap-4 p-6`}>
          <h2 className="text-base font-semibold">Your recent searches</h2>
          {RECENT_SEARCHES.map((s, i) => (
            <div key={s.query} className="flex flex-col gap-4">
              {i > 0 && <Divider />}
              <div className="flex flex-col gap-1">
                <Link href={{ pathname: "/results", query: { q: s.query } }} className="text-sm hover:text-primary">
                  {s.query}
                </Link>
                <div className="text-[13px] text-muted-foreground">{s.status}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
