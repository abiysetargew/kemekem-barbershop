import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "ETB") {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatPhone(phone: string) {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "+$1 $2 $3");
}

export function generateAppointmentNumber() {
  const date = new Date();
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `KEM-${yyyymmdd}-${random}`;
}

export function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(min: number) {
  const h = Math.floor(min / 60).toString().padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function isValidPhone(phone: string) {
  return /^[\d\s+\-()]{9,}$/.test(phone);
}

/**
 * Convert 24h HH:mm time to Ethiopian 12-hour clock with Amharic period name.
 * Day starts at 6:00 AM (shown as "12:00"). Periods:
 *   6:00 - 11:59 → ጠዋት (morning) — 12, 1, 2, 3, 4, 5
 *   12:00 - 16:59 → ከሰዓት (afternoon) — 6, 7, 8, 9, 10
 *   17:00 - 20:00 → ማታ (evening) — 11, 12, 1, 2
 *
 * Examples:
 *   "06:00" → "12:00 ጠዋት"   (day starts)
 *   "08:00" → "2:00 ጠዋት"
 *   "12:00" → "6:00 ከሰዓት"
 *   "14:00" → "8:00 ከሰዓት"
 *   "18:00" → "12:00 ማታ"  (evening)
 *   "20:00" → "2:00 ማታ"
 */
export function formatTime12h(time: string): string {
  if (!time) return "";
  const [hStr, mStr] = time.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  // Map 24h to 12-hour Ethiopian clock.
  // 6:00 → 12, 7:00 → 1, 8:00 → 2, ..., 17:00 → 11, 18:00 → 12
  // Formula: ((h - 6) mod 12) + 1, but cap to 1..12.
  let eth: number;
  if (h < 6) eth = 12; // before day start - rare, just show 12
  else {
    const diff = (h - 6) % 12;
    eth = diff === 0 ? 12 : diff;
  }
  const period = h < 12 ? "ጠዋት" : h < 17 ? "ከሰዓት" : "ማታ";
  return `${eth}:${m.toString().padStart(2, "0")} ${period}`;
}