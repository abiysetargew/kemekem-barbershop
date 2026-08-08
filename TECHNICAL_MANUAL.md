# Kemekem Barbershop — Technical Manual

**Audience:** Technical staff / future developers maintaining the project.

---

## Live URLs

| Portal | URL | Password |
|---|---|---|
| Public site | https://kemekembarbershop.com | — |
| Admin | https://kemekembarbershop.com/admin/login | `kemekem2026` |
| Staff | https://kemekembarbershop.com/staff/login | `staff2026` |
| Site management | https://vercel.com/abiysetargewkenaw-2421s-projects/kemekem-barbershop | Vercel account |
| Database (Supabase) | https://supabase.com/dashboard/project/dxxevvsrdcjllbjnzexp | — |
| Telegram bot | https://t.me/abiyu's bot | — |

---

## Stack

- **Frontend**: Next.js 15 (App Router, React 19) + TypeScript
- **Styling**: Tailwind CSS (B&W Playfair Display theme)
- **UI**: Radix primitives + custom shadcn-style components
- **Animations**: Framer Motion (hero scissors, marquee, scroll)
- **Data storage**: Browser localStorage (per-device persistence)
- **Notifications**: Telegram Bot API
- **Hosting**: Vercel (Hobby plan, free)
- **Domain**: kemekembarbershop.com (Namecheap, paid through Aug 2027)

---

## Architecture

```
Browser (Customer/Staff/Admin)
  ↓
Vercel Edge Network
  ↓
Next.js 15 (React Server + Client Components)
  ├── /          Public site (home, services, gallery, about, contact, book, manage)
  ├── /admin     Admin shell (9 tabs: dashboard, bookings, services, barbers, customers, gallery, branches, reports, settings)
  ├── /staff     Staff app (mobile-first daily kanban with status workflow + payment)
  └── /api       REST endpoints (availability, bookings, notify)

External services:
  ├── Supabase   Postgres + Auth (configured, not yet active for app data — fallback to localStorage)
  └── Telegram   Bot API for booking notifications
```

---

## Project structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout (server, minimal HTML shell)
│   ├── page.tsx           # Homepage (Suspense-wrapped, client)
│   ├── globals.css        # B&W theme tokens + animations
│   ├── error.tsx          # Global error boundary
│   ├── book/              # 4-step booking flow
│   ├── manage/            # Customer self-service
│   ├── admin/             # Admin shell + login
│   ├── staff/             # Staff app + login
│   └── api/               # REST endpoints
│       ├── availability/   # GET slots
│       ├── bookings/       # POST create
│       └── notify/         # POST + GET (Telegram)
│
├── components/
│   ├── ui/                # Button, Card, Input, Badge, Dialog, etc.
│   ├── layout/            # ClientLayout, Header, Footer, FloatingActions
│   ├── visual/            # ScissorsAnimation, Marquee
│   ├── sections/          # Hero, Services, Barbers, etc.
│   ├── booking/           # BookingFlow, Receipt
│   └── admin/             # AdminShell + 9 view components
│
├── lib/
│   ├── store.ts           # localStorage hooks (useServices, useAppointments, etc.)
│   ├── seed-data.ts       # 7 barbers, 10 services, sample bookings, customers
│   ├── booking.ts         # Slot computation + status transitions
│   ├── data.ts            # Server-side Supabase fetchers (seed fallback)
│   ├── utils.ts           # formatCurrency, time helpers, cn()
│   └── image-library.ts   # Curated Unsplash URLs
│
├── types/database.ts      # Appointment, Barber, Service, etc.
└── supabase/schema.sql    # Multi-tenant PostgreSQL schema (ready for switch)
```

---

## Data model

Every table has a `shop_id` column reserved for multi-tenant SaaS conversion (Phase 8 roadmap).

```
business_settings    (single row, includes business_name, phone, hours, booking_interval_minutes, telegram config)
branches            (Piassa, Bole — working hours, address, maps URL)
services            (10 services, price, duration_minutes, category, is_visible)
barbers             (7 barbers, branch_id, working_days, working_hours, rating, photo_url)
customers           (auto-created from bookings, visit_count, total_spent, birthday)
appointments        (with payment_status, payment_method, cancel_reason, status, cancel_token)
gallery             (image_url, category, display_order)
reviews             (4 sample reviews)
social_links        (instagram, tiktok, facebook, telegram)
```

---

## Booking lifecycle

```
confirmed → checked_in → in_service → completed
                ↓
            cancelled | no_show
```

Each transition triggers a Telegram notification (if env vars configured).

---

## Setup (for future devs)

```bash
# Install dependencies
npm install

# Environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://dxxevvsrdcjllbjnzexp.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
SUPABASE_SECRET_KEY=sb_secret_xxxxx
TELEGRAM_BOT_TOKEN=8754918263:AAE4iY4wqN4Xp69oVqb8j1lmQX2S_VyApgI
TELEGRAM_CHAT_ID=7763341927

# Run dev
npm run dev

# Build for production
npm run build

# Deploy
git push origin main  # Vercel auto-deploys
```

---

## Common tasks

### Change a password

Admin: `src/app/admin/login/page.tsx` → `ADMIN_PASSWORD`
Staff: `src/app/staff/login/page.tsx` → `STAFF_PASS`
Then commit + push (auto-deploys).

### Update prices / services

Login to `/admin/login` → Services tab → click pencil icon.

### Update opening hours

`/admin/login` → Branches tab → click Edit → change working hours → Save.

### Configure Telegram bot

Already configured. To get the chat ID for a different recipient:
1. New user messages the bot
2. Visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Find `"chat":{"id": XXXXX}` → that's the chat ID
4. Update `TELEGRAM_CHAT_ID` in Vercel env vars

### Deploy changes

Just push to `main` branch on GitHub. Vercel auto-builds and deploys in ~30 seconds.

---

## Screenshots

### Public site homepage

`https://kemekembarbershop.com`
[Add screenshot: homepage-hero.png]

### Booking flow

`/book` → 4-step wizard
[Add screenshot: booking-step-1.png]
[Add screenshot: booking-step-4.png]

### Confirmation page with receipt

After booking → `/book/success?id=...`
[Add screenshot: booking-confirmation.png]

### Admin dashboard

`/admin/login` → password `kemekem2026`
[Add screenshot: admin-dashboard.png]

### Admin bookings view (kanban)

Admin → Bookings tab
[Add screenshot: admin-bookings-kanban.png]

### Staff app (mobile)

`/staff/login` → password `staff2026`
[Add screenshot: staff-mobile-daily.png]

### Payment modal on staff

Staff app → "Mark paid" on completed booking
[Add screenshot: staff-payment-modal.png]

### Telegram notification example

`/api/notify` (GET) sends test message
[Add screenshot: telegram-notification.png]

### Vercel deployment dashboard

`https://vercel.com/abiysetargewkenaw-2421s-projects/kemekem-barbershop`
[Add screenshot: vercel-deployments.png]

### Supabase dashboard

`https://supabase.com/dashboard/project/dxxevvsrdcjllbjnzexp`
[Add screenshot: supabase-dashboard.png]

### Namecheap DNS configuration

`https://www.namecheap.com/domains/domaincontrolpanel/kemekembarbershop.com/advancedns`
[Add screenshot: namecheap-dns-records.png]

---

## Known limitations & roadmap

- **Data is per-browser** (localStorage). Multiple devices won't sync. → Migrate to Supabase when needed.
- **No real SMS reminders** yet. → Add Chapa SMS integration.
- **No online payment** yet. → Add Telebirr/Chapa later (you said not now).
- **No PWA / offline support** yet.

---

## Support

Code maintained by opencode for Abiyu. Questions → check README.md first, then this manual.