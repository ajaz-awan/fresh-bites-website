import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { siteConfig } from "@/lib/siteConfig";
import type { Order } from "@/types";

// Basic in-memory rate limiting: max 5 attempts per IP per 15 minutes.
// This resets whenever the serverless function cold-starts, so it's a
// speed bump against casual brute-forcing, not a hard guarantee. A
// production-grade setup would use a shared store like Upstash Redis
// so the limit holds across all server instances.
const attemptLog = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const record = attemptLog.get(ip);

  if (record && now - record.firstAttempt < WINDOW_MS) {
    if (record.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }
    record.count += 1;
  } else {
    attemptLog.set(ip, { count: 1, firstAttempt: now });
  }

  const body = await request.json();
  const { password } = body as { password?: string };

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  // Successful login — clear this IP's attempt count.
  attemptLog.delete(ip);

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("business_id", siteConfig.businessId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not fetch orders." }, { status: 500 });
  }

  return NextResponse.json({ orders: (data as Order[]) ?? [] });
}