import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star, Award, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBusinessSettings } from "@/lib/data";
import { FadeIn } from "@/components/ui/fade-in";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&q=80";

export async function Hero() {
  const settings = await getBusinessSettings();
  const heroImage = settings?.hero_image_url || FALLBACK_HERO;

  return (
    <section className="relative isolate overflow-hidden bg-foreground text-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt="Kemekem Barbershop"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/60 to-foreground" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-transparent to-foreground/40" />
      </div>

      {/* Decorative gold line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="container-tight relative flex min-h-[100svh] flex-col justify-center pb-20 pt-32 md:pt-40">
        <FadeIn>
          <Badge variant="gold" className="mb-6 backdrop-blur-md">
            <Sparkles className="mr-1.5 h-3 w-3" />
            Premium Grooming · Addis Ababa
          </Badge>
        </FadeIn>

        <FadeIn delay={120}>
          <h1 className="heading-1 text-balance text-background">
            Look Sharp.{" "}
            <span className="font-display italic gold-text">Book</span>{" "}
            <br className="hidden sm:block" />
            in Seconds.
          </h1>
        </FadeIn>

        <FadeIn delay={240}>
          <p className="mt-6 max-w-xl text-base text-background/70 sm:text-lg text-balance">
            Professional grooming experience with skilled barbers, premium
            services, and effortless online booking — across two premium
            locations in Addis Ababa.
          </p>
        </FadeIn>

        <FadeIn delay={360}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="gold" size="lg">
              <Link href="/book">
                Book Appointment
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-background/20 bg-background/10 text-background hover:bg-background hover:text-foreground backdrop-blur-md"
            >
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={480}>
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-background/70">
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
              4.9 / 5 rating
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Verified barbers
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Open today · 8AM – 8PM
            </span>
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Since 2015
            </span>
          </div>
        </FadeIn>
      </div>

      {/* Scroll indicator */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center md:bottom-8">
        <div className="h-10 w-6 rounded-full border-2 border-background/30 p-1.5">
          <div className="h-1.5 w-full animate-bounce rounded-full bg-gold-500" />
        </div>
      </div>
    </section>
  );
}