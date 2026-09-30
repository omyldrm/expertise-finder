# Hackathon Setup (Teammates)

The project is already set up. You only need to clone it, install, and add the `.env` file. ~5 minutes.

> ⚠️ Do **not** run `git config --global ...`. It would change the name/email on your school GitLab commits.

---

## Before you start

- Accept the GitHub invite to the repo (check your email or https://github.com/notifications)
- Have Node installed. Check with `node -v`. If it says "not recognized":
  ```powershell
  winget install OpenJS.NodeJS.LTS
  ```
  Then close and reopen the terminal.

---

## 1. Clone and open

```powershell
cd ~\Desktop
git clone <REPO_URL>
cd hackathon-starter
git checkout dev
code .
```

If a browser asks you to sign in to **GitHub**, do it. This doesn't affect your GitLab login.

Use the **terminal inside VS Code** from now on (**Ctrl + `**).

## 2. Install

```powershell
npm install
```

If you see an `allow-scripts` warning, approve the packages it lists and run `npm install` again:

```powershell
npm approve-scripts prisma @prisma/client @prisma/engines unrs-resolver
npm install
```

## 3. Add the `.env` file

```powershell
Copy-Item .env.example .env
```

Open `.env` and paste the `DATABASE_URL` from the team chat:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
```

> ⚠️ Never commit `.env`.

## 4. Run

```powershell
npm run dev
```

Open http://localhost:3000/api/health. If you see `"db":"connected"`, you're done ✅

---

## Branches

| Branch | Purpose |
|---|---|
| `main` | Production (the live Vercel site). **Nobody works here directly.** |
| `dev` | Where all features get merged. Start every feature from here. |
| `feature/...` | Your own work. One branch per feature. |

```
feature/xyz ──PR──► dev ──PR──► main (live site)
```

## Git workflow

Start a new feature:

```powershell
git checkout dev
git pull
git checkout -b feature/your-feature
```

Save and push your work:

```powershell
git add .
git commit -m "Short description"
git push -u origin feature/your-feature
```

Open the link the terminal prints and create a **Pull Request into `dev`** (check that the base branch says `dev`, not `main`).
Vercel adds a **preview link** to the PR. Check it before merging.

After merging:

```powershell
git checkout dev
git pull
```

Someone else merged into `dev` while you're still working? Update your branch:

```powershell
git checkout dev
git pull
git checkout feature/your-feature
git merge dev
```

**Rules**
- Merge small and often (every 30–60 min).
- Never push or merge directly into `main`. Only the repo owner merges `dev` → `main`.
- Run `git status` before committing and make sure `.env` is **not** listed.
- Don't run `npx prisma db push`. Ask in the chat if the database schema needs to change.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Repository not found" on clone | Accept the GitHub invite first |
| `Cannot find module '@prisma/client'` | `npx prisma generate` |
| `/api/health` shows an error | Check `DATABASE_URL` in `.env` |
| `node` / `code` not recognized | Close and reopen the terminal / VS Code |
| PR targets `main` by mistake | Click **Edit** next to the PR title and change the base branch to `dev` |
