"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Don't guard the login page itself.
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    // Check auth from sessionStorage
    const isAuth =
      typeof window !== "undefined" &&
      sessionStorage.getItem("kemekem_admin") === "true";
    if (!isAuth) {
      const next = encodeURIComponent(pathname || "/admin");
      router.replace(`/admin/login?next=${next}`);
      return;
    }
    setReady(true);
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }
  return <>{children}</>;
}