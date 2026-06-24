import { redirect } from "next/navigation";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth-client";
import { LibraryPageContent } from "@/components/LibraryPageContent";

export default async function LibraryPage() {
  const supabase = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return <LibraryPageContent user={user} />;
}
