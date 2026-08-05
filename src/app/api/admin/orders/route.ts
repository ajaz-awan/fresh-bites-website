import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { siteConfig } from "@/lib/siteConfig";
import type { Order } from "@/types";

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const { password } = body as { password?: string };

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

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