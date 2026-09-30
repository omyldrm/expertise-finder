// Replaces all employee data with fictional SD Worx-style payroll/HR demo data.
// Run with: npx prisma db seed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const expertise = [
  "Expat payroll & 30% ruling",
  "Belgian payroll",
  "Dutch payroll",
  "German payroll",
  "Social security & A1 certificates",
  "Parental leave & absence",
  "Company car & mobility budget",
  "GDPR & employee data",
  "Time registration & overtime",
  "Payroll implementation",
  "International tax",
  "Employment law",
];

const locations = [
  { location: "Antwerp, Belgium", location_type: "Office", timezone: "Europe/Brussels" },
  { location: "Brussels, Belgium", location_type: "Office", timezone: "Europe/Brussels" },
  { location: "Ghent, Belgium", location_type: "Office", timezone: "Europe/Brussels" },
  { location: "Amsterdam, Netherlands", location_type: "Office", timezone: "Europe/Amsterdam" },
  { location: "Utrecht, Netherlands", location_type: "Office", timezone: "Europe/Amsterdam" },
  { location: "Rotterdam, Netherlands", location_type: "Remote", timezone: "Europe/Amsterdam" },
  { location: "Munich, Germany", location_type: "Office", timezone: "Europe/Berlin" },
  { location: "Paris, France", location_type: "Office", timezone: "Europe/Paris" },
];

const languages = ["Dutch", "French", "English", "German"];

const PHONE_PREFIX = { Belgium: "+32 470", Netherlands: "+31 6", Germany: "+49 151", France: "+33 6" };

// [name, department, job function, expertise, location, language, documents: [title, last reviewed]]
const employees = [
  ["Lotte Jansen", "Payroll", "Senior Payroll Consultant", "Expat payroll & 30% ruling", "Amsterdam, Netherlands", "Dutch",
    [["30% ruling – payroll procedure", "2026-07-28"], ["Expat onboarding checklist NL", "2025-07-15"]]],
  ["Pieter Bakker", "Tax & Legal", "Tax Advisor", "International tax", "Utrecht, Netherlands", "Dutch",
    [["Expat tax regimes – internal note", "2025-06-01"]]],
  ["Elise Peeters", "Implementation", "Implementation Consultant", "Payroll implementation", "Antwerp, Belgium", "Dutch",
    [["Payroll go-live checklist BE", "2026-09-05"]]],
  ["Thomas Maes", "Payroll", "Payroll Specialist", "Belgian payroll", "Brussels, Belgium", "French",
    [["Belgian payroll year-end checklist", "2026-04-11"]]],
  ["Katrin Weber", "HR", "HR Consultant", "Parental leave & absence", "Munich, Germany", "German",
    [["Parental leave (Elternzeit) – summary", "2026-03-30"]]],
  ["Nadia El Amrani", "Compliance", "Data Protection Officer", "GDPR & employee data", "Brussels, Belgium", "French",
    [["Employee data retention policy", "2026-08-30"], ["DPA template for customers", "2025-03-10"]]],
  ["Joris De Wit", "HR", "Product Specialist", "Time registration & overtime", "Rotterdam, Netherlands", "Dutch",
    [["Time registration – admin guide", "2026-09-16"]]],
  ["Sophie Dubois", "Payroll", "Payroll Consultant", "Belgian payroll", "Brussels, Belgium", "French",
    [["Holiday pay calculation BE", "2025-05-20"]]],
  ["Bram Claes", "Tax & Legal", "Social Security Advisor", "Social security & A1 certificates", "Ghent, Belgium", "Dutch",
    [["A1 certificate decision tree", "2026-05-25"]]],
  ["Marie Lefebvre", "Tax & Legal", "Employment Lawyer", "Employment law", "Paris, France", "French",
    [["French employment contract templates", "2026-07-01"]]],
  ["Daan Visser", "Payroll", "Payroll Consultant", "Dutch payroll", "Amsterdam, Netherlands", "Dutch",
    [["Dutch payroll tax tables 2026", "2026-01-05"]]],
  ["Anna Schmidt", "Payroll", "Payroll Specialist", "German payroll", "Munich, Germany", "German",
    [["German payroll month-end checklist", "2026-06-30"]]],
  ["Lucas Wouters", "HR", "Reward Consultant", "Company car & mobility budget", "Antwerp, Belgium", "Dutch",
    [["Mobility budget – employer FAQ", "2026-01-15"]]],
  ["Emma Janssens", "HR", "HR Advisor", "Parental leave & absence", "Ghent, Belgium", "Dutch",
    [["Parental & maternity leave rules BE", "2024-11-02"]]],
  ["Noah Vermeulen", "Implementation", "Implementation Lead", "Payroll implementation", "Brussels, Belgium", "English",
    [["Payroll implementation playbook", "2026-08-20"]]],
  ["Sarah Hoffmann", "Tax & Legal", "Tax Advisor", "International tax", "Munich, Germany", "English",
    [["Cross-border taxation for German employers", "2026-03-02"]]],
  ["Milan Smit", "Payroll", "Mobility Payroll Specialist", "Expat payroll & 30% ruling", "Rotterdam, Netherlands", "English",
    [["Mobility FAQ – expat payroll", "2026-05-10"]]],
  ["Julie Martin", "Compliance", "Compliance Officer", "GDPR & employee data", "Paris, France", "French",
    [["GDPR subject access requests – procedure", "2026-06-18"]]],
  ["Ruben Jacobs", "Payroll", "Payroll Analyst", "Time registration & overtime", "Ghent, Belgium", "Dutch",
    [["Overtime export to payroll", "2026-02-02"]]],
  ["Laura Meijer", "Tax & Legal", "Social Security Advisor", "Social security & A1 certificates", "Utrecht, Netherlands", "Dutch",
    [["Posted workers – social security checklist", "2025-08-01"]]],
  ["Kevin Dupont", "Payroll", "Senior Payroll Consultant", "Company car & mobility budget", "Brussels, Belgium", "French",
    [["Company car benefit – calculation guide", "2026-08-25"]]],
  ["Hannah Fischer", "HR", "HR Consultant", "Employment law", "Munich, Germany", "German",
    [["Dismissal procedure Germany", "2025-09-10"]]],
  ["Wout Mertens", "Implementation", "Implementation Consultant", "Belgian payroll", "Antwerp, Belgium", "Dutch",
    [["Customer payroll migration template", "2026-04-22"]]],
  ["Eva De Groot", "Payroll", "Payroll Consultant", "Expat payroll & 30% ruling", "Amsterdam, Netherlands", "English", []],
];

function slug(name) {
  return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]+/g, ".");
}

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      'TRUNCATE "employee_document", "fact_employee", "contact_info", "employee_expertise", "employee_location", "employee_language" RESTART IDENTITY',
    );

    await tx.employee_expertise.createMany({
      data: expertise.map((e, i) => ({ expertiseid: i + 1, expertise: e })),
    });
    await tx.employee_location.createMany({
      data: locations.map((l, i) => ({ locationid: i + 1, ...l })),
    });
    await tx.employee_language.createMany({
      data: languages.map((l, i) => ({ languageid: i + 1, language: l })),
    });

    for (const [i, [name, department, jobFunction, exp, location, language, docs]] of employees.entries()) {
      const contactid = i + 1;
      const country = location.split(", ")[1];
      await tx.contact_info.create({
        data: {
          contactid,
          email: `${slug(name)}@example.com`,
          phone: `${PHONE_PREFIX[country]} ${String(100000 + contactid * 137).padStart(6, "0")}`,
          slack: `@${slug(name)}`,
        },
      });
      const employee = await tx.fact_employee.create({
        data: {
          contactid,
          expertiseid: expertise.indexOf(exp) + 1,
          locationid: locations.findIndex((l) => l.location === location) + 1,
          languageid: languages.indexOf(language) + 1,
          department,
          job_function: jobFunction,
        },
      });
      if (docs.length) {
        await tx.employee_document.createMany({
          data: docs.map(([title, reviewed]) => ({
            employeeid: employee.id,
            title,
            last_reviewed: new Date(`${reviewed}T00:00:00Z`),
          })),
        });
      }
    }
  });

  console.log(`Seeded ${employees.length} employees, ${expertise.length} expertise areas, ${locations.length} locations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
