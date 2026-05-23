# WindowSeat

GPS audio tour landing page — Next.js 14, TypeScript, Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Waitlist signups are saved to `waitlist.json` in the project root (gitignored).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), click **Add New → Project**, and import the repo.
3. Leave all defaults — Vercel auto-detects Next.js. Click **Deploy**.

> **Note:** The `/api/waitlist` route writes to the local filesystem, which works in development but is ephemeral on Vercel's serverless functions. See below to upgrade to a proper store.

## Upgrading the waitlist API

### Option A — Resend (email notifications + Vercel KV for persistence)

1. `npm install resend @vercel/kv`
2. Add `RESEND_API_KEY` and `KV_*` env vars in Vercel project settings.
3. Replace the `fs.writeFile` logic in `src/app/api/waitlist/route.ts` with:
   - `kv.lpush("waitlist", JSON.stringify(entry))` for persistence.
   - `resend.emails.send(...)` to notify yourself on each signup.

### Option B — Supabase / Postgres

1. Create a `waitlist` table with `name`, `email`, `created_at` columns.
2. `npm install @supabase/supabase-js`
3. Replace the file-write logic with `supabase.from("waitlist").insert(entry)`.

### Option C — Google Sheets via Zapier / Make

Connect your form to a Zapier webhook and pipe it to a Google Sheet — no code changes required.
