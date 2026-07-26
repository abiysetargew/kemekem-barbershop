import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerClient();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [{ data: services }, { data: branches }] = await Promise.all([
    supabase.from("services").select("id, updated_at"),
    supabase.from("branches").select("id, updated_at"),
  ]);

  const staticRoutes = ["", "/services", "/gallery", "/about", "/contact", "/book"].map(
    (p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.8,
    })
  );

  const dynamicRoutes = [
    ...(services || []).map((s: any) => ({
      url: `${base}/book?service=${s.id}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...(branches || []).map((b: any) => ({
      url: `${base}/book?branch=${b.id}`,
      lastModified: new Date(b.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}