"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  UserCircle,
  Image as ImageIcon,
  Building2,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/admin-guard";
import { DashboardView } from "@/components/admin/dashboard-view";
import { ServicesView } from "@/components/admin/services-view";
import { BarbersView } from "@/components/admin/barbers-view";
import { BranchesView } from "@/components/admin/branches-view";
import { CustomersView } from "@/components/admin/customers-view";
import { GalleryView } from "@/components/admin/gallery-view";
import { SettingsView } from "@/components/admin/settings-view";
import { ReportsView } from "@/components/admin/reports-view";
import { AppointmentsView } from "@/components/admin/appointments-view";
import { cn } from "@/lib/utils";

type Tab =
  | "dashboard"
  | "appointments"
  | "services"
  | "barbers"
  | "customers"
  | "gallery"
  | "branches"
  | "reports"
  | "settings";

const NAV: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "services", label: "Services", icon: Scissors },
  { id: "barbers", label: "Barbers", icon: UserCircle },
  { id: "customers", label: "Customers", icon: Users },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "branches", label: "Branches", icon: Building2 },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

function AdminShell() {
  const [tab, setTab] = useState<Tab>("dashboard");

  const onLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("kemekem_admin");
      document.cookie = "kemekem_admin=; path=/; max-age=0";
    }
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-base font-semibold">Kemekem</span>
            <span className="rounded-md bg-gold-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-700">
              Admin
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                tab === item.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <Link
            href="/"
            className="mt-2 block rounded-lg px-3 py-2 text-center text-xs text-muted-foreground hover:bg-muted"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
          <div className="md:hidden">
            <Link href="/" className="font-display font-semibold">
              Kemekem Admin
            </Link>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">admin@kemekem.com</span>
            <div className="h-8 w-8 rounded-full bg-foreground" />
          </div>
        </header>

        {/* Mobile nav */}
        <div className="border-b border-border bg-background md:hidden">
          <nav className="flex gap-1 overflow-x-auto p-2">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                  tab === item.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <main className="flex-1 p-4 md:p-8">
          {tab === "dashboard" && <DashboardView />}
          {tab === "appointments" && <AppointmentsView />}
          {tab === "services" && <ServicesView />}
          {tab === "barbers" && <BarbersView />}
          {tab === "customers" && <CustomersView />}
          {tab === "gallery" && <GalleryView />}
          {tab === "branches" && <BranchesView />}
          {tab === "reports" && <ReportsView />}
          {tab === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // children is unused; the layout renders its own client UI
  return <AdminGuard><AdminShell /></AdminGuard>;
}