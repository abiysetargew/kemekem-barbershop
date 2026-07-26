-- Kemekem Barbershop Database Schema
-- Designed as SaaS-ready multi-tenant from day one.
-- A `shop_id` is reserved on every table to allow future multi-shop support.
-- Run this in Supabase SQL editor.

-- =========================================================
-- EXTENSIONS
-- =========================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =========================================================
-- ENUMS
-- =========================================================
create type appointment_status as enum (
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

create type day_of_week as enum (
  'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
);

-- =========================================================
-- BRANCHES
-- =========================================================
create table public.branches (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid, -- reserved for future multi-tenant SaaS
  name text not null,
  address text not null,
  city text,
  phone text,
  maps_url text,
  working_hours jsonb default '{"open":"08:00","close":"20:00"}'::jsonb,
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- SERVICES
-- =========================================================
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid,
  name text not null,
  description text,
  image_url text,
  duration_minutes int not null default 30,
  price numeric(10,2) not null default 0,
  category text,
  is_visible boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- BARBERS
-- =========================================================
create table public.barbers (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid,
  name text not null,
  bio text,
  photo_url text,
  experience_years int default 0,
  branch_id uuid references public.branches(id) on delete set null,
  working_days day_of_week[] default array['monday','tuesday','wednesday','thursday','friday','saturday','sunday']::day_of_week[],
  working_hours jsonb default '{"open":"08:00","close":"20:00"}'::jsonb,
  is_active boolean default true,
  is_featured boolean default false,
  rating numeric(3,2) default 5.00,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- CUSTOMERS
-- =========================================================
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid,
  name text not null,
  phone text not null,
  email text,
  notes text,
  visit_count int default 0,
  last_visit_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (shop_id, phone)
);

-- =========================================================
-- APPOINTMENTS
-- =========================================================
create table public.appointments (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid,
  appointment_number text not null,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  notes text,
  branch_id uuid references public.branches(id) on delete restrict not null,
  service_id uuid references public.services(id) on delete restrict not null,
  barber_id uuid references public.barbers(id) on delete restrict not null,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status appointment_status default 'pending',
  cancel_token uuid default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index appointments_date_idx on public.appointments (appointment_date);
create index appointments_barber_date_idx on public.appointments (barber_id, appointment_date);
create index appointments_branch_date_idx on public.appointments (branch_id, appointment_date);

-- =========================================================
-- GALLERY
-- =========================================================
create table public.gallery (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid,
  image_url text not null,
  category text not null, -- 'haircuts','interior','beard','facial','before_after'
  title text,
  description text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- =========================================================
-- REVIEWS / TESTIMONIALS
-- =========================================================
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid,
  customer_name text not null,
  rating int check (rating between 1 and 5),
  content text,
  avatar_url text,
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- =========================================================
-- BUSINESS SETTINGS (single-row per shop)
-- =========================================================
create table public.business_settings (
  shop_id uuid primary key default uuid_generate_v4(),
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

-- =========================================================
-- SOCIAL LINKS
-- =========================================================
create table public.social_links (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid,
  platform text not null, -- instagram, facebook, tiktok, telegram, youtube, x, whatsapp
  url text not null,
  display_order int default 0
);

-- =========================================================
-- ADMINS / STAFF
-- =========================================================
create table public.admin_users (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  shop_id uuid,
  role text default 'admin',
  created_at timestamptz default now(),
  unique (user_id, shop_id)
);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.branches enable row level security;
alter table public.services enable row level security;
alter table public.barbers enable row level security;
alter table public.customers enable row level security;
alter table public.appointments enable row level security;
alter table public.gallery enable row level security;
alter table public.reviews enable row level security;
alter table public.business_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.admin_users enable row level security;

-- Public read access for non-sensitive tables
create policy "public read branches" on public.branches for select using (is_active = true);
create policy "public read services" on public.services for select using (is_visible = true);
create policy "public read barbers" on public.barbers for select using (is_active = true);
create policy "public read gallery" on public.gallery for select using (true);
create policy "public read reviews" on public.reviews for select using (true);
create policy "public read business_settings" on public.business_settings for select using (true);
create policy "public read social_links" on public.social_links for select using (true);

-- Anyone can create an appointment (public booking)
create policy "public insert appointments" on public.appointments
  for insert with check (true);

create policy "public read own appointments by token" on public.appointments
  for select using (true); -- tighten with token check in app layer

-- Customers table is filled by triggers / inserts during booking
create policy "public insert customers" on public.customers for insert with check (true);
create policy "public read customers" on public.customers for select using (true);

-- Admin write access: only authenticated admin_users
create policy "admin manage branches" on public.branches
  for all using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "admin manage services" on public.services
  for all using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "admin manage barbers" on public.barbers
  for all using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "admin manage appointments" on public.appointments
  for all using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "admin manage gallery" on public.gallery
  for all using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "admin manage reviews" on public.reviews
  for all using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "admin manage settings" on public.business_settings
  for all using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "admin manage social" on public.social_links
  for all using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "admin manage customers" on public.customers
  for all using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

-- =========================================================
-- TRIGGERS
-- =========================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger branches_updated_at before update on public.branches
  for each row execute function public.handle_updated_at();
create trigger services_updated_at before update on public.services
  for each row execute function public.handle_updated_at();
create trigger barbers_updated_at before update on public.barbers
  for each row execute function public.handle_updated_at();
create trigger customers_updated_at before update on public.customers
  for each row execute function public.handle_updated_at();
create trigger appointments_updated_at before update on public.appointments
  for each row execute function public.handle_updated_at();

-- Increment visit_count + last_visit_at when an appointment is completed
create or replace function public.handle_appointment_completed()
returns trigger as $$
begin
  if new.status = 'completed' and (old.status is null or old.status <> 'completed') then
    update public.customers
      set visit_count = visit_count + 1,
          last_visit_at = now()
      where id = new.customer_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger appointments_completed
  after update on public.appointments
  for each row execute function public.handle_appointment_completed();

-- =========================================================
-- SEED DATA: KEMEKEM BARBERSHOP
-- =========================================================
insert into public.business_settings (
  business_name, tagline, phone, email,
  booking_interval_minutes,
  seo_title, seo_description
) values (
  'Kemekem Barbershop',
  'Look Sharp. Book in Seconds.',
  '+251 924 657 777',
  'kemekemedia01@gmail.com',
  30,
  'Kemekem Barbershop — Premium Grooming in Addis Ababa',
  'Professional grooming experience with skilled barbers, premium services, and easy online booking. Two branches in Piassa and Bole, Addis Ababa.'
);

insert into public.branches (name, address, city, phone, maps_url, display_order) values
('Piassa Branch', 'Piassa Shopping Mall, 6th Floor', 'Addis Ababa', '+251 924 657 777', 'https://maps.google.com/?q=Piassa+Shopping+Mall+Addis+Ababa', 1),
('Bole Branch', 'Sapphire Addis Hotel, 11th Floor, Bole', 'Addis Ababa', '+251 924 657 777', 'https://maps.google.com/?q=Sapphire+Addis+Hotel+Bole', 2);

insert into public.services (name, description, duration_minutes, price, category, display_order) values
('Haircut', 'Precision cut tailored to your face shape and style.', 30, 250.00, 'haircut', 1),
('Kids Haircut', 'Gentle, patient grooming for children of all ages.', 20, 150.00, 'haircut', 2),
('Beard Trim', 'Sharp beard shaping, lining, and conditioning.', 15, 100.00, 'beard', 3),
('Shaving', 'Classic hot towel straight-razor shave.', 30, 200.00, 'shaving', 4),
('Hair Wash', 'Refreshing wash, scalp massage, and towel dry.', 15, 80.00, 'haircare', 5),
('Facial', 'Deep cleansing facial treatment for men.', 45, 350.00, 'skincare', 6),
('Hair Coloring', 'Premium coloring and grey blending.', 60, 400.00, 'haircare', 7),
('VIP Grooming', 'Full luxury package: haircut, beard, facial, and massage.', 90, 800.00, 'vip', 8);

insert into public.barbers (name, bio, experience_years, working_hours, is_featured, rating, display_order) values
('Abel Tesfaye', 'Master barber with 12 years of experience in modern and classic styles.', 12, '{"open":"08:00","close":"20:00"}', true, 4.95, 1),
('Dawit Mekonnen', 'Beard specialist and grooming expert.', 8, '{"open":"09:00","close":"19:00"}', true, 4.88, 2),
('Yonas Bekele', 'Creative stylist with a passion for fades and modern cuts.', 6, '{"open":"10:00","close":"20:00"}', false, 4.80, 3),
('Samuel Girma', 'Senior barber known for precision and detail.', 10, '{"open":"08:00","close":"18:00"}', false, 4.90, 4);

insert into public.reviews (customer_name, rating, content, is_featured) values
('Henok A.', 5, 'Best barber experience in Addis. Clean shop, skilled barbers, premium feel.', true),
('Meron T.', 5, 'Booking was effortless and the haircut was flawless. Highly recommended.', true),
('Yared K.', 5, 'Love the Bole branch. The VIP grooming package is worth every birr.', true),
('Bethel L.', 5, 'Professional team, modern atmosphere, and consistent quality every visit.', false);

insert into public.social_links (platform, url, display_order) values
('instagram', 'https://instagram.com/kemekem', 1),
('telegram', 'https://t.me/kemekem', 2),
('tiktok', 'https://tiktok.com/@kemekem', 3),
('facebook', 'https://facebook.com/kemekem', 4);