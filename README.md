# Kemekem Barbershop — Premium Booking Platform

A production-ready, premium-feeling booking website + lightweight admin dashboard for Kemekem Barbershop. Designed from day one to be sold as a multi-shop SaaS by swapping business info stored in the database.

## Stack

- **Next.js 15** (App Router, RSC)
- **TypeScript** strict mode
- **Tailwind CSS** + custom design tokens (gold/black/white)
- **shadcn/ui** primitives (Button, Card, Input, Dialog, etc.)
- **Framer Motion** for smooth UI transitions
- **Supabase** (Database, Auth, Storage, RLS)
- **React Hook Form** + **Zod** (validation)
- **TanStack Table** + **TanStack Query**
- **Lucide Icons**
- **Recharts** for admin analytics
- **next-themes** for dark mode
- Deployed on **Vercel**

## Features

### Public site
- Hero, Why Choose Us, Services, Featured Barbers, Before & After, Testimonials, Two Branches, FAQ, Contact, Footer
- 4-step booking flow (Branch → Service → Barber → Time + details)
- Live availability respecting working hours, booking interval, conflicts, and past time
- Confirmation page with appointment number
- Customer self-service (reschedule, cancel) via tokenized link
- About, Gallery (masonry + filters), Contact pages
- Mobile floating action buttons (Book, Call, WhatsApp)
- Sticky nav, dark mode, smooth animations
- SEO: per-page metadata, OG, robots, sitemap, manifest

### Admin
- Secure login (Supabase Auth + admin_users table)
- Sidebar layout (desktop) + horizontal scroll nav (mobile)
- Dashboard with KPIs, charts, today's schedule
- Appointments table with search, status filter, pagination
- Services / Barbers / Customers / Gallery / Branches CRUD
- Business settings (info, branding, hours, booking interval, SEO, theme colors, footer)
- Social links manager
- Reports (popular services/barbers, revenue, repeat customers)

### SaaS-ready
- `shop_id` reserved on every table — turn on multi-tenant by inserting shop rows and filtering by `shop_id`
- RLS policies in place to restrict admin write access
- Single business_settings row per shop

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a Supabase project, run `supabase/schema.sql` in the SQL editor
3. Copy `.env.example` → `.env.local` and fill in Supabase keys
4. Create your first admin user in Supabase Auth, then insert a row in `admin_users` with that user_id
5. Run the dev server
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000`

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript

## Future-friendly architecture

The codebase uses Server Components for data fetching (faster, SEO-friendly), Client Components only where interaction is needed. `src/lib/supabase/client.ts` exposes three clients (browser, server with cookies, admin/service-role). Domain logic is in `src/lib/*` (availability, booking, social, data, utils). All UI primitives are in `src/components/ui/*` and can be reused in the admin shell or future tenant portals.