import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const WAITLIST_FILE = path.join(process.cwd(), "waitlist.json");

interface WaitlistEntry {
  name: string;
  email: string;
  role: "rider" | "partner";
  org?: string;
  timestamp: string;
}

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const data = await fs.readFile(WAITLIST_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, org } = body;
  const role: "rider" | "partner" = body.role === "partner" ? "partner" : "rider";

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (role === "partner" && !org) {
    return NextResponse.json({ error: "Please add your company or organization." }, { status: 400 });
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const entries = await readWaitlist();

  if (entries.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json({ message: "You're already on the list!" }, { status: 200 });
  }

  entries.push({ name, email, role, org: role === "partner" ? org : undefined, timestamp: new Date().toISOString() });
  await fs.writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2), "utf8");

  const message = role === "partner" ? "Thanks — we'll reach out shortly." : "You're on the list!";
  return NextResponse.json({ message }, { status: 201 });
}
