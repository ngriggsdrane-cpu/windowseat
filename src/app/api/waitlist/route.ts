import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const WAITLIST_FILE = path.join(process.cwd(), "waitlist.json");

interface WaitlistEntry {
  name: string;
  email: string;
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
  const { name, email } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const entries = await readWaitlist();

  if (entries.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json({ message: "You're already on the list!" }, { status: 200 });
  }

  entries.push({ name, email, timestamp: new Date().toISOString() });
  await fs.writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2), "utf8");

  return NextResponse.json({ message: "You're on the list!" }, { status: 201 });
}
