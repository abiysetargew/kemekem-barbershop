# Kemekem Barbershop — User Guide

Everything you need to manage your barbershop — public booking site, admin dashboard, and staff app — all in one place.

---

## Quick Start

| Portal | What it does | Password |
|---|---|---|
| **Public site** | Customers book appointments | — |
| **Admin** | Manage everything (bookings, services, barbers, gallery, settings) | `kemekem2026` |
| **Staff** | Daily operations (check-in, payment, cancel) | `staff2026` |

Open the site on your phone or laptop — works the same on both.

---

# 📱 Public Site

The website customers see and use to book appointments.

## Home Page

The first page visitors see — premium hero, service showcase, team, testimonials, branches, and FAQ.

**What customers can do here:**
- Browse services and prices
- See barbers and their specialties
- Read reviews
- Find branch addresses
- Click **Book Now** to start booking

---

## How Customers Book (4 steps)

### Step 1 — Choose Branch
Customer picks **Piassa** or **Bole**.

### Step 2 — Choose Service
Customer picks from 10 services:
- Haircut · Shampoo · Finger Coils · Braids · VIP Grooming · Color packages, etc.

### Step 3 — Choose Barber
- **Any barber** (recommended — next available)
- Or pick a specific barber (Bernabas, Tadesse, Eyosiyas, Samuel, Yalew, Getachew, or Ambachew for Bole VIP)

### Step 4 — Pick Date, Time & Details
- Choose a date (calendar opens to today)
- Choose a time slot (only available times show)
- Fill in: Full name, Phone number, Notes (optional), How did you hear about us (optional)

### Confirm
Customer clicks **Confirm Booking** → sees confirmation page with:
- Unique booking number (e.g., `KEM-20260801-4827`)
- Full booking details
- **Manage booking link** (so they can change/cancel later)
- **Print / Save as PDF** button for a printable receipt

**Telegram alert fires automatically** — you'll get a message on Telegram with all booking details.

---

## Customer Self-Service

Customers can manage their own booking via the link in their confirmation.

**What they can do:**
- View booking details (date, time, barber, branch, price)
- **Check In** — mark themselves as arrived
- **Reschedule** — pick a new date/time
- **Cancel** — with reason dropdown (no-show / customer / barber / shop closed)

---

# 🖥️ Admin Dashboard

**Login:** `/admin/login` · Password: `kemekem2026`

The control center for everything. Works best on desktop, but accessible from phone too.

---

## Dashboard

The first thing you see when you log in.

**Shows at a glance:**
- **Today's appointments** count + list with times and customer names
- **Revenue stats** (today, all-time)
- **Most popular service** + **most popular barber**
- **Total customers**
- **Restore Defaults** button (top right) — restores sample data if anything goes wrong

---

## Bookings Tab

Every appointment across all branches and dates.

**What you can do:**
- **Search** by customer name, phone, or booking ID
- **Filter** by status (Pending, Confirmed, Checked In, In Service, Completed, Cancelled)
- **Switch views** between List and Board (visual grid by date)
- **Change status** with one click on each booking:
  - Confirmed → Check In
  - Checked In → Start (service started)
  - In Service → Complete
- **Mark No-show** if customer doesn't arrive
- **Cancel** with reason (customer / barber / shop closed / other)

**You receive Telegram notifications** for every status change.

---

## Services Tab

Manage your service menu.

**Add a new service:**
1. Click **+ Add service**
2. Fill in:
   - **Name** (e.g., "Haircut")
   - **Description** (one line)
   - **Duration** in minutes (e.g., 60)
   - **Price** in ETB
   - **Category** (e.g., haircut, beard, package)
   - **Image** — click "Choose image" to pick from our library, OR paste a URL
3. Click **Save**

**Edit** any service by clicking the pencil icon. **Delete** with the trash icon (bookings stay even after deletion).

---

## Barbers Tab

Your team management.

**Add a new barber:**
1. Click **+ Add barber**
2. Fill in:
   - **Name**, **Phone**, **Bio**, **Experience** (years), **Rating**
   - **Branch** assignment (or leave blank for "any branch")
   - **Working hours** (e.g., 08:00 – 20:00)
   - **Working days** — click day pills to toggle (Mon, Tue, etc.)
   - **Photo** — pick from library or paste URL
3. Click **Save**

Toggle a barber between **Active/Inactive** with the eye/edit icon. **Featured** barbers get highlighted on the public site.

---

## Customers Tab

Your customer database.

**Shows:**
- Customer name, phone, email
- **Visit count** (how many times they've been)
- **Last visit** date
- **Birthday** (for future birthday promos)
- **Notes** (preferences, allergies, etc.)

**Actions:**
- **Add customer** (top right)
- **Edit** (pencil icon)
- **Delete** (trash icon — their booking history stays)

Customers are **auto-created** when someone books online — you just see them appear here.

---

## Gallery Tab

Photos shown on the public site.

**Add a photo:**
1. Click **+ Add image**
2. Pick from our image library (barbershop photos) OR paste a URL
3. Choose a category (Haircuts, Interior, Beard, Facial, Before & After, VIP)
4. Optionally add a title
5. Click **Add**

**Reorder** photos with the ↑ ↓ arrow buttons. **Delete** with the trash icon.

---

## Branches Tab

Your two locations.

**For each branch:**
- Name, Address, City, Phone
- **Working hours** (e.g., 08:00 – 20:00)
- **Google Maps** link (paste from Google Maps share)
- **Active/Inactive** toggle

Click **Edit** to change. Click **+ Add branch** for a new location.

---

## Reports Tab

Quick stats for the last 30 days.

- **Revenue** (7-day and 30-day totals)
- **Total customers**
- **Repeat customers** (visited 2+ times)
- **Popular services** (ranked by booking count)
- **Popular barbers** (ranked by booking count)

---

## Settings Tab

**Business information:**
- Business name, tagline, phone, email, address

**Branding:**
- Hero image URL, logo URL, footer text

**Booking:**
- Slot interval (15, 20, 30, or 60 minutes — currently 60)

**SEO (helps Google find you):**
- Page title, description, keywords

**Social media links:**
- Instagram, TikTok, Facebook, Telegram, etc.

Click **Save settings** at the bottom after changes.

---

# 👥 Staff App

**Login:** `/staff/login` · Password: `staff2026`

Designed for the front desk. Works perfectly on a phone or tablet.

**Best for:** Daily operations, checking in customers, taking payment.

---

## Daily Schedule

Shows **today's appointments** by default.

**Filters at top:**
- Date picker (← → arrows + Today button)
- Branch (All / Piassa / Bole)
- Barber (all barbers / specific one)
- Search by customer name or phone

---

## Check In a Customer

When a customer arrives:

1. Find their booking in the list
2. Click **✓ Check In** button (turns blue)

That's it — they show up as "Checked In" in admin.

---

## Start the Service

When you begin cutting:

1. Find the "Checked In" booking
2. Click **▶ Start** (turns amber)

---

## Mark Complete + Take Payment

When the service is done:

1. Click **✓ Complete** (turns green)
2. Click **💰 Mark paid**
3. Pick the **payment method**:
   - 💵 Cash
   - 💳 Card
   - 📱 Telebirr
   - ⭕ Transfer
4. Enter the **amount paid**
5. Click **Confirm payment**

The booking now shows **"Paid · 500 ETB"** and the daily revenue total updates.

---

## Cancel a Booking

If a customer can't make it:

1. Click **❌ Cancel** on their booking
2. Pick the **reason** from the dropdown:
   - Customer no-show
   - Customer canceled
   - Barber unavailable
   - Shop closed / emergency
   - Other
3. Click **Cancel booking**

You'll get a Telegram notification with the reason.

---

## Daily Revenue

At the top of the staff screen, you'll see:

**Total revenue today** (big number in ETB)

Plus quick stats: Total bookings / Checked In / In Service / Done / Cancelled / Paid / Unpaid

---

# 📱 Telegram Notifications

Get instant booking alerts on your phone.

## What you'll receive

Every time one of these happens, you get a Telegram message:

- 🔔 **New booking** (full details + manage link)
- ⚠️ **Booking cancelled** (with reason)
- 🔁 **Booking rescheduled**
- 📍 **Status change** (Check In, Start, Complete)
- 💰 **Payment received** (amount + method)

## Example booking message

```
🔔 New booking
#️⃣ KEM-20260801-4827
👤 Abebe Kebede
📞 +251 92 234 5678
✂️ Haircut
💈 Bernabas Mengistu
📍 Piassa Branch
📅 2026-08-01 · 10:00
🔗 https://kemekembarbershop.com/manage/tok-abc-123
```

## Setup (5 minutes)

1. Open Telegram on your phone
2. Search **@BotFather**
3. Send `/newbot`
4. Name it "Kemekem Notifications"
5. Pick a username (e.g., `kemekem_barbershop_bot`)
6. **Copy the bot token**
7. Send any message to your new bot
8. Visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
9. **Copy the chat.id number**
10. Add both to Vercel environment variables

---

# 🆘 Quick Reference

## Forgot a password?

| Portal | Reset path |
|---|---|
| Admin | Edit `src/app/admin/login/page.tsx` → change `ADMIN_PASSWORD` |
| Staff | Edit `src/app/staff/login/page.tsx` → change `STAFF_PASS` |

Then redeploy.

## Need to add a barber urgently?

1. Login to Admin
2. Click **Barbers** tab
3. Click **+ Add barber**
4. Fill in name, phone, working hours, days
5. Click **Save**

New barber appears on the public booking site immediately.

## Customer says they didn't get the booking link?

Their link is on the confirmation page. Or:
1. Admin → Bookings → search by their phone
2. Click their booking to see status
3. If they need a manage link, search for the booking in **Manage Booking**

## Customer wants to cancel but lost the link?

1. Go to `/manage`
2. Type their phone number
3. Their booking appears
4. Click cancel with reason

---

# ✅ Daily Workflow

**Morning:**
1. Open Staff app on your phone
2. Check today's schedule
3. Confirm everything looks right

**During the day:**
1. Customer arrives → click **Check In**
2. Start the cut → click **Start**
3. Service done → click **Complete**
4. Take payment → click **Mark paid** → choose method → enter amount
5. No-show → click **Cancel** → pick reason

**Evening:**
1. Check **Daily revenue** total at top of staff screen
2. Optional: check Admin → Reports for the day's stats

---

**That's it. You're ready to run your barbershop.** 🚀