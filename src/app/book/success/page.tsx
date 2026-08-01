"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Scissors,
  ArrowRight,
  Copy,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { formatCurrency } from "@/lib/utils";
import { ShareButton } from "@/components/layout/share-button";
import { useAppointments, useServices, useBarbers, useBranches, useBusinessSettings } from "@/lib/store";
import type { Appointment } from "@/types/database";
import { Receipt } from "@/components/booking/receipt";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id") || "";
  const [appointments] = useAppointments();
  const [services] = useServices();
  const [barbers] = useBarbers();
  const [branches] = useBranches();
  const [settings] = useBusinessSettings();
  const [copied, setCopied] = useState(false);

  const appt = appointments.find((a) => a.id === id) as Appointment | undefined;

  if (!appt) {
    return (
      <section className="min-h-screen pt-32 pb-20">
        <div className="container-tight max-w-2xl text-center">
          <h1 className="heading-2">Booking not found</h1>
          <p className="mt-3 text-muted-foreground">
            The booking may be in another browser. Try booking again.
          </p>
          <Link href="/book">
            <Button variant="gold" className="mt-6">Book again</Button>
          </Link>
        </div>
      </section>
    );
  }

  const svc = services.find((s) => s.id === appt.service_id);
  const barber = barbers.find((b) => b.id === appt.barber_id);
  const branch = branches.find((b) => b.id === appt.branch_id);

  const copy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(appt.appointment_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section className="min-h-screen pt-32 pb-20">
      <div className="container-tight max-w-3xl">
        <FadeIn>
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full border-2 border-foreground bg-foreground/10 text-foreground">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="display mt-6 text-5xl sm:text-6xl">
              You&apos;re all set.
            </h1>
            <p className="mt-3 text-muted-foreground">
              We can&apos;t wait to see you. Save your appointment number below.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={120}>
          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="bg-foreground p-6 text-background">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-background/60">
                    Confirmation number
                  </div>
                  <div className="display mt-1 text-3xl font-semibold">
                    {appt.appointment_number}
                  </div>
                </div>
                <button
                  onClick={copy}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/15 backdrop-blur hover:bg-background/25"
                  aria-label="Copy"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="divide-y divide-border p-6 text-sm">
              <Row icon={Scissors} label="Service">
                {svc?.name} · {svc ? formatCurrency(svc.price) : ""}
              </Row>
              <Row icon={User} label="Barber">{barber?.name || "Any barber"}</Row>
              <Row icon={MapPin} label="Branch">{branch?.name}</Row>
              <Row icon={Calendar} label="Date">
                {new Date(appt.appointment_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Row>
              <Row icon={Clock} label="Time">
                {appt.start_time.slice(0, 5)} – {appt.end_time.slice(0, 5)}
              </Row>
              <Row icon={User} label="Phone">{appt.customer_phone}</Row>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={240}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="outline" size="lg">
              <Link href={`/manage/${appt.cancel_token}`}>Manage booking</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print / Save PDF
            </Button>
            <ShareButton />
            <Button asChild variant="gold" size="lg">
              <Link href="/">
                Back home
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>

      {/* Hidden receipt for printing — shown when window.print() invoked */}
      <div className="hidden print:block">
        <Receipt appt={appt} svc={svc} barber={barber} branch={branch} settings={settings} />
      </div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-display text-base">{children}</div>
      </div>
    </div>
  );
}