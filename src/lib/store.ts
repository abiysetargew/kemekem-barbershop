"use client";
// Unified data store for the whole app.
//
// READS:  Supabase browser client (real-time + initial fetch).
// WRITES: Next.js API routes with admin client (bypasses RLS, more reliable).
//
// After every write, we re-fetch the affected table to ensure UI consistency.

import { useEffect, useState, useCallback, useRef } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import {
  SEED_SERVICES,
  SEED_BARBERS,
  SEED_BRANCHES,
  SEED_SOCIALS,
  SEED_GALLERY,
  SEED_SETTINGS,
  SEED_REVIEWS,
} from "./seed-data";
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

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function generateUuid(): string {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============= SERVER ROUTE HELPERS =============
async function apiUpsert<T>(table: string, row: T): Promise<T> {
  const res = await fetch(`/api/admin/table/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Upsert ${table} failed (${res.status})`);
  }
  return (await res.json()) as T;
}

async function apiDelete(table: string, id: string): Promise<void> {
  const res = await fetch(`/api/admin/table/${table}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Delete ${table} failed (${res.status})`);
  }
}

// ============= COLLECTION HOOK =============
function useSupabaseCollection<T extends { id: string }>(
  table: string,
  orderBy: string = "display_order",
  ascending: boolean = true,
  fallback: T[] = []
) {
  const [data, setData] = useState<T[]>(fallback);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataRef = useRef<T[]>(fallback);
  dataRef.current = data;

  const refetch = useCallback(async () => {
    const supabase = getSupabase();
    let q: any = supabase.from(table).select("*");
    q = q.order(orderBy, { ascending });
    const { data: rows, error: err } = await q;
    if (err) {
      setError(err.message);
      return;
    }
    const next = (rows ?? []) as T[];
    setData(next);
    dataRef.current = next;
    setHydrated(true);
  }, [table, orderBy, ascending]);

  useEffect(() => {
    refetch();
    // Polling every 4s for cross-device reliability
    const interval = setInterval(refetch, 4000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Optimistic update helper
  const setLocal = (next: T[]) => {
    setData(next);
    dataRef.current = next;
  };

  const update = useCallback(
    async (next: T[] | ((prev: T[]) => T[])) => {
      const value =
        typeof next === "function"
          ? (next as (p: T[]) => T[])(dataRef.current)
          : next;
      setLocal(value);
      // Persist each row via API
      try {
        const saved: T[] = [];
        for (const row of value) {
          const r = await apiUpsert(table, row);
          saved.push(r);
        }
        setLocal(saved);
      } catch (e: any) {
        console.error(`[update ${table}]`, e);
        setError(e.message);
        // Refetch to recover
        refetch();
        throw e;
      }
    },
    [table, refetch]
  );

  const updateOne = useCallback(
    async (id: string, mutator: (item: T) => T) => {
      const target = dataRef.current.find((x) => x.id === id);
      if (!target) return;
      const updated = mutator(target);
      // Optimistic
      const optimistic = dataRef.current.map((item) => (item.id === id ? updated : item));
      setLocal(optimistic);
      try {
        const saved = await apiUpsert(table, updated);
        // Replace by id (saved.id might differ if old id wasn't UUID)
        const next = dataRef.current.map((x) => (x.id === id ? saved : x));
        setLocal(next);
      } catch (e: any) {
        console.error(`[updateOne ${table}]`, e);
        setError(e.message);
        refetch();
        throw e;
      }
    },
    [table, refetch]
  );

  const remove = useCallback(
    async (id: string) => {
      const next = dataRef.current.filter((x) => x.id !== id);
      setLocal(next);
      try {
        await apiDelete(table, id);
      } catch (e: any) {
        console.error(`[remove ${table}]`, e);
        setError(e.message);
        refetch();
        throw e;
      }
    },
    [table, refetch]
  );

  const insert = useCallback(
    async (row: T): Promise<T> => {
      try {
        const saved = await apiUpsert(table, row);
        const next = [...dataRef.current, saved];
        setLocal(next);
        return saved;
      } catch (e: any) {
        console.error(`[insert ${table}]`, e);
        setError(e.message);
        throw e;
      }
    },
    [table]
  );

  return [data, update, updateOne, remove, insert, { hydrated, error }] as const;
}

// ============= SINGLETON HOOK =============
function useSupabaseSingleton<T extends Record<string, any>>(
  table: string,
  fixedId: string,
  fallback: T
) {
  const [data, setData] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataRef = useRef<T>(fallback);
  dataRef.current = data;

  const refetch = useCallback(async () => {
    const supabase = getSupabase();
    const { data: row, error: err } = await supabase
      .from(table)
      .select("*")
      .eq("id", fixedId)
      .maybeSingle();
    if (err) {
      setError(err.message);
      return;
    }
    if (row) {
      setData(row as T);
      dataRef.current = row as T;
    }
    setHydrated(true);
  }, [table, fixedId]);

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, 4000);
    return () => clearInterval(interval);
  }, [refetch]);

  const update = useCallback(
    async (patch: Partial<T> | T) => {
      const merged = { ...dataRef.current, ...patch, id: fixedId } as T;
      setData(merged);
      dataRef.current = merged;
      try {
        const saved = await apiUpsert(table, merged);
        setData(saved as T);
        dataRef.current = saved as T;
      } catch (e: any) {
        console.error(`[update ${table}]`, e);
        setError(e.message);
        refetch();
        throw e;
      }
    },
    [table, fixedId, refetch]
  );

  return [data, update, { hydrated, error }] as const;
}

// ============= PUBLIC HOOKS =============
export function useServices() {
  const [data, update, updateOne, remove, insert, meta] = useSupabaseCollection<Service>(
    "services",
    "display_order",
    true,
    SEED_SERVICES
  );
  return [data, update, updateOne, remove, insert, meta.hydrated] as const;
}

export function useBarbers() {
  const [data, update, updateOne, remove, insert, meta] = useSupabaseCollection<Barber>(
    "barbers",
    "display_order",
    true,
    SEED_BARBERS
  );
  return [data, update, updateOne, remove, insert, meta.hydrated] as const;
}

export function useBranches() {
  const [data, update, updateOne, remove, insert, meta] = useSupabaseCollection<Branch>(
    "branches",
    "display_order",
    true,
    SEED_BRANCHES
  );
  return [data, update, updateOne, remove, insert, meta.hydrated] as const;
}

export function useSocials() {
  const [data, update, updateOne, remove, insert, meta] = useSupabaseCollection<SocialLink>(
    "social_links",
    "display_order",
    true,
    SEED_SOCIALS
  );
  return [data, update, updateOne, remove, insert, meta.hydrated] as const;
}

export function useGallery() {
  const [data, update, updateOne, remove, insert, meta] = useSupabaseCollection<GalleryItem>(
    "gallery",
    "display_order",
    true,
    SEED_GALLERY
  );
  return [data, update, updateOne, remove, insert, meta.hydrated] as const;
}

export function useReviews() {
  const [data, update, updateOne, remove, insert, meta] = useSupabaseCollection<Review>(
    "reviews",
    "created_at",
    false,
    SEED_REVIEWS
  );
  return [data, update, updateOne, remove, insert, meta.hydrated] as const;
}

export function useAppointments() {
  const [data, update, updateOne, remove, insert, meta] = useSupabaseCollection<Appointment>(
    "appointments",
    "appointment_date",
    false,
    []
  );
  return [data, update, updateOne, remove, insert, meta.hydrated] as const;
}

export function useCustomers() {
  const [data, update, updateOne, remove, insert, meta] = useSupabaseCollection<Customer>(
    "customers",
    "created_at",
    false,
    []
  );
  return [data, update, updateOne, remove, insert, meta.hydrated] as const;
}

export function useBusinessSettings() {
  const [data, update, meta] = useSupabaseSingleton<BusinessSettings>(
    "business_settings",
    "singleton",
    SEED_SETTINGS as BusinessSettings
  );
  return [data, update, meta.hydrated] as const;
}

// ============= HELPERS =============
export function nextId(_prefix = "id") {
  return generateUuid();
}

export { apiUpsert, apiDelete };