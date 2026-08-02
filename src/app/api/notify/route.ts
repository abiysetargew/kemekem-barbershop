import { NextResponse } from "next/server";

// Telegram notification dispatcher.
// Add these env vars to Vercel to receive booking alerts:
//   TELEGRAM_BOT_TOKEN  — from @BotFather
//   TELEGRAM_CHAT_ID    — your personal chat id
// Without them, this endpoint is a silent no-op.

type NotifyType =
  | "booking_created"
  | "booking_cancelled"
  | "booking_rescheduled"
  | "booking_completed"
  | "payment_received"
  | "status_changed";

interface NotifyPayload {
  type: NotifyType;
  customer_name?: string;
  customer_phone?: string;
  service_name?: string;
  barber_name?: string;
  branch_name?: string;
  date?: string;
  time?: string;
  appointment_number?: string;
  manage_link?: string;
  new_status?: string;
  amount?: number;
  payment_method?: string;
  cancel_reason?: string;
}

const TITLES: Record<NotifyType, string> = {
  booking_created: "🔔 New booking",
  booking_cancelled: "⚠️ Booking cancelled",
  booking_rescheduled: "🔁 Booking rescheduled",
  booking_completed: "✅ Service completed",
  payment_received: "💰 Payment received",
  status_changed: "📍 Status update",
};

function fmt(payload: NotifyPayload): string {
  const lines: string[] = [];
  lines.push(`*${TITLES[payload.type]}*`);
  if (payload.appointment_number) lines.push(`#️⃣ ${payload.appointment_number}`);
  if (payload.customer_name) lines.push(`👤 ${payload.customer_name}`);
  if (payload.customer_phone) lines.push(`📞 ${payload.customer_phone}`);
  if (payload.service_name) lines.push(`✂️ ${payload.service_name}`);
  if (payload.barber_name) lines.push(`💈 ${payload.barber_name}`);
  if (payload.branch_name) lines.push(`📍 ${payload.branch_name}`);
  if (payload.date && payload.time)
    lines.push(`📅 ${payload.date} · ${payload.time}`);
  if (payload.amount && payload.payment_method)
    lines.push(`💰 ${payload.amount.toLocaleString()} ETB via ${payload.payment_method}`);
  if (payload.new_status) lines.push(`📍 New status: *${payload.new_status}*`);
  if (payload.cancel_reason) lines.push(`❌ Reason: ${payload.cancel_reason}`);
  if (payload.manage_link) lines.push(`🔗 ${payload.manage_link}`);
  return lines.join("\n");
}

async function send(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[NOTIFY] Telegram not configured");
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[TELEGRAM ERROR]", res.status, data);
    } else {
      console.log("[TELEGRAM SENT]", data?.result?.message_id);
    }
  } catch (e) {
    console.error("[TELEGRAM FAIL]", e);
  }
}

export async function POST(req: Request) {
  try {
    const payload: NotifyPayload = await req.json();
    const text = fmt(payload);
    // Fire-and-forget; never fail the caller.
    void send(text);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET for manual testing — visit /api/notify to send a test message
export async function GET() {
  await send("🧪 *Test notification*\n\nYour Telegram bot is connected to Kemekem Barbershop.");
  return NextResponse.json({ ok: true, telegramConfigured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) });
}