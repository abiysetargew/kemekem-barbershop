-- Comprehensive Supabase schema fixes
-- Run each block separately in SQL Editor, or all at once.

-- 1. Replace business_settings with singleton-id PK
drop table if exists public.business_settings cascade;

create table public.business_settings (
  id text primary key default 'singleton',
  shop_id uuid,
  business_name text not null default 'Kemekem Barbershop',
  tagline text,
  logo_url text,
  favicon_url text,
  hero_image_url text,
  hero_video_url text,
  phone text,
  email text,
  address text,
  maps_url text,
  business_hours jsonb default '{"open":"08:00","close":"20:00","days":"Mon-Sun"}'::jsonb,
  primary_color text default '#C89B3C',
  booking_interval_minutes int default 30,
  seo_title text,
  seo_description text,
  seo_keywords text,
  og_image_url text,
  footer_text text,
  updated_at timestamptz default now()
);

alter table public.business_settings enable row level security;

drop policy if exists "public read business_settings" on public.business_settings;
create policy "public read business_settings" on public.business_settings
  for select using (true);

drop policy if exists "public write business_settings" on public.business_settings;
create policy "public write business_settings" on public.business_settings
  for all using (true) with check (true);

insert into public.business_settings (id, business_name)
values ('singleton', 'Kemekem Barbershop')
on conflict (id) do nothing;

-- 2. Fix cancel_token (must have a value, regenerate if missing)
alter table public.appointments alter column cancel_token set default uuid_generate_v4();
update public.appointments set cancel_token = uuid_generate_v4() where cancel_token is null;

-- 3. Make sure appointment_number is set for existing rows
update public.appointments
set appointment_number = 'KEM-' || to_char(created_at, 'YYYYMMDD') || '-' || lpad((random() * 10000)::int::text, 4, '0')
where appointment_number is null or appointment_number = '';

-- 4. Ensure RLS policies allow public read for all relevant tables
drop policy if exists "public read branches" on public.branches;
create policy "public read branches" on public.branches for select using (true);

drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services for select using (true);

drop policy if exists "public read barbers" on public.barbers;
create policy "public read barbers" on public.barbers for select using (true);

drop policy if exists "public read gallery" on public.gallery;
create policy "public read gallery" on public.gallery for select using (true);

drop policy if exists "public read reviews" on public.reviews;
create policy "public read reviews" on public.reviews for select using (true);

drop policy if exists "public read social_links" on public.social_links;
create policy "public read social_links" on public.social_links for select using (true);