"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Scissors } from "lucide-react";
import { toast } from "sonner";

export default function StaffLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "staff", password }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        toast.error(j.error || "Wrong password");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("kemekem_staff", "true");
      document.cookie = `kemekem_staff=true; path=/; max-age=86400; SameSite=Lax`;
      toast.success("Welcome");
      router.push("/staff");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground text-background">
          <Scissors className="h-7 w-7" />
        </div>
        <h1 className="display mt-5 text-3xl">Staff sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quick access for barbers and front desk.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-card px-4 text-center font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-foreground text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}