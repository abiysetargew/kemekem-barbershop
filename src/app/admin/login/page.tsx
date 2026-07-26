import { Scissors } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Admin Login", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground">
            <span className="font-display text-2xl font-bold gold-text">K</span>
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage Kemekem Barbershop
          </p>
        </div>
        <div className="luxury-card p-7">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}