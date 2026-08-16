"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { createBrowserClient } from "@/lib/supabase/client";

export default function ManagePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [searching, setSearching] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      router.push(`/manage/${token.trim()}`);
      return;
    }
    if (phone.trim()) {
      setSearching(true);
      try {
        const supabase = createBrowserClient();
        const cleaned = phone.replace(/\s/g, "");
        const { data } = await supabase
          .from("appointments")
          .select("cancel_token")
          .or(`customer_phone.ilike.%${cleaned}%`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data?.cancel_token) {
          router.push(`/manage/${data.cancel_token}`);
          return;
        }
        alert("No booking found for that phone number. Use the link from your confirmation message.");
      } catch {
        alert("Search failed. Try again or use the link from your confirmation message.");
      } finally {
        setSearching(false);
      }
    }
  };

  return (
    <section className="min-h-screen pt-32 pb-20">
      <div className="container-tight max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background">
            <Calendar className="h-7 w-7" />
          </div>
          <h1 className="display mt-6 text-4xl sm:text-5xl">Manage your booking</h1>
          <p className="mt-3 text-muted-foreground">
            Enter your phone number or paste your booking link.
          </p>
        </motion.div>

        <form onSubmit={submit} className="mt-10 space-y-5 rounded-3xl border border-border bg-card p-7">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251 92 ..."
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Booking link token
            </label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your token here"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 font-mono text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {searching ? "Searching…" : "Find my booking"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-border/60 bg-muted/30 p-5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <MapPin className="h-4 w-4" />
            Prefer the direct link?
          </p>
          <p className="mt-1.5">
            Use the link in your confirmation message to manage a specific booking directly.
          </p>
        </div>
      </div>
    </section>
  );
}