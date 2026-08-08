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
 * Day starts at 6:00 AM. Periods:
 *   6:00 - 11:59 → ጠዋት (morning)
 *   12:00 - 16:59 → ከሰዓት (afternoon)
 *   17:00 - 20:00 → ማታ (evening)
 *
 * Examples:
 *   "08:00" → "2:00 ጠዋት"
 *   "14:00" → "8:00 ከሰዓት"
 *   "18:00" → "12:00 ማታ"
 */
export function formatTime12h(time: string): string {
  if (!time) return "";
  const [hStr, mStr] = time.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const eth = h <= 6 ? h - 6 + 12 : h - 6;
  const period = h < 12 ? "ጠዋት" : h < 17 ? "ከሰዓት" : "ማታ";
  return `${eth}:${m.toString().padStart(2, "0")} ${period}`;
}