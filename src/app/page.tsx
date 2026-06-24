import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth-client";
import { HomePageContent } from "@/components/HomePageContent";

export default async function HomePage() {
  const supabase = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <HomePageContent user={user} />;
}
