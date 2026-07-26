import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-tight">
        <div className="relative overflow-hidden rounded-3xl bg-foreground p-10 text-background md:p-16">
          <div className="absolute inset-0 -z-10 bg-gold-gradient opacity-10" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="heading-2 text-balance text-background">
                Ready to look sharp?
              </h2>
              <p className="mt-4 max-w-xl text-background/70">
                Book your appointment in under 60 seconds. Choose your branch,
                service, barber, and time — done.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button asChild variant="gold" size="xl">
                <Link href="/book">
                  Book Your Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <a
                href="tel:+251924657777"
                className="text-sm text-background/70 hover:text-background"
              >
                or call +251 924 657 777
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}