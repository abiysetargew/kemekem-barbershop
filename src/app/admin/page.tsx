"use client";
import dynamic from "next/dynamic";

// Load AdminShell only on client to avoid SSR issues.
const AdminShell = dynamic(
  () => import("@/components/admin/admin-shell").then((m) => m.AdminShell),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    ),
  }
);

export default function AdminPage() {
  // Client-side auth check
  if (typeof window !== "undefined") {
    const authed = sessionStorage.getItem("kemekem_admin") === "true";
    if (!authed && window.location.pathname !== "/admin/login") {
      window.location.replace("/admin/login?next=" + encodeURIComponent(window.location.pathname));
      return null;
    }
  }
  return <AdminShell initialTab="dashboard" />;
}