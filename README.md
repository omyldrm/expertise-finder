# Expertise Finder

**Find the colleague who can help, and see why you can trust them.**

Built at the Tectonic Hackathon (30 September 2026) for the SD Worx challenge
*"Unlock the Knowledge Within — Find it. Understand it. Trust it."*

> How might we turn fragmented organisational knowledge into a trusted shared resource?

---

## The problem

SD Worx helps organisations across Europe run HR, payroll and workforce operations. It has
more than 10,000 employees, serves more than 100,000 customers, supports more than 6 million
payslips and has payroll reach in more than 100 countries. That scale creates a huge amount of
expertise, and makes it hard to find.

Knowledge lives in policies, procedures, Teams channels, shared files and, often, only in the heads
of experienced colleagues. A search can return ten documents. The harder questions are:

- Is this answer **current**?
- Does it apply to **this customer, this country, this situation**?
- **Who owns it**, and who can I ask when the document isn't enough?

The challenge describes a familiar moment: an urgent customer question comes in, and the AI
assistant finds three documents. One was recently updated, one has no owner, and one may apply to
another country. A colleague then shares contradictory information from Teams. The information
exists, but the employee still can't act with confidence.

## Our answer

Expertise Finder starts from that moment of doubt. Instead of returning more documents, it returns
**people**: the colleagues who have actually worked on the topic, owned the procedure or answered
the question before. It also shows the signals you need to decide whether to trust them.

It focuses on the **Connect** inspiration area (*how might people find the right expertise when
documents are not enough?*) and touches on **Trust** and **Detect**.

| Challenge question | How Expertise Finder answers it |
| --- | --- |
| Who has relevant expertise? | Describe the request in plain language. We read the country, domain and topics from your text and rank colleagues by match. |
| What applies in this context? | Country and domain filters. A colleague from another country is still shown, but clearly marked as a *Partial match*. |
| What is current? | Every document shows when it was last reviewed. Stale documents (e.g. *Not reviewed for 14 months*) are highlighted. |
| Who owns this? | The Documents page lists every procedure and guide next to its owner, linked to their profile. |
| What if nobody fits? | Post a request. Matching colleagues are notified, and resolved answers can be saved back to the knowledge base. |

## How it works

1. **Search** (`/`): describe the customer question, e.g. *"A customer in the Netherlands is hiring
   an expat and asks how the 30% ruling affects their payroll setup."* Optionally narrow by country,
   domain, language and urgency.
2. **Results** (`/results`): the app shows what it *understood* (e.g. `Netherlands`,
   `Expat taxation`, `Payroll setup`) so you can correct it. Colleagues are ranked as **Strong**,
   **Good** or **Partial** matches. Filters apply instantly, and you can message someone in Teams
   in one click.
3. **Expert profile** (`/experts/[id]`): their expertise, the documents they own and how fresh
   they are, contact details, and other colleagues with the same expertise.
4. **Documents** (`/documents`): every document with its owner. Search by document, owner or team,
   or show only the ones that need review.
5. **Create request** (`/requests/new`): when nobody fits, post a request. The *Will be notified*
   panel updates live as you type, so you can see who will receive it before you post.
6. **My requests** (`/requests`): posted requests with their status and who was notified. They are
   stored in Postgres.

## Tech stack

- **Next.js 16** (App Router, Server Components, Server Actions) + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**, IBM Plex type
- **Prisma** ORM on **Supabase** Postgres
- Designed first as wireframes, then built screen by screen

### Project structure

```
src/
  app/
    page.tsx               Search
    results/page.tsx       Ranked results + filters
    experts/[id]/page.tsx  Expert profile
    documents/page.tsx     Documents and their owners
    requests/page.tsx      My requests (from the database)
    requests/new/page.tsx  Create request
    requests/actions.ts    Server Action that validates and stores a request
  components/              Header, forms and shared UI
  lib/directory.ts         Loads employees from the database
  lib/matching.ts          Understands a request and ranks colleagues
prisma/
  schema.prisma            Database schema (employee ERD + requests)
  seed.mjs                 Fictional payroll/HR demo employees
  sql/                     SQL for tables added on top of the ERD
```

## Running it locally

Requirements: Node.js 20+ and a Postgres database (we use [Supabase](https://supabase.com)).

```bash
git clone <repo-url>
cd hackathon-starter
npm install
cp .env.example .env        # then set DATABASE_URL (see below)
npx prisma db push          # creates the tables on an empty database
npx prisma db seed          # fills them with demo employees
npm run dev
```

Open <http://localhost:3000>.

**Supabase connection string:** use the **Session pooler** string from *Connect* in the Supabase
dashboard. The direct `db.<project>.supabase.co` address only works over IPv6, which most networks
and Vercel don't support.

`npx prisma db seed` **replaces all employee data** in the database. If you pull a version that
changed `prisma/schema.prisma`, run `npx prisma generate`.

## Security

Security is part of the judging, so we kept it in mind from the start:

- **No secrets in the repository.** `.env` is git-ignored; only `.env.example` with a placeholder is committed.
- **Server-side validation.** The create-request Server Action checks every field against allowed values and trims and caps the length of free-text input.
- **The server decides who gets notified.** The notified list is recalculated on the server, so a
  modified browser request can't notify arbitrary people.
- **Safe links.** Links attached to a request are only rendered as clickable links when they are `http(s)`. This blocks `javascript:` URLs.
- **Parameterised queries** through Prisma. The app contains no hand-written SQL.
- **Row Level Security** is enabled on the tables the app adds, so they can't be read through
  Supabase's public API.

## Limitations and next steps

We were honest about what a one-day proof of concept can do:

- **Demo data.** The 24 employees and their documents are fictional (`prisma/seed.mjs`), stored in
  the team's ERD (`fact_employee`, `employee_expertise`, `employee_location`, `employee_language`,
  `contact_info`) plus an `employee_document` table for document ownership. The ERD has no name
  column, so names are derived from email addresses. Each employee has one expertise area.
- **Keyword matching.** Requests are understood with a fixed list of topic keywords. An LLM or
  embeddings would handle any phrasing and language.
- **No sign-in.** *My requests* shows every request, not just yours. A real deployment would put this
  behind SD Worx single sign-on and only show a user their own requests.
- **Notifications are recorded, not sent.** We store who should be notified; sending Teams
  messages is the next step.
- **Real signals.** In production, expertise and document review dates would come from the
  intranet, SharePoint and Teams rather than being entered by hand.

## Why this matters for SD Worx

Every hour a consultant spends looking for the right person or the right version of a procedure is an
hour not spent helping a customer. At SD Worx's scale, across countries, domains and teams, that
uncertainty repeats thousands of times. Expertise Finder turns *"I found something"* into
*"I know who to ask, and why I can rely on them."* Every resolved request makes the next person's
search faster.
