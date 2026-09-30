import { getDirectory } from "@/lib/directory";
import { BackLink } from "@/components/finder-ui";
import { CreateRequestForm } from "@/components/create-request-form";

export const metadata = { title: "Create request · Expertise Finder" };

export default async function NewRequestPage({ searchParams }: PageProps<"/requests/new">) {
  const { q, expert } = await searchParams;
  const { employees, countries, departments } = await getDirectory();

  return (
    <main className="flex flex-1 flex-col gap-5 px-4 pt-8 pb-10 sm:px-10 lg:px-[120px]">
      <BackLink href="/">Back to search</BackLink>
      <h1 className="text-[34px] font-semibold">Create a request</h1>
      <CreateRequestForm
        employees={employees}
        countries={countries}
        departments={departments}
        initialQuery={typeof q === "string" ? q : ""}
        expertId={typeof expert === "string" ? expert : undefined}
      />
    </main>
  );
}
