import Link from "next/link";
import { CheckCircle2, Calendar, Clock, MapPin, User, Scissors, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createServerClient } from "@/lib/supabase/client";
import { FadeIn } from "@/components/ui/fade-in";
import { formatCurrency } from "@/lib/utils";
import { ShareButton } from "@/components/layout/share-button";
import { CopyButton } from "@/components/ui/copy-button";

export const metadata = { title: "Booking Confirmed" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const supabase = await createServerClient();
  const { data: appt } = id
    ? await supabase.from("appointments").select("*").eq("id", id).single()
    : { data: null };

  if (!appt) {
    return (
      <section className="min-h-screen pt-32 pb-20">
        <div className="container-tight text-center">
          <h1 className="heading-2">Booking not found</h1>
          <p className="mt-3 text-muted-foreground">Please check your link or contact us.</p>
          <Button asChild variant="gold" className="mt-6">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </section>
    );
  }

  const [{ data: branch }, { data: service }, { data: barber }] = await Promise.all([
    supabase.from("branches").select("*").eq("id", (appt as any).branch_id).single(),
    supabase.from("services").select("*").eq("id", (appt as any).service_id).single(),
    supabase.from("barbers").select("*").eq("id", (appt as any).barber_id).single(),
  ]);

  return (
    <section className="min-h-screen pt-32 pb-20">
      <div className="container-tight max-w-3xl">
        <FadeIn>
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="heading-1 mt-6 text-balance">You&apos;re all set!</h1>
            <p className="mt-3 text-muted-foreground">
              We&apos;ve sent your confirmation. See you soon.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={120}>
          <div className="luxury-card mt-10 overflow-hidden">
            <div className="bg-gold-gradient p-6 text-white">
              <div className="text-xs uppercase tracking-wider opacity-80">Appointment</div>
              <CopyButton value={(appt as any).appointment_number} />
            </div>

            <div className="divide-y divide-border p-6 text-sm">
              <Row icon={Scissors} label="Service">
                {(service as any)?.name} · {formatCurrency((service as any)?.price)}
              </Row>
              <Row icon={User} label="Barber">{(barber as any)?.name}</Row>
              <Row icon={MapPin} label="Branch">{(branch as any)?.name}</Row>
              <Row icon={Calendar} label="Date">
                {new Date((appt as any).appointment_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Row>
              <Row icon={Clock} label="Time">
                {(appt as any).start_time.slice(0, 5)} – {(appt as any).end_time.slice(0, 5)}
              </Row>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={240}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="outline">
              <Link href={`/manage/${(appt as any).cancel_token}`}>Manage booking</Link>
            </Button>
            <ShareButton />
            <Button asChild variant="gold">
              <Link href="/">
                Back home
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
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
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{children}</div>
      </div>
    </div>
  );
}