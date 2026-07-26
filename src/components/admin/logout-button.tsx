"use client";
import { LogOut } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const onLogout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <button
      onClick={onLogout}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}