"use client";
import { ShieldCheck, Award, Sparkles, Clock, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Skilled Team",
    text: "Every barber is vetted and trained to deliver consistent, premium results.",
  },
  {
    icon: Award,
    title: "Premium Products",
    text: "We use only top-tier grooming products for an exceptional experience.",
  },
  {
    icon: Sparkles,
    title: "Spotless Spaces",
    text: "Sanitized stations, polished tools, and a refined atmosphere.",
  },
  {
    icon: Clock,
    title: "Effortless Booking",
    text: "Reserve your slot in seconds — pick branch, service, barber and time.",
  },
  {
    icon: Users,
    title: "Two Locations",
    text: "Piassa and Bole branches — the same premium standard in both.",
  },
  {
    icon: Heart,
    title: "Loved by Thousands",
    text: "Thousands of satisfied clients and a 4.9★ average rating.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-muted-foreground">Why choose us</p>
          <h2 className="heading-2 mt-3">A standard, not just a service</h2>
          <p className="mt-4 text-muted-foreground">
            Six reasons customers across Addis Ababa keep coming back.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="lift rounded-2xl border border-border bg-card p-7"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}