import Link from "next/link";
import { MapPin, Phone, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { getBranches } from "@/lib/data";

export async function Branches() {
  const branches = await getBranches();

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-tight">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Locations
            </p>
            <h2 className="heading-2 text-balance">Two premium branches</h2>
            <p className="mt-4 text-muted-foreground">
              Visit us at either of our beautifully designed locations.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {branches.map((branch, i) => (
            <FadeIn key={branch.id} delay={i * 120}>
              <div className="luxury-card group h-full overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gold-100 to-gold-300 dark:from-gold-900 dark:to-gold-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-white/40" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-7">
                  <h3 className="font-display text-2xl font-semibold">{branch.name}</h3>
                  <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                      <span>{branch.address}, {branch.city}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-gold-600" />
                      <a href={`tel:${branch.phone}`} className="hover:text-foreground">
                        {branch.phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-3">
                      <Clock className="h-4 w-4 shrink-0 text-gold-600" />
                      <span>Open daily · 8:00 AM – 8:00 PM</span>
                    </li>
                  </ul>
                  <div className="mt-6 flex gap-2">
                    {branch.maps_url && (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={branch.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Directions
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                    <Button asChild variant="gold" size="sm">
                      <Link href={`/book?branch=${branch.id}`}>
                        Book at this branch
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}