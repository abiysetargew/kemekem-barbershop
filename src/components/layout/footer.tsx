"use client";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useBusinessSettings, useBranches, useSocials } from "@/lib/store";
import { getSocialIcon, getSocialLabel } from "@/lib/social";
import { ShareButton } from "@/components/layout/share-button";

export function Footer() {
  const [settings] = useBusinessSettings();
  const [branches] = useBranches();
  const [socials] = useSocials();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-tight py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                <Image
                  src="/logo.png"
                  alt={settings.business_name}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-display text-lg font-semibold">
                  {settings.business_name}
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Premium Grooming
                </div>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              {settings.tagline}
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                {socials.map((s) => {
                  const Icon = getSocialIcon(s.platform as any);
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-all hover:border-foreground hover:-translate-y-0.5"
                      aria-label={getSocialLabel(s.platform as any)}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
                <ShareButton />
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link href="/book" className="hover:text-foreground">Book Appointment</Link></li>
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/manage" className="hover:text-foreground">Manage Booking</Link></li>
              <li><Link href="/admin/login" className="hover:text-foreground">Admin</Link></li>
              <li><Link href="/staff" className="hover:text-foreground">Staff</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Branches
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {branches.filter((b) => b.is_active).map((b) => (
                <li key={b.id}>
                  <div className="font-medium text-foreground">{b.name}</div>
                  <div className="mt-1 flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{b.address}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>Mon – Sun<br />8:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
          </p>
          <p>{settings.footer_text}</p>
        </div>
      </div>
    </footer>
  );
}