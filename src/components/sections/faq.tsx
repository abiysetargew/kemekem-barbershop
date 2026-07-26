"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Do I need an appointment or can I walk in?",
    a: "We strongly recommend booking online to guarantee your preferred time and barber. Walk-ins are welcome but subject to availability.",
  },
  {
    q: "Can I choose my barber?",
    a: "Yes — during booking you can pick your favorite barber. If you're flexible, choose 'Any barber' and we'll match you with the next available professional.",
  },
  {
    q: "How do I cancel or reschedule?",
    a: "Open your booking confirmation link or go to the Manage Booking page. You can cancel or reschedule up to 2 hours before your appointment.",
  },
  {
    q: "Do you offer kids haircuts?",
    a: "Yes, our Kids Haircut service is gentle, quick, and tailored to children of all ages.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Cash, mobile payments (Telebirr, CBE Birr), and all major cards. Online payment options are coming soon.",
  },
  {
    q: "Where are you located?",
    a: "Piassa Branch — Piassa Shopping Mall, 6th Floor. Bole Branch — Sapphire Addis Hotel, 11th Floor.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-padding">
      <div className="container-tight">
        <div className="grid items-start gap-12 md:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              FAQ
            </p>
            <h2 className="heading-2 text-balance">Questions, answered</h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know before booking.
            </p>
          </div>

          <div className="space-y-2">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "overflow-hidden rounded-2xl border border-border/60 transition-colors",
                    isOpen ? "bg-muted/40" : "bg-card"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium">{item.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180 text-foreground"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-muted-foreground">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}