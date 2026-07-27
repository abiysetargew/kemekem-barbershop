import {
  SEED_BRANCHES,
  SEED_SERVICES,
  SEED_BARBERS,
  SEED_REVIEWS,
  SEED_SETTINGS,
  SEED_SOCIALS,
  SEED_GALLERY,
} from "@/lib/seed-data";
import type {
  Branch,
  Service,
  Barber,
  Review,
  BusinessSettings,
  SocialLink,
  GalleryItem,
} from "@/types/database";

// All fetchers try Supabase first, then fall back to seed data on any error.
// This way the site works even if Supabase is misconfigured.
async function safeFetch<T>(
  fetcher: () => Promise<{ data: T | null }>,
  fallback: T
): Promise<T> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return fallback;
    const { data } = await fetcher();
    return (data as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const { createServerClient } = await import("@/lib/supabase/client");
  const supabase = await createServerClient();
  return safeFetch<BusinessSettings>(
    async () => supabase.from("business_settings").select("*").maybeSingle(),
    SEED_SETTINGS
  );
}

export async function getBranches(): Promise<Branch[]> {
  return safeFetch<Branch[]>(
    async () => {
      const { createServerClient } = await import("@/lib/supabase/client");
      const supabase = await createServerClient();
      return supabase
        .from("branches")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
    },
    SEED_BRANCHES
  );
}

export async function getServices(): Promise<Service[]> {
  return safeFetch<Service[]>(
    async () => {
      const { createServerClient } = await import("@/lib/supabase/client");
      const supabase = await createServerClient();
      return supabase
        .from("services")
        .select("*")
        .eq("is_visible", true)
        .order("display_order");
    },
    SEED_SERVICES
  );
}

export async function getBarbers(): Promise<Barber[]> {
  return safeFetch<Barber[]>(
    async () => {
      const { createServerClient } = await import("@/lib/supabase/client");
      const supabase = await createServerClient();
      return supabase
        .from("barbers")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
    },
    SEED_BARBERS
  );
}

export async function getFeaturedBarbers(): Promise<Barber[]> {
  return safeFetch<Barber[]>(
    async () => {
      const { createServerClient } = await import("@/lib/supabase/client");
      const supabase = await createServerClient();
      return supabase
        .from("barbers")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("display_order");
    },
    SEED_BARBERS.filter((b) => b.is_featured)
  );
}

export async function getReviews(): Promise<Review[]> {
  return safeFetch<Review[]>(
    async () => {
      const { createServerClient } = await import("@/lib/supabase/client");
      const supabase = await createServerClient();
      return supabase
        .from("reviews")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });
    },
    SEED_REVIEWS
  );
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return safeFetch<SocialLink[]>(
    async () => {
      const { createServerClient } = await import("@/lib/supabase/client");
      const supabase = await createServerClient();
      return supabase.from("social_links").select("*").order("display_order");
    },
    SEED_SOCIALS
  );
}

export async function getGallery(): Promise<GalleryItem[]> {
  return safeFetch<GalleryItem[]>(
    async () => {
      const { createServerClient } = await import("@/lib/supabase/client");
      const supabase = await createServerClient();
      return supabase.from("gallery").select("*").order("display_order");
    },
    SEED_GALLERY
  );
}