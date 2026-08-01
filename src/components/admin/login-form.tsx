"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_PASSWORD = "kemekem2026";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

      // If already authenticated, skip the login page
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("kemekem_admin") === "true"
    ) {
      const next = searchParams.get("next") || "/admin/dashboard";
      router.replace(next);
    }
  }, [router, searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("kemekem_admin", "true");
      document.cookie = `kemekem_admin=true; path=/; max-age=86400; SameSite=Lax`;
      toast.success("Welcome back!");
      const next = searchParams.get("next") || "/admin/dashboard";
      window.location.href = next;
    } else {
      toast.error("Invalid password");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email (optional)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@kemekem.com"
          autoComplete="off"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          Demo password: <span className="font-mono">kemekem2026</span>
        </p>
      </div>
      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}