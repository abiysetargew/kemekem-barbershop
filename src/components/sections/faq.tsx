"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Do I need an appointment or can I walk in?",
    a: "We strongly recommend booking online to guarantee your preferred time and barber. Walk-ins are welcome but subject to availability.",
  },
  {
    q: "Can I choose my barber?",
    a: "Yes — during booking you can pick your favorite barber. If you're flexible, choose 'Any barber' and we'll match you with the next available.",
  },
  {
    q: "How do I cancel or reschedule?",
    a: "Use the link in your confirmation or go to Manage Booking. You can cancel or reschedule up to 2 hours before your appointment.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash, mobile payments (Telebirr, CBE Birr), and major cards. Online payment coming soon.",
  },
  {
    q: "Where are you located?",
    a: "Piassa Branch — Piassa Shopping Mall, 6th Floor. Bole Branch — Sapphire Addis Hotel, 11th Floor.",
  },
  {
    q: "Do you offer kids haircuts?",
    a: "Yes — children's cuts are gentle, quick, and tailored to all ages.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-padding">
      <div className="container-tight">
        <div className="grid items-start gap-12 md:grid-cols-[1fr_1.5fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="eyebrow text-muted-foreground">FAQ</p>
            <h2 className="heading-2 mt-3">Questions, answered</h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know before booking.
            </p>
          </motion.div>

          <div className="space-y-2">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "overflow-hidden rounded-2xl border border-border transition-colors",
                    isOpen ? "bg-muted/30" : "bg-card"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg">{item.q}</span>
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}