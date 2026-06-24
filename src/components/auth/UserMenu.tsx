"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type { User } from "@supabase/supabase-js";

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const displayName: string =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.user_metadata?.user_name ??
    user.email ??
    "Account";

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[120px] truncate text-xs text-muted sm:block">
        {displayName}
      </span>
      <button
        type="button"
        onClick={handleSignOut}
        className="text-sm font-medium text-muted transition-colors duration-150 hover:text-warning"
      >
        Sign out
      </button>
    </div>
  );
}
