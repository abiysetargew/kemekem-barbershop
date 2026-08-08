"use client";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { useEffect, useState, type ReactNode } from "react";

export function ClientLayout({ children }: { children: ReactNode }) {
  // Wait until mounted on client to render anything that depends on
  // browser-only state (theme, pathname, etc.). The static markup stays
  // identical to server output because we render the same components.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Providers>
      <div
        className="flex min-h-screen flex-col bg-background"
        suppressHydrationWarning
      >
        {mounted && <Header />}
        {!mounted ? <div style={{ minHeight: "60vh" }} /> : <main className="flex-1">{children}</main>}
        {mounted && <Footer />}
        {mounted && <FloatingActions />}
        {!mounted && <div className="flex-1">{children}</div>}
      </div>
    </Providers>
  );
}