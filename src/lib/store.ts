"use client";
// Local data store for the admin panel + booking system.
// All admin edits and bookings live in browser localStorage (per browser/device).
// Public site reads seed data; admin and customer-facing flows read/write to this store.
//
// To upgrade to true multi-device/multi-user sync, swap the localStorage calls
// with Supabase calls in the functions below — same API surface.

import { useEffect, useState, useCallback } from "react";
import {
  SEED_SERVICES,
  SEED_BARBERS,
  SEED_BRANCHES,
  SEED_REVIEWS,
  SEED_SOCIALS,
  SEED_GALLERY,
  SEED_SETTINGS,
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
} from "@/types/database";

const KEYS = {
  services: "kemekem.services",
  barbers: "kemekem.barbers",
  branches: "kemekem.branches",
  reviews: "kemekem.reviews",
  socials: "kemekem.socials",
  gallery: "kemekem.gallery",
  settings: "kemekem.settings",
  appointments: "kemekem.appointments",
  customers: "kemekem.customers",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function load<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

// Hydrate seed data into localStorage on first visit
function ensureSeeded() {
  if (!isBrowser()) return;
  if (!localStorage.getItem("kemekem.seeded")) {
    save(KEYS.services, SEED_SERVICES);
    save(KEYS.barbers, SEED_BARBERS);
    save(KEYS.branches, SEED_BRANCHES);
    save(KEYS.reviews, SEED_REVIEWS);
    save(KEYS.socials, SEED_SOCIALS);
    save(KEYS.gallery, SEED_GALLERY);
    save(KEYS.settings, SEED_SETTINGS);
    localStorage.setItem("kemekem.seeded", "1");
  }
}

// ============= GENERIC HOOK =============
function useStoredCollection<T extends { id: string }>(
  key: string,
  fallback: T[]
) {
  const [data, setData] = useState<T[]>(fallback);

  useEffect(() => {
    ensureSeeded();
    setData(load<T[]>(key, fallback));
    const onStorage = () => setData(load<T[]>(key, fallback));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T[] | ((prev: T[]) => T[])) => {
      const value = typeof next === "function" ? (next as (p: T[]) => T[])(data) : next;
      setData(value);
      save(key, value);
    },
    [key, data]
  );

  return [data, update] as const;
}

function useStoredValue<T>(key: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    ensureSeeded();
    setData(load<T>(key, fallback));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T) => {
      setData(next);
      save(key, next);
    },
    [key]
  );

  return [data, update] as const;
}

// ============= PUBLIC HOOKS =============
export function useServices() {
  return useStoredCollection<Service>(KEYS.services, SEED_SERVICES);
}

export function useBarbers() {
  return useStoredCollection<Barber>(KEYS.barbers, SEED_BARBERS);
}

export function useBranches() {
  return useStoredCollection<Branch>(KEYS.branches, SEED_BRANCHES);
}

export function useSocials() {
  return useStoredCollection<SocialLink>(KEYS.socials, SEED_SOCIALS);
}

export function useGallery() {
  return useStoredCollection<GalleryItem>(KEYS.gallery, SEED_GALLERY);
}

export function useReviews() {
  return useStoredCollection<Review>(KEYS.reviews, SEED_REVIEWS);
}

export function useBusinessSettings() {
  return useStoredValue<BusinessSettings>(KEYS.settings, SEED_SETTINGS);
}

export function useAppointments() {
  return useStoredCollection<Appointment>(KEYS.appointments, []);
}

export function useCustomers() {
  return useStoredCollection<{ id: string; name: string; phone: string; email?: string; notes?: string; visit_count: number; last_visit_at: string | null; created_at: string; updated_at: string }>(
    KEYS.customs as any || "kemekem.customers",
    []
  );
}

// ============= HELPERS =============
export function nextId() {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
