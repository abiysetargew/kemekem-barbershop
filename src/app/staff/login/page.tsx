"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Scissors } from "lucide-react";
import { toast } from "sonner";

export default function StaffLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password === "staff2026" || password === "kemekem2026") {
      sessionStorage.setItem("kemekem_staff", "true");
      toast.success("Welcome");
      router.push("/staff");
    } else {
      toast.error("Wrong password");
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
        <p className="mt-4 text-xs text-muted-foreground">
          Demo password: <span className="font-mono">staff2026</span>
        </p>
      </div>
    </div>
  );
}