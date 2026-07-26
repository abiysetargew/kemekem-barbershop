import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export const createBrowserClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Falls back: new publishable key name, then legacy anon key
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: true, autoRefreshToken: true },
    }
  );

export const createServerClient = async () => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const { createServerClient } = await import("@supabase/ssr");
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component context
          }
        },
      },
    }
  );
};

export const createAdminClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );