"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-tight flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background transition-transform group-hover:scale-105">
            <span className="font-display text-lg font-bold gold-text">K</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-base font-semibold leading-tight">
              Kemekem
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Barbershop
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-4 -bottom-px h-px bg-gold-gradient" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+251924657777"
            className="hidden items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted md:flex"
          >
            <Phone className="h-3.5 w-3.5" />
            +251 924 657 777
          </a>
          <ThemeToggle />
          <Button
            asChild
            variant="gold"
            size="sm"
            className="hidden md:inline-flex"
          >
            <Link href="/book">Book Now</Link>
          </Button>
          <button
            onClick={() => setOpen(true)}
            className="rounded-full p-2 hover:bg-muted md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" className="font-display text-lg font-semibold">
              Kemekem
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-4 border-t border-border" />
            <Button asChild variant="gold" size="lg" className="w-full">
              <Link href="/book">Book Appointment</Link>
            </Button>
            <a
              href="tel:+251924657777"
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium"
            >
              <Phone className="h-4 w-4" />
              Call Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}