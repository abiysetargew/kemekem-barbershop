import { ShieldCheck, Award, Sparkles, Clock, Users, Heart } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Barbers",
    text: "Every barber is vetted and trained to deliver consistent, premium results.",
  },
  {
    icon: Award,
    title: "Premium Products",
    text: "We use only top-tier grooming products for an exceptional experience.",
  },
  {
    icon: Sparkles,
    title: "Hygienic Spaces",
    text: "Spotless tools, sanitized stations, and a luxury atmosphere.",
  },
  {
    icon: Clock,
    title: "Easy Booking",
    text: "Reserve your slot in seconds — choose branch, service, barber & time.",
  },
  {
    icon: Users,
    title: "Two Locations",
    text: "Piassa and Bole branches — same premium standard, both modern malls.",
  },
  {
    icon: Heart,
    title: "Loved by Thousands",
    text: "Thousands of happy customers, 4.9★ average rating, and counting.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding">
      <div className="container-tight">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Why Choose Us
            </p>
            <h2 className="heading-2 text-balance">
              The grooming standard for modern men
            </h2>
            <p className="mt-4 text-muted-foreground">
              Six reasons customers across Addis Ababa keep coming back.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={i * 80}>
              <div className="luxury-card group h-full p-7">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-50 text-gold-600 transition-transform group-hover:scale-110 dark:bg-gold-900/20">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}