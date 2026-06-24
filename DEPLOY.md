# 🚀 Deploy Pandora Flowers to Vercel

Stack: **Next.js 14 · Prisma · PostgreSQL**. The repo already has `vercel.json`
configured (`buildCommand: prisma generate && next build`). You need three
things: a **GitHub repo**, a **hosted Postgres database**, and the **env vars**.

Total time: ~15 minutes.

---

## Step 1 — Push the project to GitHub

From the project folder:

```bash
git add .
git commit -m "Redesign: clean Inter UI, brand system, local images"
git branch -M main
git remote add origin https://github.com/<your-username>/pandora-flowers.git   # if not already set
git push -u origin main
```

> `node_modules` and `.env*` are already git-ignored — your secrets won't be pushed.

---

## Step 2 — Get a hosted PostgreSQL database

Pick one (all have a free tier). You likely already have one — your
`.env.local` already contains a `DATABASE_URL`.

| Provider | Notes |
|---|---|
| **Neon** (recommended) | Serverless Postgres, instant, great with Vercel. neon.tech |
| **Vercel Postgres** | One-click inside the Vercel dashboard → Storage tab |
| **Supabase** | Postgres + dashboard. supabase.com |

Copy the connection string — it looks like:
`postgresql://user:password@host/dbname?sslmode=require`

---

## Step 3 — Import the repo into Vercel

1. Go to **vercel.com → Add New → Project**.
2. Import your GitHub repo. Vercel auto-detects Next.js (don't change build settings — `vercel.json` handles them).
3. Before clicking Deploy, open **Environment Variables** and add the ones below.

### Environment variables (add all)

| Key | Value | Notes |
|---|---|---|
| `DATABASE_URL` | your Postgres URL from Step 2 | required |
| `JWT_SECRET` | a long random string | run `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | a long random string | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | your final URL |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | used for SEO/canonical/OG |
| `ADMIN_EMAIL` | `admin@pandora-flowers.kg` | admin login |
| `ADMIN_PASSWORD` | a strong password | admin login |

4. Click **Deploy**. First build takes ~2 minutes.

---

## Step 4 — Initialise the database (one time)

The Vercel build generates the Prisma client but does **not** create tables or
add products. Do this once, locally, pointing at your **production** database:

```bash
# in the project folder, with your production DATABASE_URL exported:
export DATABASE_URL="postgresql://...your production url..."

npx prisma db push      # creates all tables from prisma/schema.prisma
npm run db:seed         # adds categories, 20 products, admin users
```

Re-deploy isn't needed — the live site reads the database immediately.

> Alternatively, set `DATABASE_URL` in a local `.env` and run the two commands
> without `export`.

---

## Step 5 — Go live & verify

- Visit `https://your-project.vercel.app` — the homepage should load with the
  new design and the branded placeholders.
- Admin panel: `https://your-project.vercel.app/secure-admin`
  → log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Add your real photos (see `public/images/PHOTOS.md`), commit & push — Vercel
  auto-redeploys on every push.

---

## Custom domain (optional)

Vercel → Project → **Settings → Domains** → add `pandora-flowers.kg` (or your
domain) and follow the DNS instructions. Then update `NEXTAUTH_URL` and
`NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy.

---

## Troubleshooting

- **Build fails on Prisma** → ensure `DATABASE_URL` is set in Vercel env (the
  build runs `prisma generate`). The schema push (Step 4) is separate.
- **Site loads but no products** → you skipped Step 4 (`prisma db push` + seed).
- **Broken images** → expected until you add real photos; placeholders show
  meanwhile. See `PHOTOS.md`.
- **Admin 401** → check `JWT_SECRET` is set and `ADMIN_EMAIL`/`ADMIN_PASSWORD`
  match what you seeded.
- **Always run `npm run build` locally once** before deploying to catch any
  TypeScript errors early.

---

## Quick reference

```bash
npm install            # install dependencies
npm run dev            # local dev → http://localhost:3000
npm run build          # production build (run before deploying)
npx prisma db push     # sync schema to the database
npm run db:seed        # seed categories + products + admin
npm run db:studio      # visual database browser
```
