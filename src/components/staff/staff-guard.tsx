"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const ADMIN_PASS = "kemekem2026";
const STAFF_PASS = "staff2026";

export function StaffGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isAuth =
      typeof window !== "undefined" &&
      (sessionStorage.getItem("kemekem_staff") === "true" ||
        sessionStorage.getItem("kemekem_admin") === "true");
    if (!isAuth && !pathname?.endsWith("/login")) {
      router.replace("/staff/login");
    } else {
      setReady(true);
    }
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

export function StaffLoginGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export { ADMIN_PASS, STAFF_PASS };