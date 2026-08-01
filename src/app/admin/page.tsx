"use client";
import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authed = sessionStorage.getItem("kemekem_admin") === "true";
      if (!authed) {
        window.location.replace("/admin/login");
      } else {
        window.location.replace("/admin/dashboard");
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading admin…</p>
      </div>
    </div>
  );
}