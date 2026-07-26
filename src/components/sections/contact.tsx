"use client";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/fade-in";

export function Contact() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    e.currentTarget.reset();
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-tight">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <FadeIn>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Contact
            </p>
            <h2 className="heading-2 text-balance">Get in touch</h2>
            <p className="mt-4 text-muted-foreground">
              Questions, feedback, or partnership inquiries — we&apos;d love to
              hear from you.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600 dark:bg-gold-900/20">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Phone</div>
                  <a
                    href="tel:+251924657777"
                    className="font-medium hover:text-gold-600"
                  >
                    +251 924 657 777
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600 dark:bg-gold-900/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                  <a
                    href="mailto:kemekemedia01@gmail.com"
                    className="font-medium hover:text-gold-600"
                  >
                    kemekemedia01@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600 dark:bg-gold-900/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Locations</div>
                  <div className="font-medium">Piassa Shopping Mall, 6th Floor</div>
                  <div className="text-sm text-muted-foreground">
                    Sapphire Addis Hotel, 11th Floor, Bole
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600 dark:bg-gold-900/20">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Hours</div>
                  <div className="font-medium">Monday – Sunday</div>
                  <div className="text-sm text-muted-foreground">
                    8:00 AM – 8:00 PM
                  </div>
                </div>
              </li>
            </ul>
          </FadeIn>

          <FadeIn delay={150}>
            <form
              onSubmit={onSubmit}
              className="luxury-card p-7"
            >
              <h3 className="text-xl font-semibold">Send us a message</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required placeholder="Your name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" required placeholder="+251 ..." />
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required placeholder="How can we help?" rows={4} />
              </div>
              <Button type="submit" variant="gold" size="lg" className="mt-6 w-full">
                Send message
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                <CheckCircle2 className="mr-1 inline h-3 w-3 text-green-600" />
                We typically respond within 1 business hour.
              </p>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}