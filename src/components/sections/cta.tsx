"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-tight">
        <div className="relative overflow-hidden rounded-3xl bg-foreground p-10 text-background md:p-16">
          <div className="absolute inset-0 -z-10">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 20%, hsl(var(--background) / 0.3), transparent 50%), radial-gradient(circle at 70% 80%, hsl(var(--background) / 0.2), transparent 50%)`,
              }}
            />
          </div>
          <div className="relative grid items-center gap-10 md:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="eyebrow text-background/60">Ready when you are</p>
              <h2 className="heading-2 mt-3 text-background">
                Look sharp. <span className="display-italic">Today.</span>
              </h2>
              <p className="mt-5 max-w-xl text-background/70">
                Book your appointment in under 60 seconds. Choose your branch,
                service, barber, and time — done.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link
                href="/book"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-background px-8 py-4 text-base font-medium text-foreground transition-all hover:scale-[1.02] hover:shadow-2xl"
              >
                Book Your Appointment
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
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