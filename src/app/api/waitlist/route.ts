import { NextRequest, NextResponse } from "next/server";
import { insertRow } from "@/lib/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 200);
  const role = body.role === "partner" ? "partner" : "traveler";
  const org = role === "partner" ? String(body.org ?? "").trim().slice(0, 200) : null;
  const ref = body.ref ? String(body.ref).slice(0, 64) : null;

  if (!name || !email) return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (role === "partner" && !org) return NextResponse.json({ error: "Add your company or organization." }, { status: 400 });

  const ok = await insertRow("signups", { name, email, role, org, ref, created_at: new Date().toISOString() });
  if (!ok) return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });

  const message = role === "partner" ? "Thanks. We'll be in touch about a pilot." : "You're on the list.";
  return NextResponse.json({ message }, { status: 201 });
}
