import Link from "next/link";
import { getDirectory } from "@/lib/directory";
import { interpret, matchEmployees } from "@/lib/matching";
import { AutoSubmitForm } from "@/components/auto-submit-form";
import { Avatar, BackLink, MatchBadge, panel, teamsChatUrl } from "@/components/finder-ui";

type Params = Record<string, string | string[] | undefined>;

function all(params: Params, key: string) {
  const v = params[key];
  return v === undefined ? [] : Array.isArray(v) ? v : [v];
}

function pick(values: string[], allowed: readonly string[]) {
  return allowed.filter((a) => values.includes(a));
}

export default async function ResultsPage({ searchParams }: PageProps<"/results">) {
  const params = await searchParams;
  const directory = await getDirectory();
  const query = all(params, "q")[0]?.trim() ?? "";
  // "filtered" is set once the user touches the sidebar; before that, the country comes from the request text.
  const explicit = all(params, "filtered")[0] === "1";
  const understood = interpret(query, directory.employees);

  const countries = pick(all(params, "country"), directory.countries);
  const effectiveCountries = explicit || countries.length ? countries : understood.countries;
  const departments = pick(all(params, "department"), directory.departments);
  const languages = pick(all(params, "language"), directory.languages);
  const locationTypes = pick(all(params, "locationType"), directory.locationTypes);
  const sort = all(params, "sort")[0] === "name" ? "name" : "match";

  const matches = matchEmployees(directory.employees, {
    query,
    countries: effectiveCountries,
    departments,
    languages,
    locationTypes,
  });
  if (sort === "name") matches.sort((a, b) => a.employee.name.localeCompare(b.employee.name));

  const chips = [...effectiveCountries, ...understood.expertise];

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
          <FilterGroup legend="Filter 1 · Country" name="country" options={directory.countries} checked={effectiveCountries} />
          <FilterGroup legend="Filter 2 · Department" name="department" options={directory.departments} checked={departments} />
          <FilterGroup legend="Language" name="language" options={directory.languages} checked={languages} />
          <FilterGroup legend="Works from" name="locationType" options={directory.locationTypes} checked={locationTypes} />
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
                <option value="name">Name</option>
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

          {matches.map(({ employee, level }) => (
            <article key={employee.id} className={`${panel} flex flex-col gap-6 p-6 lg:flex-row`}>
              <Avatar initials={employee.initials} className="size-16" />
              <div className="flex min-w-0 grow flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold">{employee.name}</h2>
                  <MatchBadge level={level} />
                </div>
                <div className="text-sm text-muted-foreground">
                  {employee.role} · {employee.department} · {employee.city}, {employee.country}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="rounded-full bg-accent px-3 py-1 text-[13px] font-medium text-accent-foreground">
                    {employee.expertise}
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    Speaks {employee.language} · {employee.locationType}
                  </span>
                </div>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-2.5 lg:w-[200px]">
                {employee.email && (
                  <a
                    href={teamsChatUrl(employee.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-[#163a9c]"
                  >
                    Message in Teams
                  </a>
                )}
                <Link
                  href={`/experts/${employee.id}`}
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
  options: readonly string[];
  checked: readonly string[];
}) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-sm font-semibold">{legend}</legend>
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" name={name} value={o} defaultChecked={checked.includes(o)} className="size-4 accent-primary" />
          {o}
        </label>
      ))}
    </fieldset>
  );
}
