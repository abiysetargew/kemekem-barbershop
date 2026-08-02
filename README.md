# Kemekem Barbershop — Premium Booking Platform

A production-ready booking website + lightweight admin dashboard for **Kemekem Barbershop** (Piassa & Bole branches, Addis Ababa).

Designed to be converted into a multi-tenant SaaS for Ethiopian barbershops with minimal changes (the `shop_id` column is reserved on every table).

## Live URLs

- **Public site**: https://kemekem-barbershop.vercel.app
- **Admin**: `/admin/login` — password `kemekem2026`
- **Staff**: `/staff/login` — password `staff2026`

## Stack

- **Next.js 15** (App Router, RSC)
- **TypeScript** strict mode
- **Tailwind CSS** (B&W Playfair Display theme)
- **shadcn-style** UI primitives (`src/components/ui/`)
- **Framer Motion** for hero animations
- **localStorage** persistence (per-browser — swap to Supabase for multi-device)
- **Telegram bot** for booking notifications
- **Vercel** deployment

## Features

### Public site (customer-facing)
- **Hero** with floating scissors animation + scroll marquee
- **4-step booking flow**: Branch → Service → Barber → Time + contact
- **Live availability** respecting working hours, branch filter, booking conflicts
- **Confirmation page** with printable receipt (Save as PDF)
- **Manage booking portal** (reschedule, cancel, mark checked-in) via unique token
- **Gallery** with masonry layout + category filters
- **About / Services / Branches / Contact** pages

### Admin (`/admin`)
- **Dashboard**: today's schedule, revenue stats, popular service/barber, total customers
- **Bookings**: kanban + list views, search, status filter, one-tap status changes
- **Services**: full CRUD with image picker (library + URL)
- **Barbers**: full CRUD with working days/hours toggles
- **Customers**: CRUD with birthday field, visit count, total spent
- **Gallery**: add/delete/reorder images by category
- **Branches**: CRUD with working hours, address, maps link
- **Reports**: revenue stats, popular services/barbers, repeat customers
- **Settings**: business info, branding, booking interval, SEO, social links
- **Restore defaults** button

### Staff (`/staff`)
- Mobile-first daily kanban with branch/barber/search filters
- One-tap status workflow: Check In → Start → Complete
- **Cash payment module**: mark paid with method (Cash/Card/Telebirr/Transfer) + amount
- **Cancel reason capture**: no-show / customer / barber / shop closed
- **Daily revenue** total at top
- Stats tiles: Total / Here / Live / Done / Cancel / Paid / Unpaid

### Notifications (Telegram)
Add these env vars to Vercel to enable:
- `TELEGRAM_BOT_TOKEN` — from @BotFather
- `TELEGRAM_CHAT_ID` — your personal chat ID

Triggers: new booking, cancellation, reschedule, status change, payment received.
Visit `/api/notify` (GET) to send a test message.

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage (Suspense-wrapped)
│   ├── layout.tsx                  # Root layout (Header + Footer + FloatingActions)
│   ├── error.tsx                   # Global error boundary (shows error message)
│   ├── globals.css                 # B&W theme tokens, animations
│   ├── (public routes)             # /services, /about, /contact, /gallery
│   ├── book/                       # /book (4-step flow)
│   ├── manage/                     # /manage (phone lookup) + /manage/[token]
│   ├── staff/                      # /staff + /staff/login
│   ├── admin/                      # /admin/dashboard + /admin/login
│   └── api/
│       ├── availability/           # GET slots
│       ├── bookings/               # POST create
│       └── notify/                 # POST + GET (Telegram dispatch)
├── components/
│   ├── ui/                         # Button, Card, Input, Badge, etc.
│   ├── layout/                     # Header, Footer, FloatingActions
│   ├── visual/                     # ScissorsAnimation, Marquee
│   ├── sections/                   # Hero, Services, Barbers, etc.
│   ├── booking/                    # BookingFlow, Receipt, error boundary
│   ├── staff/                      # StaffGuard
│   └── admin/                      # AdminShell + 9 view components
├── lib/
│   ├── store.ts                    # localStorage hooks + seed data
│   ├── seed-data.ts                # 7 barbers, 10 services, 2 branches, 7 sample bookings
│   ├── booking.ts                  # Slot computation, status transitions
│   ├── image-library.ts            # Curated images
│   ├── data.ts                     # Server-side Supabase fetchers (with seed fallback)
│   └── utils.ts                    # cn(), formatCurrency, time helpers
├── types/
│   └── database.ts                 # TS types (Appointment, Barber, etc.)
└── supabase/
    └── schema.sql                  # Multi-tenant-ready PostgreSQL schema
```

## Booking lifecycle (7-status)

```
confirmed → checked_in → in_service → completed
                ↓
            cancelled | no_show
```

Each transition triggers a Telegram notification if env vars are set.

## Payment module

- `unpaid` (default) → staff clicks "Mark paid" → picks method + amount → `paid`
- "Undo paid" reverts
- Daily revenue total = sum of paid_amount for the day

## Seeded sample data

- 7 barbers (6 Piassa + 1 Bole VIP-only Ambachew)
- 10 services matching client's price list (Haircut 500, VIP 3000, etc.)
- 2 branches (Piassa, Bole) with real addresses
- 4 customer reviews (Henok, Meron, Yared, Bethel)
- 7 sample bookings (yesterday completed + today confirmed/checked-in + tomorrow)
- 6 gallery images

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
```

## Switching to real Supabase

Currently data persists in browser `localStorage` only. To enable real database (multi-device sync, real-time updates):

1. Run `supabase/schema.sql` in your Supabase SQL editor (already done on your project)
2. Get **Legacy JWT keys** from Settings → API (the new `sb_publishable_` format may not work with our library version yet)
3. Add to Vercel env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Legacy JWT)
   - `SUPABASE_SERVICE_ROLE_KEY` (Legacy JWT)
4. Replace `src/lib/store.ts` and `src/lib/booking.ts` to call Supabase instead of localStorage
5. Update API routes (`/api/availability`, `/api/bookings`) to read/write from Supabase

The schema already includes `shop_id` on every table for multi-tenant SaaS conversion.

## Brand identity

- **Colors**: Pure black `#0a0a0a` + Pure white `#FFFFFF` (no gold per client request)
- **Font**: Playfair Display (display) + Inter (body)
- **Logo**: `public/logo.png` (300kamakam.png from client)
- **Tone**: Premium, confident, clean

## Customer info

- **Business**: Kemekem Barbershop
- **Owner**: Abiyu (zearada10 on Telegram)
- **Phone**: +251 924 657 777
- **Email**: kemekemedia01@gmail.com
- **Branches**:
  - Piassa — Piassa Shopping Mall, 6th Floor
  - Bole — Sapphire Addis Hotel, 11th Floor
- **Hours**: Mon–Sun, 8 AM – 8 PM

## Roadmap

- [ ] Buy custom domain (`kemekem.com` or similar)
- [ ] Real Supabase backend (replace localStorage)
- [ ] SMS reminders via Chapa (24h before appointment)
- [ ] Owner weekly digest email
- [ ] Loyalty / membership
- [ ] Multi-shop SaaS mode

## Support

Code maintained by opencode for Abiyu. Telegram notifications go to chat_id `7763341927` (zearada10).
