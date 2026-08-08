# Kemekem Barbershop — Booking Platform

A premium booking website + management dashboard for **Kemekem Barbershop**.

---

## What's been built

A complete, production-ready booking platform with public website, customer self-service portal, admin dashboard, and staff app — all wrapped in a premium black & white design.

---

## 1. Public Website (`/`)

Customers browse and book appointments online.

**Pages:**
- **Home** — Premium hero with floating scissors animation, service showcase, team, testimonials, branches, FAQ
- **Services** — All 10 services with photos, prices, and "Book now" buttons
- **Gallery** — Masonry layout of barbershop photos with category filters
- **About** — Brand story, mission, statistics, team showcase
- **Contact** — Both branches, contact form, directions
- **Book** — 4-step booking flow (Branch → Service → Barber → Time + contact)
- **Manage Booking** — Customer self-service via phone lookup or direct link

**Booking flow features:**
- Live availability (no double-booking)
- 60-minute booking slots (matches your workflow)
- "How did you hear about us?" tracking for marketing insights
- Printable receipt (Save as PDF)
- Confirmation message with unique booking number
- Manage booking link sent automatically

---

## 2. Admin Dashboard (`/admin/login`)

**Password:** `kemekem2026`

Manage everything from one place.

**Dashboard** — Today's schedule, revenue stats, popular services/barbers, total customers

**Bookings** — All appointments with one-tap status changes (Confirmed → Checked In → In Service → Completed), search, filters, list/board view

**Services** — Add/edit/delete services with photos, prices, durations, categories, visibility toggle

**Barbers** — Full team management with profile photos, working hours, working days (toggle pills), experience, ratings, branch assignment

**Customers** — Customer database with contact info, visit history, birthday, total spent, notes

**Gallery** — Photo management with category organization and reorder controls

**Branches** — Location info with addresses, working hours, phone numbers, Google Maps links

**Reports** — Revenue stats (7-day, 30-day), popular services and barbers, repeat customer tracking

**Settings** — Business info, branding, booking interval, SEO metadata, social media links

**Restore Defaults** — One-click restore of sample barbers/services/bookings

---

## 3. Staff App (`/staff/login`)

**Password:** `staff2026`

Mobile-first daily operations dashboard.

- **Daily view** with today's appointments, branch/barber/search filters
- **One-tap status** workflow: Check In → Start → Complete
- **Cash payment** module: Mark paid with method (Cash, Card, Telebirr, Transfer) + amount
- **Cancel reason** capture (no-show, customer canceled, barber unavailable, shop closed)
- **Daily revenue** total displayed at the top
- Quick stats: Total / Here / Live / Done / Cancelled / Paid / Unpaid

Perfect for use on a tablet at the front desk or on a phone.

---

## 4. Telegram Notifications

Instant booking alerts to your phone.

Add these two values to your Vercel environment variables:
- `TELEGRAM_BOT_TOKEN` — from @BotFather
- `TELEGRAM_CHAT_ID` — your personal chat ID

You'll receive a Telegram message for every:
- New booking (with all details)
- Booking cancelled (with reason)
- Booking rescheduled
- Status change (check-in, start, complete)
- Payment received

---

## 5. Pre-loaded Sample Data

The system comes ready with:

- **7 Barbers** — Bernabas, Tadesse, Eyosiyas, Samuel, Yalew, Getachew (Piassa) + Ambachew (Bole VIP-only)
- **10 Services** — Haircut, Shampoo, Finger Coils, Braids/Twists + Haircut, Braids with Extensions + Haircut, Haircut + Black Color packages, VIP Grooming
- **2 Branches** — Piassa Shopping Mall 6th Floor + Bole Sapphire Addis Hotel 11th Floor
- **5 Customers** — Henok, Meron, Yared, Bethel, Dawit (with phone numbers, visit history, birthdays)
- **7 Sample Bookings** — Across today, tomorrow, yesterday (mix of statuses)
- **6 Gallery Photos** — Ready to organize

---

## 6. Design & Brand

**Colors:** Pure black + pure white (premium, timeless)

**Typography:** Playfair Display (display/headings) + Inter (body)

**Tone:** Confident, clean, premium

---

## 7. URLs

| Portal | URL | Password |
|---|---|---|
| Public site | `https://kemekembarbershop.com` | — |
| Admin | `https://kemekembarbershop.com/admin/login` | `kemekem2026` |
| Staff | `https://kemekembarbershop.com/staff/login` | `staff2026` |

When you buy the domain, all three run on `kemekembarbershop.com`.

---

## 8. Technical Notes

**Built with:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Vercel hosting

**Current data storage:** Browser-local (per device) — perfect for single-location launch

**Future upgrade path:** Real database (Supabase) is already scaffolded in the code — switch when you need multi-device sync across staff/admin

**Hosting:** Vercel (free tier is more than enough for thousands of bookings/month)

---

## 9. Next Steps (when you're ready)

1. Buy `kemekembarbershop.com` — we'll connect it in 5 minutes
2. Set up Telegram bot (5 min) for instant booking alerts
3. Start taking real bookings
4. (Later) Upgrade to real database when you have multiple staff

---

## Quick Start

1. Open the site
2. Click "Book Now"
3. Complete the 4 steps
4. You'll see the confirmation page with your booking number
5. Customer + shop both get the details

That's it. You're ready to launch. 🚀