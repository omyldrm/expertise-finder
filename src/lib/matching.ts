export const URGENCIES = ["Today", "This week", "No rush"] as const;

export type EmployeeDocument = { id: string; title: string; lastReviewed: string };

export type Employee = {
  id: string;
  name: string;
  initials: string;
  email: string | null;
  phone: string | null;
  slack: string | null;
  role: string;
  department: string;
  expertise: string;
  city: string;
  country: string;
  locationType: string;
  timezone: string;
  language: string;
  documents: EmployeeDocument[];
};

export type MatchLevel = "Strong match" | "Good match" | "Partial match";

export type ExpertMatch = { employee: Employee; level: MatchLevel; score: number };

export type SearchCriteria = {
  query: string;
  countries: string[];
  departments: string[];
  languages: string[];
  locationTypes: string[];
};

const STOPWORDS = new Set(
  "a an and are as ask asks at be been but by can customer customers do does for from has have how i in is it its me my need of on or our should the their them they this to we what when where which who why will with you your about affects affect question help".split(" "),
);

const COUNTRY_WORDS: Record<string, string[]> = {
  Netherlands: ["netherlands", "dutch", "holland"],
  Belgium: ["belgium", "belgian"],
  Germany: ["germany", "german"],
  France: ["france", "french"],
};

function normalize(word: string) {
  return word.length > 4 && word.endsWith("s") ? word.slice(0, -1) : word;
}

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}%]+/gu, " ")
    .split(" ")
    .filter((w) => w && !STOPWORDS.has(w) && (w.length > 2 || /\d/.test(w)))
    .map(normalize);
}

function countryWords(country: string) {
  return (COUNTRY_WORDS[country] ?? [country.toLowerCase()]).map(normalize);
}

export function interpret(query: string, employees: Employee[]) {
  const words = new Set(tokenize(query));
  const allCountries = [...new Set(employees.map((e) => e.country))];
  const countries = allCountries.filter((c) => countryWords(c).some((w) => words.has(w)));
  // "Netherlands" in the question should also find expertise such as "Dutch payroll".
  const expanded = new Set(words);
  for (const c of countries) countryWords(c).forEach((w) => expanded.add(w));

  const expertise = [...new Set(employees.map((e) => e.expertise))]
    .map((label) => ({ label, hits: tokenize(label).filter((w) => expanded.has(w)).length }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 3)
    .map((x) => x.label);

  return { words, expanded, countries, expertise };
}

const RANK: Record<MatchLevel, number> = { "Strong match": 0, "Good match": 1, "Partial match": 2 };

export function matchEmployees(employees: Employee[], criteria: SearchCriteria): ExpertMatch[] {
  const { words, expanded } = interpret(criteria.query, employees);
  const hasQuery = words.size > 0;
  const matches: ExpertMatch[] = [];

  for (const employee of employees) {
    if (criteria.departments.length && !criteria.departments.includes(employee.department)) continue;
    if (criteria.languages.length && !criteria.languages.includes(employee.language)) continue;
    if (criteria.locationTypes.length && !criteria.locationTypes.includes(employee.locationType)) continue;

    const countryOk = criteria.countries.length === 0 || criteria.countries.includes(employee.country);
    const expertiseWords = tokenize(employee.expertise);
    const expertiseHits = expertiseWords.filter((w) => expanded.has(w)).length;
    const directHits = expertiseWords.filter((w) => words.has(w)).length;
    const roleHits = tokenize(`${employee.role} ${employee.department}`).filter((w) => words.has(w)).length;
    const documentHits = employee.documents.filter((d) => tokenize(d.title).some((w) => words.has(w))).length;

    if (hasQuery ? expertiseHits === 0 || (!countryOk && expertiseHits < 2) : !countryOk) continue;

    const level: MatchLevel = !countryOk
      ? "Partial match"
      : !hasQuery || directHits >= 2
        ? "Strong match"
        : "Good match";
    const score = expertiseHits * 3 + roleHits + Math.min(documentHits, 2) + (countryOk ? 2 : 0);
    matches.push({ employee, level, score });
  }

  return matches.sort(
    (a, b) => RANK[a.level] - RANK[b.level] || b.score - a.score || a.employee.name.localeCompare(b.employee.name),
  );
}

export function employeesToNotify(
  employees: Employee[],
  text: string,
  country: string,
  department: string,
  directId?: string,
) {
  const direct = directId ? employees.find((e) => e.id === directId) : undefined;
  const suggested = text.trim()
    ? matchEmployees(employees, { query: text, countries: [country], departments: [department], languages: [], locationTypes: [] })
        .filter((m) => m.level !== "Partial match" && m.employee.id !== direct?.id)
        .slice(0, 3)
        .map((m) => ({ employee: m.employee, label: m.level as string }))
    : [];
  return [...(direct ? [{ employee: direct, label: "Direct request" }] : []), ...suggested];
}

export function reviewStatus(lastReviewed: string, now: Date) {
  const reviewed = new Date(lastReviewed);
  const months =
    (now.getUTCFullYear() - reviewed.getUTCFullYear()) * 12 + (now.getUTCMonth() - reviewed.getUTCMonth());
  if (months >= 12) return { label: `Not reviewed for ${months} months`, stale: true };
  if (months <= 0) return { label: "Reviewed this month · Current", stale: false };
  return { label: `Reviewed ${months} ${months === 1 ? "month" : "months"} ago · Current`, stale: false };
}
