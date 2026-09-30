"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDirectory } from "@/lib/directory";
import { URGENCIES, employeesToNotify } from "@/lib/matching";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function oneOf<T extends string>(value: string, allowed: readonly T[]): T {
  if (!(allowed as readonly string[]).includes(value)) throw new Error(`Invalid value: ${value}`);
  return value as T;
}

export async function createRequest(formData: FormData) {
  const title = text(formData, "title");
  const description = text(formData, "description");
  if (!title || !description) throw new Error("Title and description are required");

  const { employees, countries, departments } = await getDirectory();
  const country = oneOf(text(formData, "country"), countries);
  const department = oneOf(text(formData, "department"), departments);
  const neededBy = oneOf(text(formData, "neededBy"), URGENCIES);
  const notifyMatches = formData.get("notifyMatches") === "on";
  const directId = text(formData, "expert") || undefined;

  const notified = employeesToNotify(employees, `${title} ${description}`, country, department, directId).filter(
    (n) => notifyMatches || n.label === "Direct request",
  );

  const request = await prisma.expertRequest.create({
    data: {
      title: title.slice(0, 200),
      description: description.slice(0, 5000),
      country,
      domain: department,
      neededBy,
      links: text(formData, "links").split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 20),
      notifyMatches,
      saveToKnowledgeBase: formData.get("saveToKnowledgeBase") === "on",
      notifiedExpertIds: notified.map((n) => n.employee.id),
    },
  });

  revalidatePath("/requests");
  redirect(`/requests?posted=${request.id}`);
}
