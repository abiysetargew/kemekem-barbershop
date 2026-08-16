"use client";
// Unified data store for the whole app.
//
// Storage model: Supabase (Postgres) is the source of truth.
// Hooks read from Supabase on mount, subscribe to real-time changes,
// and optimistically update local state on writes.

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { SEED_SERVICES, SEED_BARBERS, SEED_BRANCHES, SEED_SOCIALS, SEED_GALLERY, SEED_SETTINGS, SEED_REVIEWS } from "./seed-data";
import type {
  Branch,
  Service,
  Barber,
  Review,
  BusinessSettings,
  SocialLink,
  GalleryItem,
  Appointment,
  Customer,
} from "@/types/database";

function getSupabase() {
  return createBrowserClient();
}

function useSupabaseCollection<T extends { id: string }>(
  table: string,
  orderBy: string = "display_order",
  filters?: (q: any) => any,
  fallback: T[] = []
) {
  const [data, setData] = useState<T[]>(fallback);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const supabase = getSupabase();
    let q: any = supabase.from(table).select("*");
    if (filters) q = filters(q);
    q = q.order(orderBy);
    const { data: rows, error: err } = await q;
    if (err) {
      setError(err.message);
      return;
    }
    setData((rows as T[]) ?? []);
    setHydrated(true);
  }, [table, orderBy]);

  useEffect(() => {
    fetchAll();
    const supabase = getSupabase();
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => fetchAll()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  const update = useCallback(
    async (next: T[] | ((prev: T[]) => T[])) => {
      const value = typeof next === "function" ? (next as (p: T[]) => T[])(data) : next;
      setData(value);
    },
    [data]
  );

  const updateOne = useCallback(
    async (id: string, mutator: (item: T) => T) => {
      const next = data.map((item) => (item.id === id ? mutator(item) : item));
      setData(next);
    },
    [data]
  );

  return [data, update, updateOne, { hydrated, error }] as const;
}

async function persistRow<T>(table: string, row: T): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(table).upsert(row as any);
  if (error) {
    console.error(`[UPSERT ${table}]`, error);
    throw new Error(error.message);
  }
}

async function removeRow(table: string, id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    console.error(`[DELETE ${table}]`, error);
    throw new Error(error.message);
  }
}

function useSupabaseSingle<T>(
  table: string,
  fallback: T,
  match?: { column: string; value: any }
) {
  const [data, setData] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  const fetchOne = useCallback(async () => {
    const supabase = getSupabase();
    let q: any = supabase.from(table).select("*");
    if (match) q = q.eq(match.column, match.value).maybeSingle();
    else q = q.limit(1).maybeSingle();
    const { data: row } = await q;
    if (row) setData(row as T);
    setHydrated(true);
  }, [table, match?.column, match?.value]);

  useEffect(() => {
    fetchOne();
    const supabase = getSupabase();
    const channel = supabase
      .channel(`${table}-single-changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => fetchOne()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOne]);

  const update = useCallback(async (next: T) => {
    setData(next);
  }, []);

  return [data, update, { hydrated }] as const;
}

// ============= PUBLIC HOOKS =============
export function useServices() {
  const [data, setData, , meta] = useSupabaseCollection<Service>(
    "services",
    "display_order",
    (q) => q.order("display_order"),
    SEED_SERVICES
  );
  const update = useCallback(
    async (next: Service[] | ((prev: Service[]) => Service[])) => {
      const value = typeof next === "function" ? (next as (p: Service[]) => Service[])(data) : next;
      setData(value);
      await Promise.all(value.map((row) => persistRow("services", row)));
    },
    [data, setData]
  );
  const updateOne = useCallback(
    async (id: string, mutator: (item: Service) => Service) => {
      const next = data.map((item) => (item.id === id ? mutator(item) : item));
      const target = next.find((x) => x.id === id);
      setData(next);
      if (target) await persistRow("services", target);
    },
    [data, setData]
  );
  const remove = useCallback(
    async (id: string) => {
      setData(data.filter((x) => x.id !== id));
      await removeRow("services", id);
    },
    [data, setData]
  );
  return [data, update, updateOne, meta.hydrated, remove] as const;
}

export function useBarbers() {
  const [data, setData, , meta] = useSupabaseCollection<Barber>(
    "barbers",
    "display_order",
    undefined,
    SEED_BARBERS
  );
  const update = useCallback(
    async (next: Barber[] | ((prev: Barber[]) => Barber[])) => {
      const value = typeof next === "function" ? (next as (p: Barber[]) => Barber[])(data) : next;
      setData(value);
      await Promise.all(value.map((row) => persistRow("barbers", row)));
    },
    [data, setData]
  );
  const updateOne = useCallback(
    async (id: string, mutator: (item: Barber) => Barber) => {
      const next = data.map((item) => (item.id === id ? mutator(item) : item));
      const target = next.find((x) => x.id === id);
      setData(next);
      if (target) await persistRow("barbers", target);
    },
    [data, setData]
  );
  const remove = useCallback(
    async (id: string) => {
      setData(data.filter((x) => x.id !== id));
      await removeRow("barbers", id);
    },
    [data, setData]
  );
  return [data, update, updateOne, meta.hydrated, remove] as const;
}

export function useBranches() {
  const [data, setData, , meta] = useSupabaseCollection<Branch>(
    "branches",
    "display_order",
    undefined,
    SEED_BRANCHES
  );
  const update = useCallback(
    async (next: Branch[] | ((prev: Branch[]) => Branch[])) => {
      const value = typeof next === "function" ? (next as (p: Branch[]) => Branch[])(data) : next;
      setData(value);
      await Promise.all(value.map((row) => persistRow("branches", row)));
    },
    [data, setData]
  );
  const updateOne = useCallback(
    async (id: string, mutator: (item: Branch) => Branch) => {
      const next = data.map((item) => (item.id === id ? mutator(item) : item));
      const target = next.find((x) => x.id === id);
      setData(next);
      if (target) await persistRow("branches", target);
    },
    [data, setData]
  );
  const remove = useCallback(
    async (id: string) => {
      setData(data.filter((x) => x.id !== id));
      await removeRow("branches", id);
    },
    [data, setData]
  );
  return [data, update, updateOne, meta.hydrated, remove] as const;
}

export function useSocials() {
  const [data, setData, , meta] = useSupabaseCollection<SocialLink>(
    "social_links",
    "display_order",
    undefined,
    SEED_SOCIALS
  );
  const update = useCallback(
    async (next: SocialLink[] | ((prev: SocialLink[]) => SocialLink[])) => {
      const value = typeof next === "function" ? (next as (p: SocialLink[]) => SocialLink[])(data) : next;
      setData(value);
      await Promise.all(value.map((row) => persistRow("social_links", row)));
    },
    [data, setData]
  );
  const updateOne = useCallback(
    async (id: string, mutator: (item: SocialLink) => SocialLink) => {
      const next = data.map((item) => (item.id === id ? mutator(item) : item));
      const target = next.find((x) => x.id === id);
      setData(next);
      if (target) await persistRow("social_links", target);
    },
    [data, setData]
  );
  const remove = useCallback(
    async (id: string) => {
      setData(data.filter((x) => x.id !== id));
      await removeRow("social_links", id);
    },
    [data, setData]
  );
  return [data, update, updateOne, meta.hydrated, remove] as const;
}

export function useGallery() {
  const [data, setData, , meta] = useSupabaseCollection<GalleryItem>(
    "gallery",
    "display_order",
    undefined,
    SEED_GALLERY
  );
  const update = useCallback(
    async (next: GalleryItem[] | ((prev: GalleryItem[]) => GalleryItem[])) => {
      const value = typeof next === "function" ? (next as (p: GalleryItem[]) => GalleryItem[])(data) : next;
      setData(value);
      await Promise.all(value.map((row) => persistRow("gallery", row)));
    },
    [data, setData]
  );
  const updateOne = useCallback(
    async (id: string, mutator: (item: GalleryItem) => GalleryItem) => {
      const next = data.map((item) => (item.id === id ? mutator(item) : item));
      const target = next.find((x) => x.id === id);
      setData(next);
      if (target) await persistRow("gallery", target);
    },
    [data, setData]
  );
  const remove = useCallback(
    async (id: string) => {
      setData(data.filter((x) => x.id !== id));
      await removeRow("gallery", id);
    },
    [data, setData]
  );
  return [data, update, updateOne, meta.hydrated, remove] as const;
}

export function useReviews() {
  const [data, setData, , meta] = useSupabaseCollection<Review>(
    "reviews",
    "created_at",
    (q) => q.order("created_at", { ascending: false }),
    SEED_REVIEWS
  );
  const update = useCallback(
    async (next: Review[] | ((prev: Review[]) => Review[])) => {
      const value = typeof next === "function" ? (next as (p: Review[]) => Review[])(data) : next;
      setData(value);
      await Promise.all(value.map((row) => persistRow("reviews", row)));
    },
    [data, setData]
  );
  const updateOne = useCallback(
    async (id: string, mutator: (item: Review) => Review) => {
      const next = data.map((item) => (item.id === id ? mutator(item) : item));
      const target = next.find((x) => x.id === id);
      setData(next);
      if (target) await persistRow("reviews", target);
    },
    [data, setData]
  );
  const remove = useCallback(
    async (id: string) => {
      setData(data.filter((x) => x.id !== id));
      await removeRow("reviews", id);
    },
    [data, setData]
  );
  return [data, update, updateOne, meta.hydrated, remove] as const;
}

export function useBusinessSettings() {
  const [data, setData, meta] = useSupabaseSingle<BusinessSettings>(
    "business_settings",
    SEED_SETTINGS
  );
  const update = useCallback(async (next: BusinessSettings) => {
    setData(next);
    const supabase = getSupabase();
    const { error } = await supabase
      .from("business_settings")
      .upsert(next as any);
    if (error) console.error("[SETTINGS UPSERT]", error);
  }, [setData]);
  return [data, update, meta.hydrated] as const;
}

export function useAppointments() {
  const [data, setData, , meta] = useSupabaseCollection<Appointment>(
    "appointments",
    "appointment_date",
    (q) => q.order("appointment_date", { ascending: false }).order("start_time"),
    []
  );
  const update = useCallback(
    async (next: Appointment[] | ((prev: Appointment[]) => Appointment[])) => {
      const value = typeof next === "function" ? (next as (p: Appointment[]) => Appointment[])(data) : next;
      setData(value);
    },
    [data, setData]
  );
  const updateOne = useCallback(
    async (id: string, mutator: (item: Appointment) => Appointment) => {
      const next = data.map((item) => (item.id === id ? mutator(item) : item));
      const target = next.find((x) => x.id === id);
      setData(next);
      if (target) await persistRow("appointments", target);
    },
    [data, setData]
  );
  const remove = useCallback(
    async (id: string) => {
      setData(data.filter((x) => x.id !== id));
      await removeRow("appointments", id);
    },
    [data, setData]
  );
  return [data, update, updateOne, meta.hydrated, remove] as const;
}

export function useCustomers() {
  const [data, setData, , meta] = useSupabaseCollection<Customer>(
    "customers",
    "created_at",
    (q) => q.order("created_at", { ascending: false }),
    []
  );
  const update = useCallback(
    async (next: Customer[] | ((prev: Customer[]) => Customer[])) => {
      const value = typeof next === "function" ? (next as (p: Customer[]) => Customer[])(data) : next;
      setData(value);
    },
    [data, setData]
  );
  const updateOne = useCallback(
    async (id: string, mutator: (item: Customer) => Customer) => {
      const next = data.map((item) => (item.id === id ? mutator(item) : item));
      const target = next.find((x) => x.id === id);
      setData(next);
      if (target) await persistRow("customers", target);
    },
    [data, setData]
  );
  const remove = useCallback(
    async (id: string) => {
      setData(data.filter((x) => x.id !== id));
      await removeRow("customers", id);
    },
    [data, setData]
  );
  return [data, update, updateOne, meta.hydrated, remove] as const;
}

// ============= HELPERS =============
export function nextId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
