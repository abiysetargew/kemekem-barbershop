"use client";
// Unified data store for the whole app.
//
// Storage model:
// - Sticky base data (services, barbers, branches, settings, socials, gallery)
//   is held in localStorage and seeded with `seed-data.ts` on first load.
//   Admin edits persist in this layer and re-render the public site live.
// - Bookings + customers are stored separately, with demo bookings seeded
//   so the admin/staff screens are never empty.
//
// To enable multi-device sync in production, swap the localStorage calls
// with Supabase calls — same hooks + API surface stays the same.

import { useEffect, useState, useCallback } from "react";
import {
  SEED_SERVICES,
  SEED_BARBERS,
  SEED_BRANCHES,
  SEED_REVIEWS,
  SEED_SOCIALS,
  SEED_GALLERY,
  SEED_SETTINGS,
  SAMPLE_BOOKINGS,
  SAMPLE_CUSTOMERS,
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

const STORAGE = {
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

const SEED_FLAG = "kemekem.seeded.v2";

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
  } catch {}
}

export function ensureSeeded() {
  if (!isBrowser()) return;
  if (localStorage.getItem(SEED_FLAG)) return;
  save(STORAGE.services, SEED_SERVICES);
  save(STORAGE.barbers, SEED_BARBERS);
  save(STORAGE.branches, SEED_BRANCHES);
  save(STORAGE.reviews, SEED_REVIEWS);
  save(STORAGE.socials, SEED_SOCIALS);
  save(STORAGE.gallery, SEED_GALLERY);
  save(STORAGE.settings, SEED_SETTINGS);
  // Seed bookings + customers so admin/staff screens are populated.
  // Customers & appointments are deduplicated on save.
  const existing = load<any[]>(STORAGE.appointments, []);
  if (existing.length === 0) {
    save(STORAGE.appointments, SAMPLE_BOOKINGS);
  }
  const existingCustomers = load<any[]>(STORAGE.customers, []);
  if (existingCustomers.length === 0) {
    save(STORAGE.customers, SAMPLE_CUSTOMERS);
  }
  localStorage.setItem(SEED_FLAG, "1");
}

export function resetSeedData() {
  if (!isBrowser()) return;
  Object.values(STORAGE).forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem(SEED_FLAG);
  ensureSeeded();
}

function useStoredCollection<T extends { id: string }>(
  key: string,
  fallback: T[]
) {
  const [data, setData] = useState<T[]>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    ensureSeeded();
    setData(load<T[]>(key, fallback));
    setHydrated(true);
    const onStorage = () => setData(load<T[]>(key, fallback));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  // Lightweight custom event for same-tab updates
  useEffect(() => {
    const onUpdate = () => setData(load<T[]>(key, fallback));
    window.addEventListener("kemekem:update", onUpdate);
    return () => window.removeEventListener("kemekem:update", onUpdate);
  }, [key, fallback]);

  const update = useCallback(
    (next: T[] | ((prev: T[]) => T[])) => {
      const value = typeof next === "function" ? (next as (p: T[]) => T[])(data) : next;
      setData(value);
      save(key, value);
      // Notify sibling components
      window.dispatchEvent(new CustomEvent("kemekem:update"));
    },
    [key, data]
  );

  return [data, update, hydrated] as const;
}

function useStoredValue<T>(key: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    ensureSeeded();
    setData(load<T>(key, fallback));
    setHydrated(true);
    const onStorage = () => setData(load<T>(key, fallback));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  useEffect(() => {
    const onUpdate = () => setData(load<T>(key, fallback));
    window.addEventListener("kemekem:update", onUpdate);
    return () => window.removeEventListener("kemekem:update", onUpdate);
  }, [key, fallback]);

  const update = useCallback(
    (next: T) => {
      setData(next);
      save(key, next);
      window.dispatchEvent(new CustomEvent("kemekem:update"));
    },
    [key]
  );

  return [data, update, hydrated] as const;
}

// ============= PUBLIC HOOKS =============
export function useServices() {
  return useStoredCollection<Service>(STORAGE.services, SEED_SERVICES);
}

export function useBarbers() {
  return useStoredCollection<Barber>(STORAGE.barbers, SEED_BARBERS);
}

export function useBranches() {
  return useStoredCollection<Branch>(STORAGE.branches, SEED_BRANCHES);
}

export function useSocials() {
  return useStoredCollection<SocialLink>(STORAGE.socials, SEED_SOCIALS);
}

export function useGallery() {
  return useStoredCollection<GalleryItem>(STORAGE.gallery, SEED_GALLERY);
}

export function useReviews() {
  return useStoredCollection<Review>(STORAGE.reviews, SEED_REVIEWS);
}

export function useBusinessSettings() {
  return useStoredValue<BusinessSettings>(STORAGE.settings, SEED_SETTINGS);
}

export function useAppointments() {
  return useStoredCollection<Appointment>(STORAGE.appointments, SAMPLE_BOOKINGS);
}

export function useCustomers() {
  return useStoredCollection<Customer>(STORAGE.customers, SAMPLE_CUSTOMERS);
}

// ============= HELPERS =============
export function nextId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const STORAGE_KEYS = STORAGE;