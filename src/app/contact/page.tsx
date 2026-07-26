import { Contact } from "@/components/sections/contact";
import { getBranches } from "@/lib/data";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Kemekem Barbershop — visit, call, or message us. Two premium branches in Addis Ababa.",
};

export default async function ContactPage() {
  const branches = await getBranches();

  return (
    <>
      <section className="bg-muted/30 pt-32 pb-16">
        <div className="container-tight text-center">
          <h1 className="heading-1 text-balance">Get in touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Visit, call, or send a message. We&apos;re happy to help.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          <div className="grid gap-5 md:grid-cols-2">
            {branches.map((b, i) => (
              <FadeIn key={b.id} delay={i * 100}>
                <div className="luxury-card h-full p-7">
                  <h2 className="font-display text-2xl font-semibold">{b.name}</h2>
                  <ul className="mt-6 space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                      <span>{b.address}, {b.city}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-gold-600" />
                      <a href={`tel:${b.phone}`} className="hover:text-foreground">
                        {b.phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-3">
                      <Clock className="h-4 w-4 shrink-0 text-gold-600" />
                      <span>Mon – Sun · 8:00 AM – 8:00 PM</span>
                    </li>
                  </ul>
                  {b.maps_url && (
                    <Button asChild variant="gold" className="mt-6 w-full">
                      <a href={b.maps_url} target="_blank" rel="noopener noreferrer">
                        <Navigation className="mr-2 h-4 w-4" />
                        Get directions
                      </a>
                    </Button>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}