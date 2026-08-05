import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. This client uses the service_role key, which bypasses Row
// Level Security entirely. It must never be imported into a "use client"
// component or any file that ships to the browser — only into API routes
// (route.ts files) or Server Components that run exclusively on the server.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase admin environment variables. Check .env.local for SUPABASE_SERVICE_ROLE_KEY."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);