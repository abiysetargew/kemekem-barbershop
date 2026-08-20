"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin", password }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        toast.error(j.error || "Invalid password");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("kemekem_admin", "true");
      document.cookie = `kemekem_admin=true; path=/; max-age=86400; SameSite=Lax`;
      toast.success("Welcome back!");
      const next = searchParams.get("next") || "/admin/dashboard";
      window.location.href = next;
    } catch (err: any) {
      toast.error(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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