import Link from "next/link";
import { redirect } from "next/navigation";
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
import { createServerClient } from "@/lib/supabase/client";
import { LogoutButton } from "@/components/admin/logout-button";
import { SidebarLink } from "@/components/admin/sidebar-link";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/services", label: "Services", icon: Scissors },
  { href: "/admin/barbers", label: "Barbers", icon: UserCircle },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/branches", label: "Branches", icon: Building2 },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground">
            <span className="font-display text-lg font-bold gold-text">K</span>
          </div>
          <div>
            <div className="font-display text-sm font-semibold">Kemekem</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Admin
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <SidebarLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-2 rounded-lg bg-muted/60 p-3 text-xs">
            <div className="font-medium text-foreground">{user.email}</div>
            <div className="text-muted-foreground capitalize">{(admin as any).role}</div>
          </div>
          <LogoutButton />
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
            <Link href="/admin" className="font-display font-semibold">
              Kemekem Admin
            </Link>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <div className="h-8 w-8 rounded-full bg-foreground" />
          </div>
        </header>

        {/* Mobile nav */}
        <div className="border-b border-border bg-background md:hidden">
          <nav className="scrollbar-hide flex gap-1 overflow-x-auto p-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}