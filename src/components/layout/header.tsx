"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || !isHome
          ? "bg-background/85 backdrop-blur-xl border-b border-border/40 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-tight flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Kemekem Barbershop"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <div className={cn("font-display text-base font-semibold leading-tight", scrolled || !isHome ? "text-foreground" : "text-background")}>
              Kemekem
            </div>
            <div className={cn("text-[10px] uppercase tracking-[0.18em]", scrolled || !isHome ? "text-muted-foreground" : "text-background/60")}>
              Barbershop
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  scrolled || !isHome
                    ? active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                    : active
                    ? "text-background"
                    : "text-background/70 hover:text-background"
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-x-4 -bottom-px h-px bg-foreground"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+251924657777"
            className={cn(
              "hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors md:flex",
              scrolled || !isHome
                ? "border-border hover:bg-muted"
                : "border-background/30 text-background hover:bg-background/10"
            )}
          >
            <Phone className="h-3.5 w-3.5" />
            +251 924 657 777
          </a>
          <Link
            href="/book"
            className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-all hover:scale-105 hover:shadow-2xl md:px-5 md:py-2.5 md:text-sm"
          >
            Book Now
            <ChevronDown className="hidden h-3.5 w-3.5 rotate-[-90deg] transition-transform group-hover:translate-x-1 md:block" />
          </Link>
          <button
            onClick={() => setOpen(true)}
            className={cn(
              "rounded-full p-2 md:hidden",
              scrolled || !isHome ? "hover:bg-muted" : "text-background hover:bg-background/10"
            )}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl">
                  <Image src="/logo.png" alt="Kemekem" fill sizes="36px" className="object-contain" />
                </div>
                <span className="font-display text-lg font-semibold">Kemekem</span>
              </Link>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-muted" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-medium",
                    pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-4 border-t border-border" />
              <Link href="/book" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background">
                Book Appointment
              </Link>
              <a href="tel:+251924657777" className="mt-2 flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium">
                <Phone className="h-4 w-4" /> Call Us
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}