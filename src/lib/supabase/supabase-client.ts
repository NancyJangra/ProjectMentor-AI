import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL_PRIVATE, SUPABASE_SERVICE_ROLE_KEY } from "./env";

let cachedSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedSupabaseClient) {
    return cachedSupabaseClient;
  }

  if (!SUPABASE_URL_PRIVATE || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set. Add them to your .env.local file (see .env.local.example)."
    );
  }

  cachedSupabaseClient = createClient(SUPABASE_URL_PRIVATE, SUPABASE_SERVICE_ROLE_KEY);
  return cachedSupabaseClient;
}
