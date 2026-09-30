export const COUNTRIES = ["Netherlands", "Belgium", "Germany"] as const;
export const DOMAINS = ["Payroll", "HR", "Tax & legal"] as const;
export const LANGUAGES = ["Dutch", "English", "French", "German"] as const;
export const URGENCIES = ["Today", "This week", "No rush"] as const;
export const EVIDENCE_FILTERS = [
  { value: "document", label: "Owns documents" },
  { value: "teams", label: "Answered in Teams" },
  { value: "endorsement", label: "Endorsed by colleagues" },
] as const;

export type Country = (typeof COUNTRIES)[number];
export type Domain = (typeof DOMAINS)[number];
export type Language = (typeof LANGUAGES)[number];
export type EvidenceType = "document" | "teams" | "endorsement" | "project" | "profile";

type Topic = { label: string; keywords: string[] };

export const TOPICS: Topic[] = [
  { label: "Expat taxation", keywords: ["expat", "30%", "ruling", "impatriate", "international assignment", "mobility"] },
  { label: "Payroll setup", keywords: ["payroll", "payslip", "salary", "wage"] },
  { label: "Social security", keywords: ["social security", " a1 ", "cross border", "commuter", "posted worker"] },
  { label: "Leave & absence", keywords: ["leave", "absence", "parental", "maternity", "sick"] },
  { label: "GDPR & data", keywords: ["gdpr", "privacy", "data protection", "personal data"] },
  { label: "Time registration", keywords: ["time registration", "timesheet", "clocking", "overtime"] },
  { label: "Company car", keywords: ["company car", "car benefit", "mobility budget", "fringe benefit"] },
];

const COUNTRY_KEYWORDS: Record<Country, string[]> = {
  Netherlands: ["netherlands", "dutch", " nl ", "amsterdam"],
  Belgium: ["belgium", "belgian", " be ", "brussels"],
  Germany: ["germany", "german", " de "],
};

const DOMAIN_KEYWORDS: Record<Domain, string[]> = {
  Payroll: ["payroll", "payslip", "salary", "wage"],
  HR: [" hr ", "leave", "absence", "onboarding", "time registration"],
  "Tax & legal": ["tax", "legal", "ruling", "gdpr", "law", "social security"],
};

export type Expert = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  team: string;
  city: string;
  country: Country;
  domains: Domain[];
  languages: Language[];
  available: boolean;
  availability: string;
  topics: string[];
  expertise: { area: string; level: "proven" | "self-declared"; note: string }[];
  evidence: { text: string; source: string; type: EvidenceType; topics: string[] }[];
  documents: { title: string; status: string; stale?: boolean }[];
  helpedWith: { title: string; source: string }[];
  endorsedBy: string[];
};

export const EXPERTS: Expert[] = [
  {
    id: "lotte-jansen",
    name: "Lotte Jansen",
    initials: "LJ",
    email: "lotte.jansen@example.com",
    role: "Senior Payroll Consultant",
    team: "Mobility team",
    city: "Amsterdam",
    country: "Netherlands",
    domains: ["Payroll", "Tax & legal"],
    languages: ["Dutch", "English"],
    available: true,
    availability: "Available · usually replies within the day",
    topics: ["Expat taxation", "Payroll setup", "Social security"],
    expertise: [
      { area: "Expat payroll (NL)", level: "proven", note: "Backed by documents + Teams answers" },
      { area: "30% ruling", level: "proven", note: "Owner of the procedure" },
      { area: "Social security (EU)", level: "self-declared", note: "No supporting activity found yet" },
    ],
    evidence: [
      { text: "Owner of the 30% ruling payroll procedure", source: "Intranet doc, updated 2 months ago", type: "document", topics: ["Expat taxation", "Payroll setup"] },
      { text: "Answered similar expat questions", source: "Teams #payroll-nl", type: "teams", topics: ["Expat taxation"] },
      { text: "Expertise endorsed by colleagues", source: "Profile", type: "endorsement", topics: ["Expat taxation", "Payroll setup"] },
    ],
    documents: [
      { title: "30% ruling – payroll procedure", status: "Updated 2 months ago · Current" },
      { title: "Expat onboarding checklist NL", status: "Not reviewed for 14 months", stale: true },
      { title: "Mobility FAQ (Teams wiki)", status: "Co-author" },
    ],
    helpedWith: [
      { title: "Expat hire payroll setup", source: "Teams #payroll-nl · last month" },
      { title: "Cross-border commuter question", source: "Request via Expertise Finder" },
    ],
    endorsedBy: ["pieter-bakker", "joris-de-wit", "elise-peeters", "thomas-maes"],
  },
  {
    id: "pieter-bakker",
    name: "Pieter Bakker",
    initials: "PB",
    email: "pieter.bakker@example.com",
    role: "Tax & Legal Advisor",
    team: "Legal NL",
    city: "Utrecht",
    country: "Netherlands",
    domains: ["Tax & legal"],
    languages: ["Dutch", "English", "German"],
    available: false,
    availability: "In meetings until 15:00",
    topics: ["Expat taxation", "Social security"],
    expertise: [
      { area: "International taxation", level: "self-declared", note: "Declared on profile" },
      { area: "Expat tax regimes (NL)", level: "proven", note: "Author of the internal note" },
    ],
    evidence: [
      { text: "Wrote the internal note on expat tax regimes", source: "SharePoint, updated last year", type: "document", topics: ["Expat taxation"] },
      { text: "Self-declared expertise: international taxation", source: "Profile", type: "profile", topics: ["Expat taxation", "Social security"] },
    ],
    documents: [
      { title: "Expat tax regimes – internal note", status: "Updated last year", stale: true },
      { title: "A1 certificate decision tree", status: "Updated 4 months ago · Current" },
    ],
    helpedWith: [{ title: "German employee working from NL", source: "Teams #legal-nl · 3 weeks ago" }],
    endorsedBy: ["lotte-jansen"],
  },
  {
    id: "elise-peeters",
    name: "Elise Peeters",
    initials: "EP",
    email: "elise.peeters@example.com",
    role: "Implementation Consultant",
    team: "Customer onboarding",
    city: "Antwerp",
    country: "Belgium",
    domains: ["Payroll"],
    languages: ["Dutch", "French", "English"],
    available: true,
    availability: "Available",
    topics: ["Expat taxation", "Payroll setup"],
    expertise: [
      { area: "Payroll implementation (BE)", level: "proven", note: "12 customer go-lives" },
      { area: "Expat hires (BE)", level: "proven", note: "Project history" },
    ],
    evidence: [
      { text: "Set up payroll for expat hires, but for Belgian customers", source: "Project history", type: "project", topics: ["Expat taxation", "Payroll setup"] },
      { text: "Answered payroll setup questions", source: "Teams #implementation", type: "teams", topics: ["Payroll setup"] },
    ],
    documents: [{ title: "Payroll go-live checklist BE", status: "Updated 3 weeks ago · Current" }],
    helpedWith: [{ title: "Payroll setup for new legal entity", source: "Request via Expertise Finder" }],
    endorsedBy: ["thomas-maes", "nadia-el-amrani"],
  },
  {
    id: "thomas-maes",
    name: "Thomas Maes",
    initials: "TM",
    email: "thomas.maes@example.com",
    role: "Belgian Payroll Specialist",
    team: "Payroll BE",
    city: "Brussels",
    country: "Belgium",
    domains: ["Payroll", "Tax & legal"],
    languages: ["Dutch", "French", "English"],
    available: true,
    availability: "Available · usually replies within the hour",
    topics: ["Payroll setup", "Company car", "Social security"],
    expertise: [
      { area: "Belgian payroll", level: "proven", note: "Backed by documents + Teams answers" },
      { area: "Company car benefit", level: "proven", note: "Owner of the calculation guide" },
      { area: "Social security (BE)", level: "proven", note: "Answered 20+ Teams questions" },
    ],
    evidence: [
      { text: "Owner of the company car benefit calculation guide", source: "Intranet doc, updated last month", type: "document", topics: ["Company car", "Payroll setup"] },
      { text: "Answered 20+ Belgian social security questions", source: "Teams #payroll-be", type: "teams", topics: ["Social security", "Payroll setup"] },
      { text: "Endorsed by 6 colleagues for Belgian payroll", source: "Profile", type: "endorsement", topics: ["Payroll setup"] },
    ],
    documents: [
      { title: "Company car benefit – calculation guide", status: "Updated last month · Current" },
      { title: "Belgian payroll year-end checklist", status: "Updated 5 months ago · Current" },
    ],
    helpedWith: [
      { title: "Company car benefit – BE", source: "Request via Expertise Finder · last week" },
      { title: "Payslip correction flow", source: "Teams #payroll-be · last month" },
    ],
    endorsedBy: ["elise-peeters", "nadia-el-amrani", "lotte-jansen"],
  },
  {
    id: "katrin-weber",
    name: "Katrin Weber",
    initials: "KW",
    email: "katrin.weber@example.com",
    role: "HR Consultant",
    team: "HR Services DE",
    city: "Munich",
    country: "Germany",
    domains: ["HR"],
    languages: ["German", "English"],
    available: true,
    availability: "Available",
    topics: ["Leave & absence", "Time registration"],
    expertise: [
      { area: "Parental leave (DE)", level: "proven", note: "Owner of the policy summary" },
      { area: "Time registration", level: "self-declared", note: "No supporting activity found yet" },
    ],
    evidence: [
      { text: "Owner of the German parental leave policy summary", source: "Intranet doc, updated 6 months ago", type: "document", topics: ["Leave & absence"] },
      { text: "Answered leave questions for German customers", source: "Teams #hr-de", type: "teams", topics: ["Leave & absence"] },
    ],
    documents: [{ title: "Parental leave (Elternzeit) – summary", status: "Updated 6 months ago · Current" }],
    helpedWith: [{ title: "Parental leave rules – DE", source: "Request via Expertise Finder · open" }],
    endorsedBy: ["pieter-bakker"],
  },
  {
    id: "nadia-el-amrani",
    name: "Nadia El Amrani",
    initials: "NE",
    email: "nadia.elamrani@example.com",
    role: "Data Protection Officer",
    team: "Compliance",
    city: "Brussels",
    country: "Belgium",
    domains: ["Tax & legal", "HR"],
    languages: ["French", "Dutch", "English"],
    available: false,
    availability: "Out of office until Monday",
    topics: ["GDPR & data"],
    expertise: [
      { area: "GDPR & employee data", level: "proven", note: "Owner of the data retention policy" },
      { area: "Data processing agreements", level: "proven", note: "Backed by documents" },
    ],
    evidence: [
      { text: "Owner of the employee data retention policy", source: "Intranet doc, updated 1 month ago", type: "document", topics: ["GDPR & data"] },
      { text: "Endorsed by colleagues for GDPR questions", source: "Profile", type: "endorsement", topics: ["GDPR & data"] },
    ],
    documents: [
      { title: "Employee data retention policy", status: "Updated 1 month ago · Current" },
      { title: "DPA template for customers", status: "Not reviewed for 18 months", stale: true },
    ],
    helpedWith: [{ title: "Customer request to delete ex-employee data", source: "Teams #compliance · last month" }],
    endorsedBy: ["thomas-maes", "katrin-weber", "elise-peeters"],
  },
  {
    id: "joris-de-wit",
    name: "Joris de Wit",
    initials: "JW",
    email: "joris.dewit@example.com",
    role: "Product Specialist",
    team: "Time & attendance",
    city: "Rotterdam",
    country: "Netherlands",
    domains: ["HR", "Payroll"],
    languages: ["Dutch", "English"],
    available: true,
    availability: "Available",
    topics: ["Time registration", "Leave & absence"],
    expertise: [
      { area: "Time registration setup", level: "proven", note: "Product owner" },
      { area: "Overtime rules (NL)", level: "proven", note: "Backed by Teams answers" },
    ],
    evidence: [
      { text: "Product owner for time registration", source: "Project history", type: "project", topics: ["Time registration"] },
      { text: "Answered overtime and leave balance questions", source: "Teams #time-attendance", type: "teams", topics: ["Time registration", "Leave & absence"] },
    ],
    documents: [{ title: "Time registration – admin guide", status: "Updated 2 weeks ago · Current" }],
    helpedWith: [{ title: "Overtime export to payroll", source: "Teams #time-attendance · last week" }],
    endorsedBy: ["lotte-jansen", "katrin-weber"],
  },
];

export const RECENT_SEARCHES = [
  { query: "Company car benefit – BE", status: "Resolved by Thomas Maes" },
  { query: "Parental leave rules – DE", status: "Open · 2 experts contacted" },
  { query: "Payslip correction flow", status: "Resolved by Thomas Maes" },
];

export const BROWSE_AREAS = [
  "Belgian payroll",
  "Expat & mobility",
  "Social security",
  "Leave & absence",
  "GDPR & data",
  "Time registration",
];

export function getExpert(id: string) {
  return EXPERTS.find((e) => e.id === id);
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((k) => text.includes(k));
}

export function interpret(query: string) {
  const text = ` ${query.toLowerCase().replace(/[^\p{L}\p{N}%]+/gu, " ")} `;
  return {
    topics: TOPICS.filter((t) => includesAny(text, t.keywords)).map((t) => t.label),
    countries: COUNTRIES.filter((c) => includesAny(text, COUNTRY_KEYWORDS[c])),
    domains: DOMAINS.filter((d) => includesAny(text, DOMAIN_KEYWORDS[d])),
  };
}

export type MatchLevel = "Strong match" | "Good match" | "Partial match";

export type SearchCriteria = {
  query: string;
  countries: Country[];
  domains: Domain[];
  language?: Language;
  evidence?: EvidenceType[];
  availableNow?: boolean;
};

export type ExpertMatch = {
  expert: Expert;
  score: number;
  level: MatchLevel;
};

export function matchExperts(criteria: SearchCriteria): ExpertMatch[] {
  const { topics } = interpret(criteria.query);
  const evidenceFilter =
    criteria.evidence && criteria.evidence.length > 0 && criteria.evidence.length < EVIDENCE_FILTERS.length
      ? criteria.evidence
      : null;

  const matches: ExpertMatch[] = [];
  for (const expert of EXPERTS) {
    if (criteria.domains.length && !expert.domains.some((d) => criteria.domains.includes(d))) continue;
    if (criteria.language && !expert.languages.includes(criteria.language)) continue;
    if (criteria.availableNow && !expert.available) continue;
    if (evidenceFilter && !expert.evidence.some((e) => evidenceFilter.includes(e.type))) continue;

    const matchedTopics = expert.topics.filter((t) => topics.includes(t));
    const countryOk = criteria.countries.length === 0 || criteria.countries.includes(expert.country);
    if (topics.length ? matchedTopics.length === 0 : !countryOk) continue;

    const relevant = expert.evidence.filter((e) => e.topics.some((t) => matchedTopics.includes(t)));

    const provenHits = relevant.filter((e) => e.type === "document" || e.type === "teams").length;
    const score = matchedTopics.length * 3 + provenHits + (countryOk ? 2 : 0);

    let level: MatchLevel = "Partial match";
    if (countryOk) {
      const coversQuery = topics.length === 0 || matchedTopics.length >= Math.min(2, topics.length);
      level = coversQuery && provenHits > 0 ? "Strong match" : "Good match";
    }
    matches.push({ expert, score, level });
  }
  const rank: Record<MatchLevel, number> = { "Strong match": 0, "Good match": 1, "Partial match": 2 };
  return matches.sort((a, b) => rank[a.level] - rank[b.level] || b.score - a.score);
}

export function expertsToNotify(text: string, country: Country, domain: Domain, directId?: string) {
  const direct = directId ? getExpert(directId) : undefined;
  const suggested = text.trim()
    ? matchExperts({ query: text, countries: [country], domains: [domain] })
        .filter((m) => m.level !== "Partial match" && m.expert.id !== direct?.id)
        .slice(0, 3)
        .map((m) => ({ expert: m.expert, label: m.level as string }))
    : [];
  return [...(direct ? [{ expert: direct, label: "Direct request" }] : []), ...suggested];
}

export function allDocuments() {
  return EXPERTS.flatMap((owner) => owner.documents.map((doc) => ({ ...doc, owner })));
}
