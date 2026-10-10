import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import SidebarNavPreview from "@/components/dashboard";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
}

export default function ProtectedPage() {
  return (
    <div className="h-full w-full bg-black text-[#7FFF00]">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-[#7FFF00]/60">
            Loading dashboard...
          </div>
        }
      >
        <SidebarNavPreview />
      </Suspense>
    </div>
  );
}
