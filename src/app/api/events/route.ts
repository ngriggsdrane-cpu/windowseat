import { NextRequest, NextResponse } from "next/server";
import { insertRow } from "@/lib/store";

// Allow-listed events only. Props are short strings/numbers; no coordinates accepted.
const ALLOWED = new Set([
  "landing_viewed",
  "signup_submitted",
  "journey_search",
  "routes_shown",
  "scenic_selected",
  "journey_started",
  "audio_started",
  "audio_paused",
  "audio_skipped",
  "journey_completed",
  "feedback_submitted",
]);
const BLOCKED_KEYS = /lat|lng|lon|coord|location|email|name/i;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const event = String(body.event ?? "");
  if (!ALLOWED.has(event)) return new NextResponse(null, { status: 204 });

  const props: Record<string, string | number> = {};
  const raw = (body.props ?? {}) as Record<string, unknown>;
  for (const [k, v] of Object.entries(raw).slice(0, 10)) {
    if (BLOCKED_KEYS.test(k)) continue;
    if (typeof v === "number" || typeof v === "string") props[k.slice(0, 32)] = typeof v === "string" ? v.slice(0, 64) : v;
  }

  await insertRow("events", {
    event,
    props,
    ref: body.ref ? String(body.ref).slice(0, 64) : null,
    session: String(body.session ?? "anon").slice(0, 32),
    created_at: new Date().toISOString(),
  });
  return new NextResponse(null, { status: 204 });
}
