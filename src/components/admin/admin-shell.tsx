"use client";
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
  Scissors as ScissorsIcon,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DashboardView } from "@/components/admin/dashboard-view";
import { BookingsView } from "@/components/admin/bookings-view";
import { ServicesView } from "@/components/admin/services-view";
import { BarbersView } from "@/components/admin/barbers-view";
import { CustomersView } from "@/components/admin/customers-view";
import { GalleryView } from "@/components/admin/gallery-view";
import { BranchesView } from "@/components/admin/branches-view";
import { SettingsView } from "@/components/admin/settings-view";
import { ReportsView } from "@/components/admin/reports-view";
import { StylistsView } from "@/components/admin/stylists-view";
import { cn } from "@/lib/utils";

type Tab =
  | "dashboard"
  | "bookings"
  | "services"
  | "barbers"
  | "stylists"
  | "customers"
  | "gallery"
  | "branches"
  | "reports"
  | "settings";

const NAV: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "services", label: "Services", icon: Scissors },
  { id: "barbers", label: "Barbers", icon: UserCircle },
  { id: "stylists", label: "Staylists", icon: Sparkles },
  { id: "customers", label: "Customers", icon: Users },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "branches", label: "Branches", icon: Building2 },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AdminShell({ initialTab = "dashboard" }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("tab") as Tab | null;
      if (t && NAV.some((n) => n.id === t)) setTab(t);
    }
  }, []);

  const onTabChange = (t: Tab) => {
    setTab(t);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", t);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const onLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("kemekem_admin");
      document.cookie = "kemekem_admin=; path=/; max-age=0";
    }
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
              <ScissorsIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold leading-none">Kemekem</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Admin Panel
              </div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
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
        <div className="border-t border-border p-3 space-y-1">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            View public site
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 md:hidden">
              <ScissorsIcon className="h-4 w-4" />
              <span className="font-display text-base font-semibold">Kemekem</span>
            </Link>
            <div className="hidden text-sm md:block">
              <span className="font-display text-xl">
                {NAV.find((n) => n.id === tab)?.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="rounded-full border border-border px-3 py-1 text-xs hover:bg-muted md:hidden"
            >
              Site
            </Link>
            <button
              onClick={onLogout}
              className="rounded-full border border-border px-3 py-1 text-xs hover:bg-muted"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="border-b border-border bg-background md:hidden">
          <nav className="flex gap-1 overflow-x-auto p-2 scrollbar-hide">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  tab === item.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <TabHost tab={tab} />
        </main>
      </div>
    </div>
  );
}

function TabHost({ tab }: { tab: Tab }) {
  if (tab === "dashboard") return <DashboardView />;
  if (tab === "bookings") return <BookingsView />;
  if (tab === "services") return <ServicesView />;
  if (tab === "barbers") return <BarbersView />;
  if (tab === "stylists") return <StylistsView />;
  if (tab === "customers") return <CustomersView />;
  if (tab === "gallery") return <GalleryView />;
  if (tab === "branches") return <BranchesView />;
  if (tab === "reports") return <ReportsView />;
  if (tab === "settings") return <SettingsView />;
  return null;
}