# Kemekem Barbershop — Technical Manual

Live at https://kemekembarbershop.com

## Access

| What | URL | Password |
|---|---|---|
| Public site | kemekembarbershop.com | — |
| Admin | /admin/login | `kemekem2026` |
| Staff | /staff/login | `staff2026` |
| Hosting | vercel.com (project: kemekem-barbershop) | — |
| Database | supabase.com (project: dxxevvsrdcjllbjnzexp) | — |

## Stack

Next.js 15 + TypeScript + Tailwind + Vercel. Data persists in browser localStorage (per-device). Telegram bot for booking notifications.

## Project structure

```
src/
├── app/          # All pages (book, admin, staff, manage + api)
├── components/   # UI + sections + admin views
├── lib/          # store, booking, data, utils
├── types/        # database.ts
└── supabase/     # schema.sql
```

## How to make changes

```bash
npm install
npm run dev          # local dev
git push origin main  # auto-deploys to Vercel
```

Edit any file → push to GitHub → Vercel deploys in ~30 seconds → live.

## Common tasks

- **Change password:** edit `src/app/admin/login/page.tsx` or `src/app/staff/login/page.tsx`
- **Update services/prices:** admin dashboard → Services tab
- **Update hours:** admin → Branches tab
- **Add a barber:** admin → Barbers tab → + Add barber
- **Change Telegram chat ID:** Vercel → Settings → Environment Variables → update `TELEGRAM_CHAT_ID`

## Screenshots

*(Add 2-3 screenshots here)*

## Support

Telegram: @zearada10 — response within 24h weekdays