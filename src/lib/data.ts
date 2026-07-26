import { createServerClient } from "@/lib/supabase/client";
import type {
  Branch,
  Service,
  Barber,
  Review,
  BusinessSettings,
  SocialLink,
  GalleryItem,
} from "@/types/database";

/**
 * Server-side data fetchers.
 * Used in Server Components for SEO + speed.
 */
export async function getBusinessSettings(): Promise<BusinessSettings | null> {
  const supabase = await createServerClient();
  const { data } = await supabase.from("business_settings").select("*").single();
  return (data as BusinessSettings) || null;
}

export async function getBranches(): Promise<Branch[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return (data as Branch[]) || [];
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_visible", true)
    .order("display_order");
  return (data as Service[]) || [];
}

export async function getBarbers(): Promise<Barber[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("barbers")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return (data as Barber[]) || [];
}

export async function getFeaturedBarbers(): Promise<Barber[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("barbers")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("display_order");
  return (data as Barber[]) || [];
}

export async function getReviews(): Promise<Review[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });
  return (data as Review[]) || [];
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .order("display_order");
  return (data as SocialLink[]) || [];
}

export async function getGallery(): Promise<GalleryItem[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("display_order");
  return (data as GalleryItem[]) || [];
}