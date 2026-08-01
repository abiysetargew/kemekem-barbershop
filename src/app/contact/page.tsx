"use client";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useBranches, useBusinessSettings } from "@/lib/store";

export default function ContactPage() {
  const [branches] = useBranches();
  const [settings] = useBusinessSettings();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent. We&apos;ll respond within an hour.");
    e.currentTarget.reset();
  };

  return (
    <>
      <section className="bg-foreground pb-20 pt-40 text-background">
        <div className="container-tight text-center">
          <p className="eyebrow text-background/60">Reach out</p>
          <h1 className="display mt-3 text-5xl sm:text-7xl">Talk to us</h1>
          <p className="mx-auto mt-5 max-w-2xl text-background/70">
            Questions, feedback, or partnership inquiries — we&apos;d love to hear.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          <div className="grid gap-6 md:grid-cols-2">
            {branches.filter((b) => b.is_active).map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="lift rounded-3xl border border-border bg-card p-8"
              >
                <h2 className="display text-2xl">{b.name}</h2>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                    <span>{b.address}, {b.city}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-foreground" />
                    <a href={`tel:${b.phone}`} className="hover:text-foreground">{b.phone}</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-foreground" />
                    <a href={`mailto:${settings.email}`} className="hover:text-foreground">{settings.email}</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="h-5 w-5 shrink-0 text-foreground" />
                    <span>Mon – Sun · {b.working_hours?.open} – {b.working_hours?.close}</span>
                  </li>
                </ul>
                {b.maps_url && (
                  <a
                    href={b.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-all hover:opacity-90"
                  >
                    <MapPin className="h-4 w-4" />
                    Get directions
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-3xl border border-border bg-card p-8"
          >
            <h2 className="display text-3xl sm:text-4xl">Send us a message</h2>
            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Your name">
                  <input
                    required
                    placeholder="Your name"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    required
                    type="tel"
                    placeholder="+251 ..."
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </Field>
              </div>
              <Field label="Email">
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </Field>
              <Field label="Message">
                <textarea
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </Field>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90"
              >
                <Send className="h-4 w-4" />
                Send message
              </button>
            </form>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              We typically respond within an hour during business hours.
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}