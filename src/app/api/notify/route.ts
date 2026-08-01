import { NextResponse } from "next/server";

// Simple notification dispatcher.
// In production, configure TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID env vars
// to receive booking alerts. Without those, this is a no-op.
//
// Multi-channel ready — add email/SMS by extending this dispatcher.

interface NotifyPayload {
  type: "booking_created" | "booking_cancelled" | "booking_reminder";
  customer_name?: string;
  customer_phone?: string;
  service_name?: string;
  barber_name?: string;
  branch_name?: string;
  date?: string;
  time?: string;
  appointment_number?: string;
  manage_link?: string;
}

function fmt(payload: NotifyPayload): string {
  const lines: string[] = [];
  if (payload.type === "booking_created") {
    lines.push("🔔 NEW BOOKING");
  } else if (payload.type === "booking_cancelled") {
    lines.push("⚠️ BOOKING CANCELLED");
  } else {
    lines.push("⏰ REMINDER");
  }
  if (payload.appointment_number) lines.push(`#: ${payload.appointment_number}`);
  if (payload.customer_name) lines.push(`👤 ${payload.customer_name}`);
  if (payload.customer_phone) lines.push(`📞 ${payload.customer_phone}`);
  if (payload.service_name) lines.push(`✂️ ${payload.service_name}`);
  if (payload.barber_name) lines.push(`💈 ${payload.barber_name}`);
  if (payload.branch_name) lines.push(`📍 ${payload.branch_name}`);
  if (payload.date && payload.time) lines.push(`📅 ${payload.date} · ${payload.time}`);
  if (payload.manage_link) lines.push(`🔗 ${payload.manage_link}`);
  return lines.join("\n");
}

export async function POST(req: Request) {
  try {
    const payload: NotifyPayload = await req.json();
    const text = fmt(payload);

    // Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
        });
      } catch (e) {
        // Best-effort, don't fail booking if telegram is down.
        console.error("Telegram notify failed", e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}