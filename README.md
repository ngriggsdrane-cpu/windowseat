# WindowSeat

WindowSeat landing page and prototype — Next.js 14, TypeScript, Tailwind CSS, deployed on Vercel from `main`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Signups and analytics

Signups (`/api/waitlist`) and events (`/api/events`) are written to Supabase when these environment variables are set in Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server only, never exposed to the browser)

Create the tables once with `supabase/schema.sql`. Without these variables, rows are written to Vercel's runtime logs instead, so nothing is silently dropped, but logs are not a long-term store.

Partner links: add `?ref=hotel-name` to any URL. The ref is kept for the browser session and attached to signups and events. No precise location is ever collected.
