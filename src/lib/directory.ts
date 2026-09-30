import { cache } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Employee } from "@/lib/matching";

function nameFromEmail(email: string | null, id: bigint) {
  if (!email) return `Employee ${id}`;
  return email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function initials(name: string) {
  const parts = name.split(" ");
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export const getDirectory = cache(async () => {
  await connection();
  const rows = await prisma.fact_employee.findMany({
    include: {
      contact_info: true,
      employee_expertise: true,
      employee_location: true,
      employee_language: true,
      employee_document: { orderBy: { last_reviewed: "desc" } },
    },
    orderBy: { id: "asc" },
  });

  const employees: Employee[] = rows.map((row) => {
    const name = nameFromEmail(row.contact_info.email, row.id);
    const [city, country = ""] = (row.employee_location.location ?? "").split(", ");
    return {
      id: row.id.toString(),
      name,
      initials: initials(name),
      email: row.contact_info.email,
      phone: row.contact_info.phone,
      slack: row.contact_info.slack,
      role: row.job_function ?? "",
      department: row.department ?? "",
      expertise: row.employee_expertise.expertise ?? "",
      city,
      country,
      locationType: row.employee_location.location_type ?? "",
      timezone: row.employee_location.timezone ?? "",
      language: row.employee_language.language ?? "",
      documents: row.employee_document.map((d) => ({
        id: d.id.toString(),
        title: d.title,
        lastReviewed: d.last_reviewed.toISOString(),
      })),
    };
  });

  return {
    employees,
    countries: uniqueSorted(employees.map((e) => e.country)),
    departments: uniqueSorted(employees.map((e) => e.department)),
    languages: uniqueSorted(employees.map((e) => e.language)),
    locationTypes: uniqueSorted(employees.map((e) => e.locationType)),
    expertise: uniqueSorted(employees.map((e) => e.expertise)),
  };
});

export async function getEmployee(id: string) {
  if (!/^\d{1,18}$/.test(id)) return undefined;
  const { employees } = await getDirectory();
  return employees.find((e) => e.id === id);
}
