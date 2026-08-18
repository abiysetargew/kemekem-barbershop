"use client";
// Unified data store for the whole app.
//
// Storage model: Supabase (Postgres) is the source of truth.
// Hooks read from Supabase on mount, subscribe to real-time changes,
// and write through Supabase on mutations.

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

// Global registry to share channels across multiple hook instances
const channelRegistry = new Map<string, { count: number; refetch: () => void }>();
let channelInstanceCounter = 0;

function acquireChannel(table: string, refetch: () => void): () => void {
  let entry = channelRegistry.get(table);
  if (!entry) {
    const supabase = getSupabase();
    const channelName = `${table}-rt-${++channelInstanceCounter}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => entry?.refetch()
      )
      .subscribe();
    entry = { count: 0, refetch };
    channelRegistry.set(table, entry);
    entry.refetch();
    // Stash cleanup function on entry
    (entry as any)._cleanup = () => {
      supabase.removeChannel(channel);
      channelRegistry.delete(table);
    };
  }
  entry.count += 1;
  entry.refetch = refetch;
  return () => {
    if (!entry) return;
    entry.count -= 1;
    if (entry.count <= 0) {
      const cleanup = (entry as any)._cleanup;
      if (cleanup) cleanup();
    }
  };
}

// ============= LOW-LEVEL MUTATIONS =============
async function upsertRow<T extends { id?: string }>(table: string, row: T): Promise<T> {
  const supabase = getSupabase();
  const r: any = { ...row };
  if (r.id && !isUuid(r.id)) delete r.id;
  const { data, error } = await supabase.from(table).upsert(r).select().single();
  if (error) {
    console.error(`[UPSERT ${table}]`, error, r);
    throw new Error(error.message);
  }
  return data as T;
}

async function upsertRows<T extends { id?: string }>(table: string, rows: T[]): Promise<T[]> {
  if (rows.length === 0) return [];
  const cleaned = rows.map((row) => {
    const r: any = { ...row };
    if (r.id && !isUuid(r.id)) delete r.id;
    return r;
  });
  const supabase = getSupabase();
  const { data, error } = await supabase.from(table).upsert(cleaned).select();
  if (error) {
    console.error(`[UPSERT-MANY ${table}]`, error);
    throw new Error(error.message);
  }
  return (data ?? []) as T[];
}

async function deleteRow(table: string, id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    console.error(`[DELETE ${table}]`, error);
    throw new Error(error.message);
  }
}

async function updateRow<T>(table: string, id: string, patch: Partial<T>): Promise<T> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(table)
    .update(patch as any)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error(`[UPDATE ${table}]`, error);
    throw new Error(error.message);
  }
  return data as T;
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
    const release = acquireChannel(table, refetch);
    const onFocus = () => refetch();
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
    }
    // Polling fallback every 5s — guarantees cross-tab sync even if real-time misses
    const interval = setInterval(refetch, 5000);
    return () => {
      release();
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", onFocus);
      }
      clearInterval(interval);
    };
  }, [refetch, table]);

  const update = useCallback(
    async (next: T[] | ((prev: T[]) => T[])) => {
      const value =
        typeof next === "function"
          ? (next as (p: T[]) => T[])(dataRef.current)
          : next;
      setData(value);
      dataRef.current = value;
      try {
        await upsertRows(table, value);
      } catch (e) {
        console.error(`[update ${table}]`, e);
        throw e;
      }
    },
    [table]
  );

  const updateOne = useCallback(
    async (id: string, mutator: (item: T) => T) => {
      const target = dataRef.current.find((x) => x.id === id);
      if (!target) return;
      const updated = mutator(target);
      const next = dataRef.current.map((item) => (item.id === id ? updated : item));
      setData(next);
      dataRef.current = next;
      try {
        const saved = await upsertRow(table, updated);
        // If Supabase gave us a new id (because old id wasn't UUID), remap
        if (saved.id !== id) {
          const remapped = dataRef.current.map((x) => (x.id === id ? saved : x));
          setData(remapped);
          dataRef.current = remapped;
        }
      } catch (e) {
        console.error(`[updateOne ${table}]`, e);
        throw e;
      }
    },
    [table]
  );

  const remove = useCallback(
    async (id: string) => {
      const next = dataRef.current.filter((x) => x.id !== id);
      setData(next);
      dataRef.current = next;
      try {
        await deleteRow(table, id);
      } catch (e) {
        console.error(`[remove ${table}]`, e);
        throw e;
      }
    },
    [table]
  );

  const insert = useCallback(
    async (row: T): Promise<T> => {
      try {
        const saved = await upsertRow(table, row);
        const next = [...dataRef.current, saved];
        setData(next);
        dataRef.current = next;
        return saved;
      } catch (e) {
        console.error(`[insert ${table}]`, e);
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
    } else {
      // Insert default
      const seed = { ...fallback, id: fixedId };
      const { data: created, error: insertErr } = await supabase
        .from(table)
        .upsert(seed as any)
        .select()
        .single();
      if (!insertErr && created) {
        setData(created as T);
        dataRef.current = created as T;
      }
    }
    setHydrated(true);
  }, [table, fixedId]);

  useEffect(() => {
    refetch();
    const release = acquireChannel(table, refetch);
    const onFocus = () => refetch();
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
    }
    // Polling fallback every 5s — guarantees cross-tab sync even if real-time misses
    const interval = setInterval(refetch, 5000);
    return () => {
      release();
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", onFocus);
      }
      clearInterval(interval);
    };
  }, [refetch, table]);

  const update = useCallback(
    async (patch: Partial<T> | T) => {
      const merged = { ...dataRef.current, ...patch, id: fixedId } as T;
      setData(merged);
      dataRef.current = merged;
      try {
        await updateRow(table, fixedId, patch as Partial<T>);
      } catch (e) {
        console.error(`[update ${table}]`, e);
        throw e;
      }
    },
    [table, fixedId]
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

export { upsertRow, upsertRows, deleteRow, updateRow };