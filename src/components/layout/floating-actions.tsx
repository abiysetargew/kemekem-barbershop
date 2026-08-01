"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const HIDE_ON = ["/admin", "/staff", "/manage"];

export function FloatingActions() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDE_ON.some((p) => pathname?.startsWith(p))) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-4 z-40 flex flex-col gap-2.5 transition-all duration-300 md:hidden",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <a
        href="https://wa.me/251924657777"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background shadow-md transition-all hover:shadow-lg active:scale-95"
      >
        <MessageCircle className="h-5 w-5 text-[#25D366]" />
      </a>
      <a
        href="tel:+251924657777"
        aria-label="Call"
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background shadow-md transition-all hover:shadow-lg active:scale-95"
      >
        <Phone className="h-5 w-5" />
      </a>
      <Link
        href="/book"
        aria-label="Book Appointment"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-foreground shadow-lg transition-all hover:shadow-xl active:scale-95"
      >
        <CalendarDays className="h-6 w-6 text-background" />
      </Link>
    </div>
  );
}