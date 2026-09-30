import Form from "next/form";
import Link from "next/link";
import { FileText, Search } from "lucide-react";
import { allDocuments } from "@/lib/experts";
import { Avatar, field, panel } from "@/components/finder-ui";

export const metadata = { title: "Documents · Expertise Finder" };

export default async function DocumentsPage({ searchParams }: PageProps<"/documents">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const needsReview = params.review === "1";

  const needle = query.toLowerCase();
  const documents = allDocuments().filter(
    (d) =>
      (!needsReview || d.stale) &&
      (!needle || `${d.title} ${d.owner.name} ${d.owner.team}`.toLowerCase().includes(needle)),
  );

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 pt-8 pb-10 sm:px-10 lg:px-[120px]">
      <div className="flex flex-col gap-2">
        <h1 className="text-[34px] font-semibold">Documents</h1>
        <p className="text-[15px] text-muted-foreground">
          Every procedure, guide and note, with the colleague who owns it.
        </p>
      </div>

      <Form action="/documents" className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="doc-q" className="sr-only">Search documents or owners</label>
        <div className="relative grow">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="doc-q"
            name="q"
            defaultValue={query}
            placeholder="Search by document, owner or team"
            className={`${field} pl-9`}
          />
        </div>
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" name="review" value="1" defaultChecked={needsReview} className="size-4 accent-primary" />
          Needs review only
        </label>
        <button type="submit" className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-[#163a9c]">
          Search
        </button>
      </Form>

      <div className={`${panel} overflow-x-auto`}>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-[13px] text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Document</th>
              <th scope="col" className="px-6 py-3 font-medium">Owner</th>
              <th scope="col" className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr key={`${d.owner.id}-${d.title}`} className="border-b border-[#e6e6e2] last:border-0">
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2.5 text-[15px]">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    {d.title}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/experts/${d.owner.id}`} className="flex items-center gap-2.5 hover:text-primary">
                    <Avatar initials={d.owner.initials} className="size-8 text-xs" />
                    <span className="flex flex-col">
                      <span className="font-medium">{d.owner.name}</span>
                      <span className="text-[13px] text-muted-foreground">{d.owner.role} · {d.owner.team}</span>
                    </span>
                  </Link>
                </td>
                <td className={`px-6 py-4 text-[13px] ${d.stale ? "font-medium text-warning" : "text-muted-foreground"}`}>
                  {d.status}
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                  No documents match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
