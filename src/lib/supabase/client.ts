import { createClient } from "@supabase/supabase-js";

function getPublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function getSecretKey() {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const createBrowserClient = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getPublishableKey(),
    {
      auth: { persistSession: true, autoRefreshToken: true },
      global: {
        headers: { apikey: getPublishableKey() },
      },
    }
  );

export const createServerClient = async () => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const { createServerClient } = await import("@supabase/ssr");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getPublishableKey(),
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
      global: {
        headers: { apikey: getPublishableKey() },
      },
    }
  );
};

export const createAdminClient = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSecretKey(),
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: { apikey: getSecretKey() },
      },
    }
  );