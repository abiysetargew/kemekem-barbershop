"use client";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { useEffect, useState, type ReactNode } from "react";

export function ClientLayout({ children }: { children: ReactNode }) {
  // Server renders a static loader. Client renders the real UI.
  // This guarantees zero hydration mismatches — server output never
  // tries to render components that depend on browser state.
  return (
    <Providers>
      <div className="flex min-h-screen flex-col bg-background">
        <ClientChrome>{children}</ClientChrome>
      </div>
    </Providers>
  );
}

function ClientChrome({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <div className="h-16 border-b border-border bg-background/85 backdrop-blur-xl" />
        <main className="flex-1">{children}</main>
        <div className="h-32" />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}