"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { URGENCIES, employeesToNotify, interpret, type Employee } from "@/lib/matching";
import { createRequest } from "@/app/requests/actions";
import { Avatar, field, panel, primaryButton, secondaryButton } from "@/components/finder-ui";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={primaryButton}>
      {pending ? "Posting…" : "Post request"}
    </button>
  );
}

export function CreateRequestForm({ employees, countries, departments, initialQuery, expertId }: {
  employees: Employee[];
  countries: string[];
  departments: string[];
  initialQuery: string;
  expertId?: string;
}) {
  const direct = employees.find((e) => e.id === expertId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(initialQuery);
  const [country, setCountry] = useState(
    direct?.country ?? interpret(initialQuery, employees).countries[0] ?? countries[0] ?? "",
  );
  const [department, setDepartment] = useState(direct?.department ?? departments[0] ?? "");
  const [notifyMatches, setNotifyMatches] = useState(true);

  const notified = employeesToNotify(employees, `${title} ${description}`, country, department, expertId).filter(
    (n) => notifyMatches || n.label === "Direct request",
  );

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <form action={createRequest} className={`${panel} flex min-w-0 grow flex-col gap-5 p-7`}>
        {direct && <input type="hidden" name="expert" value={direct.id} />}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-semibold">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="30% ruling impact on payroll for new expat hire"
            className={field}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-semibold">
            What do you need to know?
          </label>
          <textarea
            id="description"
            name="description"
            required
            maxLength={5000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Context, customer, what you already found and why it wasn't enough"
            className={`${field} h-[120px] resize-none py-3`}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="country" className="text-[13px] text-muted-foreground">Country</label>
            <select id="country" name="country" value={country} onChange={(e) => setCountry(e.target.value)} className={field}>
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="department" className="text-[13px] text-muted-foreground">Department</label>
            <select id="department" name="department" value={department} onChange={(e) => setDepartment(e.target.value)} className={field}>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="needed-by" className="text-[13px] text-muted-foreground">Needed by</label>
            <select id="needed-by" name="neededBy" defaultValue="This week" className={field}>
              {URGENCIES.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="links" className="text-[13px] text-muted-foreground">
            Attach documents you already found (optional)
          </label>
          <textarea
            id="links"
            name="links"
            placeholder="Paste intranet links, one per line"
            className="h-16 resize-none rounded-lg border-[1.5px] border-dashed border-input bg-card px-3.5 py-2.5 text-sm outline-none placeholder:text-center placeholder:leading-10 focus-visible:border-primary"
          />
        </div>
        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            name="notifyMatches"
            checked={notifyMatches}
            onChange={(e) => setNotifyMatches(e.target.checked)}
            className="size-4 accent-primary"
          />
          Notify colleagues whose expertise matches
        </label>
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" name="saveToKnowledgeBase" defaultChecked className="size-4 accent-primary" />
          Save the answer to the knowledge base when resolved
        </label>
        <div className="flex justify-end gap-3">
          <Link href="/" className={secondaryButton}>
            Cancel
          </Link>
          <SubmitButton />
        </div>
      </form>

      <aside className="flex w-full shrink-0 flex-col gap-5 lg:w-[360px]">
        <div className={`${panel} flex flex-col gap-3.5 p-6`}>
          <h2 className="text-base font-semibold">Will be notified</h2>
          {notified.length ? (
            notified.map(({ employee, label }) => (
              <Link key={employee.id} href={`/experts/${employee.id}`} className="flex items-center gap-3 hover:text-primary">
                <Avatar initials={employee.initials} className="size-10 text-sm" />
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{employee.name}</span>
                  <span className="text-[13px] text-muted-foreground">{label}</span>
                </span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Describe your question to see who will be notified.</p>
          )}
          <p className="text-[13px] text-muted-foreground">Updates automatically as you type.</p>
        </div>
        <div className="rounded-xl bg-accent p-5 text-sm leading-normal text-accent-foreground">
          Resolved requests become searchable answers, so the next colleague finds the expert and the answer directly.
        </div>
      </aside>
    </div>
  );
}
