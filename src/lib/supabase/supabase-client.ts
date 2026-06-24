import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedSupabaseClient) {
    return cachedSupabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set. Add them to your .env.local file (see .env.local.example)."
    );
  }

  cachedSupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
  return cachedSupabaseClient;
}
