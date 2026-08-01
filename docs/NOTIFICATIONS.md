# Notifications — Telegram Setup (5 minutes)

## 1. Create a Telegram bot
- Open Telegram, search **@BotFather**
- Send `/newbot`
- Name it: `Kemekem Notifications`
- Copy the **bot token**

## 2. Get your chat ID
- Send any message to your new bot
- Visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
- Find `"chat":{"id": 123456789}` — that's your chat ID

## 3. Add env vars to Vercel
Go to your Vercel project → **Settings → Environment Variables**, add:

```
TELEGRAM_BOT_TOKEN = 123456789:ABC-DEF...   (your bot token)
TELEGRAM_CHAT_ID   = 123456789               (your chat id)
```

Vercel will auto-redeploy.

## 4. Test
Once deployed, create a test booking. Within seconds you should get a Telegram message with all booking details.

## What you'll receive

When a booking is created, you get a message like:

```
🔔 NEW BOOKING
#: KEM-20260801-4827
👤 Henok Alemu
📞 +251 92 234 5678
✂️ Haircut
💈 Bernabas Mengistu
📍 Piassa Branch
📅 2026-08-01 · 10:00
🔗 https://yoursite.com/manage/tok-henok-...
```

## Adding more channels

The `/api/notify` endpoint accepts a JSON payload and fires all configured channels. Add email (Resend) or SMS (Chapa/Twilio) by extending the dispatcher.

## Reply commands (optional)

For the bot to handle `/start` on your site, deploy an additional webhook endpoint. For Vercel Hobby, set up via `/api/telegram/webhook`. Full implementation available — ask if needed.