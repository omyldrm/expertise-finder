import Link from "next/link";
import {
  COUNTRIES,
  DOMAINS,
  EVIDENCE_FILTERS,
  LANGUAGES,
  interpret,
  matchExperts,
} from "@/lib/experts";
import { AutoSubmitForm } from "@/components/auto-submit-form";
import { Avatar, BackLink, MatchBadge, panel, teamsChatUrl } from "@/components/finder-ui";

type Params = Record<string, string | string[] | undefined>;

function all(params: Params, key: string) {
  const v = params[key];
  return v === undefined ? [] : Array.isArray(v) ? v : [v];
}

function pick<T extends string>(values: string[], allowed: readonly T[]) {
  return allowed.filter((a) => values.includes(a));
}

export default async function ResultsPage({ searchParams }: PageProps<"/results">) {
  const params = await searchParams;
  const query = all(params, "q")[0]?.trim() ?? "";
  // "filtered" is set once the user touches the sidebar; before that, fall back to what we read from the request.
  const explicit = all(params, "filtered")[0] === "1";
  const understood = interpret(query);

  const countries = pick(all(params, "country"), COUNTRIES);
  const domains = pick(all(params, "domain"), DOMAINS);
  const effectiveCountries = explicit || countries.length ? countries : understood.countries;
  const effectiveDomains = explicit || domains.length ? domains : understood.domains;
  const evidence = explicit
    ? pick(all(params, "evidence"), EVIDENCE_FILTERS.map((e) => e.value))
    : EVIDENCE_FILTERS.map((e) => e.value);
  const language = pick(all(params, "language"), LANGUAGES)[0];
  const availableNow = all(params, "available")[0] === "1";
  const urgency = all(params, "urgency")[0];
  const sortParam = all(params, "sort")[0];
  const sort = sortParam === "availability" || (!sortParam && urgency === "Today") ? "availability" : "match";

  const matches = matchExperts({
    query,
    countries: effectiveCountries,
    domains: effectiveDomains,
    language,
    evidence,
    availableNow,
  });
  if (sort === "availability") matches.sort((a, b) => Number(b.expert.available) - Number(a.expert.available));

  const chips = [...effectiveCountries, ...understood.topics];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 px-4 pt-8 sm:px-10">
        <BackLink href={`/?${new URLSearchParams({ q: query })}`}>Edit request</BackLink>
        <div className={`${panel} flex flex-col gap-3 px-6 py-5`}>
          <div className="text-[13px] text-muted-foreground">Your request</div>
          <div className="text-lg">{query || "No description given"}</div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] text-muted-foreground">Understood as:</span>
            {chips.length ? (
              chips.map((c) => (
                <span key={c} className="rounded-full bg-accent px-3 py-1 text-[13px] font-medium text-accent-foreground">
                  {c}
                </span>
              ))
            ) : (
              <span className="text-[13px]">general question</span>
            )}
            <a href="#filters" className="text-[13px] text-primary hover:text-[#163a9c]">
              Adjust
            </a>
          </div>
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-8 px-4 pt-6 pb-10 sm:px-10 md:flex-row">
        <AutoSubmitForm key={query} id="filters" action="/results" className="flex w-full shrink-0 flex-col gap-6 md:w-[260px]">
          <input type="hidden" name="q" value={query} />
          <input type="hidden" name="filtered" value="1" />
          {language && <input type="hidden" name="language" value={language} />}
          {urgency && <input type="hidden" name="urgency" value={urgency} />}
          <FilterGroup legend="Filter 1 · Country" name="country" options={COUNTRIES.map((c) => ({ value: c, label: c }))} checked={effectiveCountries} />
          <FilterGroup legend="Filter 2 · Domain" name="domain" options={DOMAINS.map((d) => ({ value: d, label: d }))} checked={effectiveDomains} />
          <FilterGroup legend="Evidence type" name="evidence" options={EVIDENCE_FILTERS} checked={evidence} />
          <label className="flex items-center gap-2.5 text-sm">
            <input type="checkbox" name="available" value="1" defaultChecked={availableNow} className="size-4 accent-primary" />
            Available now only
          </label>
          <noscript>
            <button type="submit" className="text-sm text-primary">Apply filters</button>
          </noscript>
        </AutoSubmitForm>

        <section className="flex min-w-0 grow flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold">
              Results · {matches.length} {matches.length === 1 ? "colleague" : "colleagues"}
            </h1>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Sort by
              <select
                name="sort"
                form="filters"
                defaultValue={sort}
                className="h-9 rounded-md border border-input bg-card px-2.5 text-sm text-foreground"
              >
                <option value="match">Best match</option>
                <option value="availability">Availability</option>
              </select>
            </label>
          </div>

          {matches.length === 0 && (
            <div className={`${panel} flex flex-col items-start gap-3 p-6`}>
              <div className="text-base font-semibold">No colleagues match yet</div>
              <p className="text-sm text-muted-foreground">
                Loosen the filters, or post a request so colleagues with related expertise get notified.
              </p>
              <Link href={{ pathname: "/requests/new", query: { q: query } }} className="text-sm font-semibold text-primary">
                + Create request
              </Link>
            </div>
          )}

          {matches.map(({ expert, level }) => (
            <article key={expert.id} className={`${panel} flex flex-col gap-6 p-6 lg:flex-row`}>
              <Avatar initials={expert.initials} className="size-16" />
              <div className="flex min-w-0 grow flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold">{expert.name}</h2>
                  <MatchBadge level={level} />
                </div>
                <div className="text-sm text-muted-foreground">
                  {expert.role} · {expert.team} · {expert.city}
                </div>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-2.5 lg:w-[200px]">
                <div className="text-[13px] text-muted-foreground">{expert.availability}</div>
                <a
                  href={teamsChatUrl(expert.email)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-[#163a9c]"
                >
                  Message in Teams
                </a>
                <Link
                  href={`/experts/${expert.id}`}
                  className="flex h-11 items-center justify-center rounded-lg border border-input text-sm font-medium hover:bg-muted"
                >
                  View profile
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function FilterGroup({ legend, name, options, checked }: {
  legend: string;
  name: string;
  options: readonly { value: string; label: string }[];
  checked: readonly string[];
}) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-sm font-semibold">{legend}</legend>
      {options.map((o) => (
        <label key={o.value} className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            name={name}
            value={o.value}
            defaultChecked={checked.includes(o.value)}
            className="size-4 accent-primary"
          />
          {o.label}
        </label>
      ))}
    </fieldset>
  );
}
