const strip = (s: string | undefined) =>
  s && s.charCodeAt(0) === 0xfeff ? s.slice(1) : (s ?? "");

export const SUPABASE_URL = strip(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const SUPABASE_ANON_KEY = strip(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const SUPABASE_SERVICE_ROLE_KEY = strip(process.env.SUPABASE_SERVICE_ROLE_KEY);
export const SUPABASE_URL_PRIVATE = strip(process.env.SUPABASE_URL);
