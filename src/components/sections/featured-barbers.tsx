import { Star, Flame } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Avatar } from "@/components/ui/avatar";
import { getBarbers, getFeaturedBarbers } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";

export async function FeaturedBarbers() {
  const [barbers, featured] = await Promise.all([getBarbers(), getFeaturedBarbers()]);
  const list = featured.length > 0 ? featured : barbers.slice(0, 4);
  const popular = list[0];

  return (
    <section className="section-padding">
      <div className="container-tight">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Featured Barbers
            </p>
            <h2 className="heading-2 text-balance">Meet our master barbers</h2>
            <p className="mt-4 text-muted-foreground">
              Skilled, friendly, and trained in the latest styles.
            </p>
          </div>
        </FadeIn>

        {popular && (
          <FadeIn delay={150}>
            <div className="mt-12 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-foreground to-foreground/95 p-6 text-background md:p-10">
              <div className="grid items-center gap-8 md:grid-cols-[260px_1fr]">
                <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-2xl border-4 border-gold-500/30 md:w-60">
                  <Avatar
                    src={popular.photo_url || FALLBACK_AVATAR}
                    alt={popular.name}
                    size="2xl"
                    className="h-full w-full rounded-none"
                  />
                </div>
                <div>
                  <Badge variant="gold" className="mb-3">
                    <Flame className="mr-1 h-3 w-3" /> Most Popular
                  </Badge>
                  <h3 className="font-display text-3xl font-semibold md:text-4xl">
                    {popular.name}
                  </h3>
                  <p className="mt-1 text-sm text-gold-300">
                    {popular.experience_years}+ years experience
                  </p>
                  <p className="mt-4 max-w-xl text-background/80">
                    {popular.bio}
                  </p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="h-4 w-4 fill-gold-500 text-gold-500"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-background/70">
                      {popular.rating} · {popular.experience_years}+ years
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.slice(1, 5).map((barber, i) => (
            <FadeIn key={barber.id} delay={i * 80}>
              <div className="luxury-card group overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden">
                  <Avatar
                    src={barber.photo_url || FALLBACK_AVATAR}
                    alt={barber.name}
                    size="2xl"
                    className="h-full w-full rounded-none"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{barber.name}</h4>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                      {barber.rating}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {barber.experience_years}+ years experience
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}